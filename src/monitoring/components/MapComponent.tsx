// src/monitoring/components/MapComponent.tsx
import React, { useRef, useEffect, useState } from 'react';
import { useGoogleMaps } from '../hooks/useGoogleMaps';
import dummyDevices from '../../data/dummyDevices.json';
import MapSidebar, { TabType } from './MapSidebar';
import HeaderIcons from './HeaderIcons';
import DeviceTable from './DeviceTable';
import { FaChevronRight } from 'react-icons/fa';

interface Device {
  id?: string;
  imei: string;
  label: string;
  tripStartDate?: string;
  batteryPercentage: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  lastActive: string;
  isFavorite?: boolean;
  tripId?: string;
  deviceType: string;
  type?: 'truck' | 'lock' | 'gps';
}

interface MapComponentProps {
  activeDeviceTypes: string[];
}

const MapComponent: React.FC<MapComponentProps> = ({ activeDeviceTypes }) => {
  const mapRef:any = useRef<HTMLDivElement>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const markerClustererRef = useRef<any>(null);
  const clustererLoadedRef = useRef(false);
  
  // State for the sidebar tab
  const [selectedTab, setSelectedTab] = useState<TabType>('Status');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showDeviceTable, setShowDeviceTable] = useState(true);
  const { google, map, isLoaded, error }:any = useGoogleMaps(mapRef, { lat: 20.5937, lng: 78.9629 }, 5);
  
  // Add markers when the map is loaded or active device types change
  useEffect(() => {
    if (!isLoaded || !map || !google) return;
    
    // Clear existing markers
    if (markersRef.current.length > 0) {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    }
    
    // Clear existing marker clusterer
    if (markerClustererRef.current) {
      markerClustererRef.current.clearMarkers?.();
      markerClustererRef.current = null;
    }
    
    // Filter devices based on active device types
    const activeDeviceTypesSet = new Set(activeDeviceTypes);
    const filteredDevices = dummyDevices.devices.filter(
      device => activeDeviceTypesSet.has(device.deviceType)
    );
    
    // Create bounds to fit all markers
    const bounds = new google.maps.LatLngBounds();
    
    // Create markers
    const markers = filteredDevices.map(device => {
      // Determine pin color based on battery percentage
      let iconUrl = 'https://maps.google.com/mapfiles/ms/icons/green-dot.png';
      
      if (device.batteryPercentage <= 20) {
        iconUrl = 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
      } else if (device.batteryPercentage <= 60) {
        iconUrl = 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png';
      }
      
      // Create the marker
      const marker = new google.maps.Marker({
        position: device.coordinates,
        map: map,
        title: device.label,
        icon: {
          url: iconUrl,
          scaledSize: new google.maps.Size(30, 30),
        }
      });
      
      // Create info window for the marker
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h3 style="margin: 0 0 8px; font-weight: bold;">${device.label}</h3>
            <p style="margin: 4px 0;"><strong>IMEI:</strong> ${device.imei}</p>
            <p style="margin: 4px 0;"><strong>Battery:</strong> ${device.batteryPercentage}%</p>
            <p style="margin: 4px 0;"><strong>Last Active:</strong> ${device.lastActive}</p>
            <p style="margin: 4px 0;"><strong>Type:</strong> ${device.deviceType}</p>
          </div>
        `
      });
      
      // Add click event to show info window
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
        // Set selected device
        setSelectedDevice({
          ...device,
          id: device.imei,
          type: getDeviceType(device.deviceType)
        });
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
      google.maps.event.addListenerOnce(map, 'idle', () => {
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
          markerClustererRef.current = new window.markerClusterer.MarkerClusterer({ 
            markers, 
            map 
          });
        }
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@googlemaps/markerclusterer@2.0.8/dist/index.min.js';
      script.async = true;
      
      script.onload = () => {
        clustererLoadedRef.current = true;
        if (window.markerClusterer && window.markerClusterer.MarkerClusterer) {
          markerClustererRef.current = new window.markerClusterer.MarkerClusterer({ 
            markers, 
            map 
          });
        }
      };
      
      document.head.appendChild(script);
    };
    
    loadMarkerClusterer();
    
  }, [isLoaded, map, google, activeDeviceTypes]);

  // Handle tab change in sidebar
  const handleTabChange = (tab: TabType) => {
    setSelectedTab(tab);
  };

  // Helper function to map deviceType to type for favorites
  const getDeviceType = (deviceType: string): 'truck' | 'lock' | 'gps' => {
    switch (deviceType) {
      case 'vehicle':
        return 'truck';
      case 'lock':
        return 'lock';
      case 'gps':
        return 'gps';
      default:
        return 'truck';
    }
  };

  // Handle selecting a device from favorites
  const handleSelectDevice = (device: any) => {
    setSelectedDevice(device);
    
    // Center map on device if we have coordinates
    if (map && device.coordinates) {
      map.setCenter(device.coordinates);
      map.setZoom(15);
    }
  };

  if (error) {
    return <div className="w-full h-[700px] flex items-center justify-center">Error loading Google Maps: {error.message}</div>;
  }

  const toggleDeviceTable = () => {
    setShowDeviceTable(!showDeviceTable);
  };

  return (
    <div className="w-full h-[700px] max-w-[1532px] mx-auto rounded-lg overflow-hidden shadow-md border border-gray-200 relative">
      {/* Map container */}
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Header Icons (Favorites, Filter, Settings) */}
      <HeaderIcons />
       {/* Device Table */}
       {showDeviceTable && (
        <div className="absolute top-0 left-0 z-20">
          <DeviceTable 
            onSelectDevice={handleSelectDevice} 
            onHideTable={toggleDeviceTable}
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
          selectedDevice={selectedDevice}
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