import React, { useState, useEffect, useRef } from 'react';
import GoogleMapsService from '../../services/googleMapsService.js';
import '../../styles/components/map.css';

const DisasterMap = ({ 
  alerts = [], 
  routes = [], 
  safeZones = [], 
  onAlertClick, 
  defaultCenter = { lat: 3.1390, lng: 101.6869 }, // Fallback: Kuala Lumpur
  zoom = 12 
}) => {
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [showLocationNotification, setShowLocationNotification] = useState(false);
  const [showRainfallHeatmap, setShowRainfallHeatmap] = useState(false);
  const mapRef = useRef();
  const googleMapsServiceRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const heatmapLayerRef = useRef(null);

  // Mock rainfall data points
  const rainfallPoints = [
    { lat: 3.1390, lng: 101.6869, intensity: 0.9 }, // heavy rainfall KL
    { lat: 3.1450, lng: 101.6900, intensity: 0.6 }, // medium
    { lat: 3.1500, lng: 101.6800, intensity: 0.3 }, // light
    { lat: 3.1320, lng: 101.6850, intensity: 0.8 }, // heavy rainfall
    { lat: 3.1480, lng: 101.6950, intensity: 0.4 }, // light-medium
    { lat: 3.1420, lng: 101.6750, intensity: 0.7 }, // medium-heavy
    { lat: 3.1350, lng: 101.6920, intensity: 0.5 }, // medium
    { lat: 3.1470, lng: 101.6820, intensity: 0.2 }, // very light
  ];

  // Create user location marker element
  const createUserMarkerElement = () => {
    const element = document.createElement('div');
    element.style.cssText = `
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #4285F4;
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      position: relative;
    `;
    
    // Add pulsing animation with CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); opacity: 0.7; }
        50% { transform: scale(1.2); opacity: 0.3; }
        100% { transform: scale(1); opacity: 0.7; }
      }
    `;
    document.head.appendChild(style);
    
    const pulse = document.createElement('div');
    pulse.style.cssText = `
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background-color: #4285F4;
      opacity: 0.3;
      position: absolute;
      top: -6px;
      left: -6px;
      animation: pulse 2s infinite;
    `;
    
    element.appendChild(pulse);
    return element;
  };

  // Generate rainfall heatmap
  const generateRainfallHeatmap = () => {
    if (!mapInstanceRef.current || !googleMapsServiceRef.current.google) return;

    const google = googleMapsServiceRef.current.google;
    
    // Check if visualization library is loaded
    if (!google.maps.visualization || !google.maps.visualization.HeatmapLayer) {
      console.warn('Google Maps Visualization library not loaded');
      return;
    }
    
    // Convert rainfall points to heatmap data
    const heatmapData = rainfallPoints.map(point => ({
      location: new google.maps.LatLng(point.lat, point.lng),
      weight: point.intensity
    }));

    try {
      // Create heatmap layer
      heatmapLayerRef.current = new google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        map: showRainfallHeatmap ? mapInstanceRef.current : null,
        radius: 30,
        maxIntensity: 1.0,
      gradient: [
        'rgba(0, 255, 255, 0)',    // transparent
        'rgba(0, 255, 255, 1)',    // cyan (light rain)
        'rgba(0, 191, 255, 1)',    // deep sky blue
        'rgba(0, 127, 255, 1)',    // dodger blue
        'rgba(0, 63, 255, 1)',     // blue
        'rgba(0, 0, 255, 1)',      // pure blue
        'rgba(63, 0, 191, 1)',     // blue-purple
        'rgba(127, 0, 127, 1)',    // purple
        'rgba(191, 0, 63, 1)',     // red-purple
        'rgba(255, 0, 0, 1)',      // red (heavy rainfall)
        'rgba(255, 63, 0, 1)',     // orange-red
        'rgba(255, 127, 0, 1)',    // orange
        'rgba(255, 191, 0, 1)',    // yellow-orange
        'rgba(255, 255, 0, 1)'     // yellow (moderate)
      ]
      });
    } catch (error) {
      console.error('Error creating heatmap layer:', error);
    }
  };

  // Toggle rainfall heatmap
  const toggleRainfallHeatmap = () => {
    if (heatmapLayerRef.current) {
      const newState = !showRainfallHeatmap;
      setShowRainfallHeatmap(newState);
      heatmapLayerRef.current.setMap(newState ? mapInstanceRef.current : null);
    } else if (!showRainfallHeatmap) {
      setShowRainfallHeatmap(true);
      generateRainfallHeatmap();
    }
  };

  useEffect(() => {
    const initializeMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Initialize Google Maps service (API key fetched from backend)
        googleMapsServiceRef.current = new GoogleMapsService();
        
        // Get user location first, fallback to default
        const getUserLocation = () => {
          return new Promise((resolve) => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const userPos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                  };
                  setUserLocation(userPos);
                  // Show notification temporarily
                  setShowLocationNotification(true);
                  setTimeout(() => setShowLocationNotification(false), 3000); // Hide after 3 seconds
                  resolve(userPos);
                },
                (error) => {
                  let errorMessage = 'Location unavailable';
                  switch(error.code) {
                    case error.PERMISSION_DENIED:
                      errorMessage = 'Location access denied by user. Using default location.';
                      break;
                    case error.POSITION_UNAVAILABLE:
                      errorMessage = 'Location information unavailable. Using default location.';
                      break;
                    case error.TIMEOUT:
                      errorMessage = 'Location request timed out. Using default location.';
                      break;
                  }
                  console.warn(errorMessage, error);
                  resolve(defaultCenter);
                },
                {
                  enableHighAccuracy: false, // Less accurate but faster
                  timeout: 10000, // Reduced to 5 seconds
                  maximumAge: 60000 // 1 minute cache
                }
              );
            } else {
              console.warn('Geolocation not supported');
              resolve(defaultCenter);
            }
          });
        };

        const center = await getUserLocation();
        
        // Ensure the map container exists before initializing
        if (!mapRef.current) {
          throw new Error('Map container not found');
        }
        
        // Initialize the map with Map ID and user location
        mapInstanceRef.current = await googleMapsServiceRef.current.initializeMap(mapRef.current, {
          center,
          zoom,
          mapTypeId: 'roadmap'
        });

        // Add user location marker
        if (userLocation) {
          googleMapsServiceRef.current.addMarker(userLocation, {
            title: 'You are here',
            content: createUserMarkerElement()
          });
        }

        // Generate rainfall heatmap (initially hidden)
        generateRainfallHeatmap();

        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing Google Maps:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    // Use a small delay to ensure the DOM element is fully rendered
    const timer = setTimeout(() => {
      if (mapRef.current) {
        initializeMap();
      } else {
        console.error('Map container ref is null');
        setError('Map container not found');
        setIsLoading(false);
      }
    }, 100);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      if (googleMapsServiceRef.current) {
        googleMapsServiceRef.current.clearMarkers();
        googleMapsServiceRef.current.clearPolylines();
      }
      if (heatmapLayerRef.current) {
        heatmapLayerRef.current.setMap(null);
        heatmapLayerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!googleMapsServiceRef.current || isLoading || !mapInstanceRef.current) return;

    // Clear existing markers and polylines
    googleMapsServiceRef.current.clearMarkers();
    googleMapsServiceRef.current.clearPolylines();

    // Re-add user location marker if available
    if (userLocation) {
      googleMapsServiceRef.current.addMarker(userLocation, {
        title: 'You are here',
        content: createUserMarkerElement()
      });
    }

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

    // Auto-center on alerts if available
    if (alerts.length > 0) {
      const bounds = new googleMapsServiceRef.current.google.maps.LatLngBounds();
      
      // Include user location in bounds
      if (userLocation) {
        bounds.extend(userLocation);
      }
      
      // Include all alerts in bounds
      alerts.forEach(alert => {
        bounds.extend(alert.location);
      });
      
      // Fit map to show all markers
      mapInstanceRef.current.fitBounds(bounds, {
        padding: { top: 50, right: 50, bottom: 50, left: 50 }
      });
    }
  }, [alerts, routes, safeZones, onAlertClick, isLoading, userLocation]);

  useEffect(() => {
    if (!googleMapsServiceRef.current || isLoading || !mapInstanceRef.current) return;

    // Update map center when defaultCenter prop changes (but prefer user location)
    const centerToUse = userLocation || defaultCenter;
    googleMapsServiceRef.current.setCenter(centerToUse, zoom);
  }, [defaultCenter, zoom, isLoading, userLocation]);

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
            <p style={{ fontSize: '12px', opacity: 0.7 }}>
              {userLocation ? 'Getting your location...' : 'Using default location...'}
            </p>
          </div>
        </div>
      )}
      
      {/* Rainfall Heatmap Toggle */}
      <div className="map-controls">
        <div className="rainfall-heatmap-control">
          <label className="heatmap-toggle">
            <input
              type="checkbox"
              checked={showRainfallHeatmap}
              onChange={toggleRainfallHeatmap}
              disabled={isLoading}
            />
            <span className="toggle-label">🌧️ Rainfall Heatmap</span>
          </label>
        </div>
      </div>
      
      <div
        id="map"
        ref={mapRef}
        className="map-container"
        style={{ 
          height: '500px', 
          width: '100%',
          display: isLoading ? 'none' : 'block',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      />
      {showLocationNotification && (
        <div style={{ 
          position: 'fixed', 
          top: '20px', 
          right: '20px', 
          background: 'white', 
          color: 'black',
          padding: '12px 16px', 
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          fontSize: '14px',
          fontWeight: '500',
          zIndex: 10000,
          border: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'slideInRight 0.3s ease-out'
        }}>
          <span style={{ fontSize: '16px' }}>📍</span>
          <span>Your location detected successfully!</span>
        </div>
      )}
    </div>
  );
};

export default DisasterMap;
