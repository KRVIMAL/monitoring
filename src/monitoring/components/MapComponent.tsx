// src/monitoring/components/MapComponent.tsx
import React, { useRef, useEffect, useState } from "react";
import { useGoogleMaps } from "../hooks/useGoogleMaps";
import moment from "moment";
import MapSidebar, { TabType } from "./MapSidebar";
import DeviceTable from "./DeviceTable";
import { FaChevronRight } from "react-icons/fa";

// Define API response types
interface DeviceTracking {
  imei: string;
  lastTracking: {
    dateTime: string;
    latitude: number;
    longitude: number;
    speed: number;
    upTs: string;
    bearing: number;
    batteryPercentage: number;
    deviceType: string;
  };
}

interface TrackingResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    userId: string;
    devices: DeviceTracking[];
  };
}

interface Device {
  id: string;
  imei: string;
  label: string;
  batteryPercentage: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  lastActive: string;
  isFavorite: boolean;
  type: "truck" | "lock" | "gps";
  deviceType: string;
  speed?: number;
  bearing?: number;
}

interface MapComponentProps {
  activeDeviceTypes: string[];
}

const API_URL=import.meta.env.VITE_API_DEV_URL;

const MapComponent: React.FC<MapComponentProps> = ({ activeDeviceTypes }) => {
  const mapRef: any = useRef<HTMLDivElement>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const markerClustererRef = useRef<any>(null);
  const clustererLoadedRef = useRef(false);

  // State for devices, table visibility, and selected device
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeviceTable, setShowDeviceTable] = useState(true);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<TabType>("Status");

  const { google, map, isLoaded }: any = useGoogleMaps(
    mapRef,
    { lat: 20.5937, lng: 78.9629 },
    5
  );

  // Function to fetch devices from API
  const fetchDevices = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        API_URL,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch devices");
      }

      const data: TrackingResponse = await response.json();

      if (data.success && data.data.devices) {
        // Transform API response to our Device format
        const mappedDevices: Device[] = data.data.devices.map((device) => {
          // Determine device type based on deviceType field
          let type: "truck" | "lock" | "gps" = "gps";
          if (device.lastTracking.deviceType.includes("traqloc")) {
            type = "lock"; // E lock type
          } else if (device.lastTracking.deviceType.includes("truck")) {
            type = "truck";
          }

          // Format the dateTime to a readable "time ago" format
          const lastActive = moment
            .utc(device.lastTracking.upTs)
            .local()
            .fromNow();
          return {
            id: device.imei,
            imei: device.imei,
            label: `Device ${device.imei.slice(-4)}`,
            batteryPercentage: device.lastTracking.batteryPercentage,
            coordinates: {
              lat: device.lastTracking.latitude,
              lng: device.lastTracking.longitude,
            },
            lastActive,
            originalDateTime: device.lastTracking.upTs,
            isFavorite: false,
            type,
            deviceType: device.lastTracking.deviceType,
            speed: device.lastTracking.speed,
            bearing: device.lastTracking.bearing,
          };
        });

        setDevices(mappedDevices);
      } else {
        throw new Error(data.message || "Failed to fetch devices");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching devices:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch devices on component mount
  useEffect(() => {
    fetchDevices();

    // Set up refresh interval (e.g., every 30 seconds)
    const intervalId = setInterval(() => {
      fetchDevices();
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  // Filter devices based on active device types
  const filteredDevices = devices.filter((device) => {
    if (activeDeviceTypes.includes("lock") && device.type === "lock")
      return true;
    if (activeDeviceTypes.includes("vehicle") && device.type === "truck")
      return true;
    if (activeDeviceTypes.includes("gps") && device.type === "gps") return true;
    if (activeDeviceTypes.includes("device")) return true;
    return false;
  });

  // Add markers when the map is loaded, devices are loaded, or active device types change
  useEffect(() => {
    if (!isLoaded || !map || !google || loading || filteredDevices.length === 0)
      return;

    // Clear existing markers
    if (markersRef.current.length > 0) {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    }

    // Clear existing marker clusterer
    if (markerClustererRef.current) {
      markerClustererRef.current.clearMarkers?.();
      markerClustererRef.current = null;
    }

    // Create bounds to fit all markers
    const bounds = new google.maps.LatLngBounds();

    // Create markers
    const markers = filteredDevices.map((device) => {
      // Determine pin color based on battery percentage
      let iconUrl = "https://maps.google.com/mapfiles/ms/icons/green-dot.png";

      if (device.batteryPercentage <= 20) {
        iconUrl = "https://maps.google.com/mapfiles/ms/icons/red-dot.png";
      } else if (device.batteryPercentage <= 60) {
        iconUrl = "https://maps.google.com/mapfiles/ms/icons/orange-dot.png";
      }

      // Create the marker
      const marker = new google.maps.Marker({
        position: device.coordinates,
        map: map,
        title: device.label,
        icon: {
          url: iconUrl,
          scaledSize: new google.maps.Size(30, 30),
        },
      });

      // Create info window for the marker
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h3 style="margin: 0 0 8px; font-weight: bold;">${device.label}</h3>
            <p style="margin: 4px 0;"><strong>IMEI:</strong> ${device.imei}</p>
            <p style="margin: 4px 0;"><strong>Battery:</strong> ${device.batteryPercentage}%</p>
            <p style="margin: 4px 0;"><strong>Last Active:</strong> ${device.lastActive}</p>           
            <p style="margin: 4px 0;"><strong>Type:</strong> ${device.type === "lock" ? "E Lock" : device.type}</p>
            ${device.speed !== undefined ? `<p style="margin: 4px 0;"><strong>Speed:</strong> ${device.speed} km/h</p>` : ""}
          </div>
        `,
      });

      // Add click event to show info window and select device
      marker.addListener("click", () => {
        infoWindow.open(map, marker);
        setSelectedDeviceId(device.id);
      });

      // Extend bounds to include this marker
      bounds.extend(device.coordinates);

      return marker;
    });

    // Store the markers
    markersRef.current = markers;

    // Fit map to bounds if we have markers
    if (filteredDevices.length > 0) {
      map.fitBounds(bounds);

      // Don't zoom in too far
      google.maps.event.addListenerOnce(map, "idle", () => {
        if (map.getZoom() && map.getZoom() > 15) {
          map.setZoom(15);
        }
      });
    }

    // Load MarkerClusterer dynamically
    const loadMarkerClusterer = () => {
      if (clustererLoadedRef.current) {
        // MarkerClusterer already loaded, just create a new instance
        if (window.markerClusterer && window.markerClusterer.MarkerClusterer) {
          markerClustererRef.current =
            new window.markerClusterer.MarkerClusterer({
              markers,
              map,
            });
        }
        return;
      }

      const script = document.createElement("script");
      script.src =
        "https://unpkg.com/@googlemaps/markerclusterer@2.0.8/dist/index.min.js";
      script.async = true;

      script.onload = () => {
        clustererLoadedRef.current = true;
        if (window.markerClusterer && window.markerClusterer.MarkerClusterer) {
          markerClustererRef.current =
            new window.markerClusterer.MarkerClusterer({
              markers,
              map,
            });
        }
      };

      document.head.appendChild(script);
    };

    loadMarkerClusterer();
  }, [isLoaded, map, google, loading, filteredDevices, activeDeviceTypes]);

  // Toggle device table visibility
  const toggleDeviceTable = () => {
    setShowDeviceTable(!showDeviceTable);
  };

  // Handle tab change in sidebar
  const handleTabChange = (tab: TabType) => {
    setSelectedTab(tab);
  };

  // Handle selecting a device
  const handleSelectDevice = (device: Device) => {
    setSelectedDeviceId(device.id);

    // Center map on device
    if (map && device.coordinates) {
      map.setCenter(device.coordinates);
      map.setZoom(15);
    }
  };

  return (
    <div className="w-full h-[700px] max-w-[1532px] mx-auto rounded-lg overflow-hidden shadow-md border border-gray-200 relative">
      {/* Loading indicator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
            <button
              className="absolute top-0 right-0 px-4 py-3"
              onClick={() => setError(null)}
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Map container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Device Table */}
      {showDeviceTable && (
        <div className="absolute top-0 left-0 z-20">
          <DeviceTable
            devices={filteredDevices}
            selectedDeviceId={selectedDeviceId}
            onSelectDevice={handleSelectDevice}
            onHideTable={toggleDeviceTable}
            isLoading={loading}
          />
        </div>
      )}

      {/* Show Table Button - Only visible when table is hidden */}
      {!showDeviceTable && (
        <button
          onClick={toggleDeviceTable}
          className="absolute top-1/2 left-2 -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow-md"
        >
          <FaChevronRight className="text-gray-500" />
        </button>
      )}

      {/* Sidebar Component - Only visible when device table is not shown */}
      {isLoaded && !showDeviceTable && (
        <MapSidebar
          onTabChange={handleTabChange}
          selectedTab={selectedTab}
          selectedDevice={
            filteredDevices.find((d) => d.id === selectedDeviceId) || null
          }
        />
      )}
    </div>
  );
};

declare global {
  interface Window {
    markerClusterer: {
      MarkerClusterer: any;
    };
  }
}

export default MapComponent;
