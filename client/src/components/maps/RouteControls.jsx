import React, { useState, useRef } from 'react';

const RouteControls = ({ onRoutesGenerated, googleMapsService }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const originRef = useRef();
  const destinationRef = useRef();

  const handleGenerateRoutes = async () => {
    const origin = originRef.current?.value?.trim();
    const destination = destinationRef.current?.value?.trim();

    if (!origin || !destination) {
      setError('Please enter both origin and destination');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/getRoute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin,
          destination,
          alternatives: true
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        onRoutesGenerated(data.routes, origin, destination);
      } else {
        throw new Error('No routes found for the specified locations');
      }
    } catch (err) {
      console.error('Error generating routes:', err);
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFindSafeZones = async () => {
    const location = destinationRef.current?.value?.trim();

    if (!location) {
      setError('Please enter a destination to find nearby safe zones');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/getSafeZones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location,
          radius: 5000, // 5km radius
          type: 'hospital'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.safeZones && data.safeZones.length > 0) {
        // Clear existing markers and add safe zone markers
        if (googleMapsService) {
          googleMapsService.clearMarkers();
          data.safeZones.forEach(zone => {
            googleMapsService.addSafeZoneMarker(zone);
          });
          
          // Center map on the location
          if (data.safeZones[0]?.location) {
            googleMapsService.setCenter({
              lat: data.safeZones[0].location.lat,
              lng: data.safeZones[0].location.lng
            }, 13);
          }
        }
      } else {
        throw new Error('No safe zones found in the specified area');
      }
    } catch (err) {
      console.error('Error finding safe zones:', err);
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearMap = () => {
    if (googleMapsService) {
      googleMapsService.clearMarkers();
      googleMapsService.clearPolylines();
    }
    
    // Clear form inputs
    if (originRef.current) originRef.current.value = '';
    if (destinationRef.current) destinationRef.current.value = '';
    
    setError(null);
  };

  return (
    <div className="route-controls">
      <div className="route-form">
        <h3>Route Planning</h3>
        
        <div className="input-group">
          <label htmlFor="origin">Origin:</label>
          <input
            ref={originRef}
            type="text"
            id="origin"
            placeholder="Enter starting location (e.g., San Francisco, CA)"
            disabled={isGenerating}
          />
        </div>

        <div className="input-group">
          <label htmlFor="destination">Destination:</label>
          <input
            ref={destinationRef}
            type="text"
            id="destination"
            placeholder="Enter destination (e.g., Oakland, CA)"
            disabled={isGenerating}
          />
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <div className="button-group">
          <button
            onClick={handleGenerateRoutes}
            disabled={isGenerating}
            className="primary-button"
          >
            {isGenerating ? (
              <>
                <span className="loading-spinner small"></span>
                Generating...
              </>
            ) : (
              'Generate Routes'
            )}
          </button>

          <button
            onClick={handleFindSafeZones}
            disabled={isGenerating}
            className="secondary-button"
          >
            {isGenerating ? (
              <>
                <span className="loading-spinner small"></span>
                Finding...
              </>
            ) : (
              'Find Safe Zones'
            )}
          </button>

          <button
            onClick={handleClearMap}
            disabled={isGenerating}
            className="clear-button"
          >
            Clear Map
          </button>
        </div>

        <div className="help-text">
          <p><strong>Tip:</strong> Use specific addresses or landmarks for better results.</p>
          <p>Safe zones will show nearby hospitals and emergency shelters.</p>
        </div>
      </div>
    </div>
  );
};

export default RouteControls;