// hooks/useGoogleMaps.ts - fixed version
import { useState, useEffect, useRef, RefObject } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
interface UseGoogleMapsReturn {
  google: typeof google | null;
  map: google.maps.Map | null;
  isLoaded: boolean;
  error: Error | null;
}

export const useGoogleMaps = (
  mapRef: RefObject<HTMLDivElement>,
  defaultCenter = { lat: 20.5937, lng: 78.9629 },
  defaultZoom = 12
): UseGoogleMapsReturn => {
  const [google, setGoogle] = useState<typeof window.google | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Use a ref to track initialization status
  const initialized = useRef(false);
  
  // Load Google Maps API - run only once
  useEffect(() => {
    if (initialized.current) return;
    
    initialized.current = true;
    
    const loadGoogleMaps = async () => {
      try {
        const loader = new Loader({
          apiKey: API_KEY,
          version: "weekly",
          libraries: ["places", "geometry"],
        });
        
        const googleMaps = await loader.load();
        setGoogle(googleMaps);
        setIsLoaded(true);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error("Error loading Google Maps:", error);
        setError(error);
      }
    };
    
    loadGoogleMaps();
  }, []);
  
  // Initialize Map - separate dependency list
  useEffect(() => {
    if (!google || !isLoaded || !mapRef?.current || map) return;
    
    try {
      const mapInstance = new google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: defaultZoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
      });
      
      setMap(mapInstance);
      
      if (mapRef.current) {
        mapRef.current.style.height = "100%";
        mapRef.current.style.width = "100%";
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error("Error initializing map:", error);
      setError(error);
    }
  }, [google, isLoaded, mapRef]);
  
  return { google, map, isLoaded, error };
};