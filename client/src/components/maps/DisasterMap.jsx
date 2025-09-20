import React, { useState, useEffect, useRef } from 'react';
import GoogleMapsService from '../../services/googleMapsService.js';

const DisasterMap = ({ 
  alerts = [], 
  routes = [], 
  safeZones = [], 
  onAlertClick, 
  center = { lat: 37.7749, lng: -122.4194 }, 
  zoom = 12 
}) => {
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef();
  const googleMapsServiceRef = useRef(null);

  useEffect(() => {
    const initializeMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if Google Maps API key is available
        if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
          throw new Error('Google Maps API key not found. Please check your environment variables.');
        }

        // Initialize Google Maps service
        googleMapsServiceRef.current = new GoogleMapsService();
        
        // Initialize the map
        await googleMapsServiceRef.current.initializeMap(mapRef.current, {
          center,
          zoom,
          mapTypeId: 'roadmap'
        });

        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing Google Maps:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    if (mapRef.current) {
      initializeMap();
    }

    // Cleanup function
    return () => {
      if (googleMapsServiceRef.current) {
        googleMapsServiceRef.current.clearMarkers();
        googleMapsServiceRef.current.clearPolylines();
      }
    };
  }, []);

  useEffect(() => {
    if (!googleMapsServiceRef.current || isLoading) return;

    // Clear existing markers and polylines
    googleMapsServiceRef.current.clearMarkers();
    googleMapsServiceRef.current.clearPolylines();

    // Add alert markers
    alerts.forEach(alert => {
      googleMapsServiceRef.current.addAlertMarker(alert, (clickedAlert) => {
        setSelectedAlert(clickedAlert);
        if (onAlertClick) {
          onAlertClick(clickedAlert);
        }
      });
    });

    // Add safe zone markers
    safeZones.forEach(zone => {
      googleMapsServiceRef.current.addSafeZoneMarker(zone);
    });

    // Display routes
    if (routes.length > 0 && routes[0].encodedPolyline) {
      // Use the origin and destination from the first route
      const origin = { lat: routes[0].legs[0].startLocation.lat, lng: routes[0].legs[0].startLocation.lng };
      const destination = { lat: routes[0].legs[0].endLocation.lat, lng: routes[0].legs[0].endLocation.lng };
      googleMapsServiceRef.current.displayRoutes(routes, origin, destination);
    }
  }, [alerts, routes, safeZones, onAlertClick, isLoading]);

  useEffect(() => {
    if (!googleMapsServiceRef.current || isLoading) return;

    // Update map center when center prop changes
    googleMapsServiceRef.current.setCenter(center, zoom);
  }, [center, zoom, isLoading]);

  if (error) {
    return (
      <div className="disaster-map error-state">
        <div className="error-message">
          <h3>Map Loading Error</h3>
          <p>{error}</p>
          <p>Please check your Google Maps API configuration and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="disaster-map">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading Google Maps...</p>
          </div>
        </div>
      )}
      <div
        ref={mapRef}
        className="map-container"
        style={{ 
          height: '100%', 
          width: '100%',
          display: isLoading ? 'none' : 'block'
        }}
      />
    </div>
  );
};

export default DisasterMap;
