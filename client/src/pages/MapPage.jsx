import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Route as RouteIcon } from 'lucide-react';
import DisasterMap from '../components/maps/DisasterMap.jsx';
import RouteControls from '../components/maps/RouteControls.jsx';
import { alertService } from '../services/api.js';
import '../styles/pages/map.css';

const MapPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [safeZones, setSafeZones] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const googleMapsServiceRef = useRef(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const data = await alertService.getActiveAlerts();
        setAlerts(data);
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
        // Mock alerts placeholder - Replace with real data later
        const mockAlerts = [];
        setAlerts(mockAlerts);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const handleAlertClick = (alert) => {
    setSelectedAlert(alert);
  };

  const handleRoutesGenerated = (newRoutes, origin, destination) => {
    setRoutes(newRoutes);
    console.log('Routes generated:', newRoutes);
  };

  const handleMapServiceReady = (googleMapsService) => {
    googleMapsServiceRef.current = googleMapsService;
  };

  const getAlertEmoji = (type) => {
    switch (type) {
      case 'earthquake': return '🌍';
      case 'flood': return '🌊';
      case 'fire': return '🔥';
      default: return '⚠️';
    }
  };

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'critical': return 'critical';
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'low';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="map-page">
      {/* Sidebar */}
      <div className="map-sidebar">
        <div className="map-sidebar-content">
          <h1 className="map-title">Live Map</h1>
          
          {/* Route Controls */}
          <RouteControls
            onRoutesGenerated={handleRoutesGenerated}
            googleMapsService={googleMapsServiceRef.current}
          />

          {/* Active Alerts */}
          <div className="alerts-section">
            <h2 className="alerts-section-title">
              Active Alerts ({alerts.length})
            </h2>
            <div className="alerts-list">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`alert-item ${selectedAlert?.id === alert.id ? 'selected' : ''}`}
                  onClick={() => handleAlertClick(alert)}
                >
                  <div className="alert-content">
                    <span className="alert-emoji">
                      {getAlertEmoji(alert.type)}
                    </span>
                    <div className="alert-details">
                      <h3 className="alert-title">{alert.title}</h3>
                      <p className="alert-address">{alert.location.address}</p>
                      <div className="alert-badges">
                        <span className={`alert-severity-badge ${getSeverityClass(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="map-container">
        <DisasterMap
          alerts={alerts}
          routes={routes}
          safeZones={safeZones}
          onAlertClick={handleAlertClick}
          center={{ lat: 37.7749, lng: -122.4194 }}
          zoom={12}
        />
      </div>
    </div>
  );
};

export default MapPage;