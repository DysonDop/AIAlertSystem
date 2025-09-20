import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Route as RouteIcon } from 'lucide-react';
import DisasterMap from '../components/maps/DisasterMap.jsx';
import { alertService, routeService } from '../services/api';
import '../styles/pages/map.css';

const MapPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRoutes, setShowRoutes] = useState(false);
  const [routeOrigin, setRouteOrigin] = useState(null);
  const [routeDestination, setRouteDestination] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const data = await alertService.getActiveAlerts();
        setAlerts(data);
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
        // Mock data for development
        const mockAlerts = [
          {
            id: '1',
            type: 'earthquake',
            severity: 'high',
            title: 'Magnitude 6.2 Earthquake',
            description: 'Strong earthquake detected near downtown area.',
            location: {
              lat: 37.7749,
              lng: -122.4194,
              address: 'San Francisco, CA',
              radius: 25,
            },
            timestamp: new Date().toISOString(),
            source: 'meteorological',
            isActive: true,
          },
          {
            id: '2',
            type: 'flood',
            severity: 'critical',
            title: 'Flash Flood Warning',
            description: 'Severe flooding in low-lying areas.',
            location: {
              lat: 37.7849,
              lng: -122.4094,
              address: 'Mission District, SF',
              radius: 15,
            },
            timestamp: new Date().toISOString(),
            source: 'twitter',
            isActive: true,
          },
        ];
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

  const handleGetRoutes = async () => {
    if (!routeOrigin || !routeDestination) return;
    
    try {
      const routeData = await routeService.getOptimalRoutes(routeOrigin, routeDestination);
      setRoutes(routeData);
      setShowRoutes(true);
    } catch (error) {
      console.error('Failed to get routes:', error);
      // Mock route data
      const mockRoutes = [
        {
          id: '1',
          origin: routeOrigin,
          destination: routeDestination,
          waypoints: [],
          distance: 15000,
          duration: 1200,
          instructions: ['Head north', 'Turn right', 'Continue straight'],
          alertsOnRoute: [],
          isRecommended: true,
        },
      ];
      setRoutes(mockRoutes);
      setShowRoutes(true);
    }
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
          
          {/* Route Planning */}
          <div className="route-planning">
            <h2 className="route-planning-title">Route Planning</h2>
            <div className="route-form">
              <div className="route-input-group">
                <label className="route-input-label">
                  Origin
                </label>
                <input
                  type="text"
                  placeholder="Enter starting location"
                  className="route-input"
                />
              </div>
              <div className="route-input-group">
                <label className="route-input-label">
                  Destination
                </label>
                <input
                  type="text"
                  placeholder="Enter destination"
                  className="route-input"
                />
              </div>
              <button
                onClick={handleGetRoutes}
                className="route-button"
              >
                <Navigation className="route-button-icon" />
                Get Safe Routes
              </button>
            </div>
          </div>

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

          {/* Routes */}
          {showRoutes && routes.length > 0 && (
            <div className="routes-section">
              <h2 className="routes-section-title">
                Recommended Routes
              </h2>
              <div className="routes-list">
                {routes.map((route, index) => (
                  <div
                    key={route.id}
                    className="route-item"
                  >
                    <div className="route-header">
                      <RouteIcon className="route-icon" />
                      <span className="route-title">
                        Route {index + 1} {route.isRecommended && '(Recommended)'}
                      </span>
                    </div>
                    <div className="route-details">
                      <div>Distance: {(route.distance / 1000).toFixed(1)} km</div>
                      <div>Time: {Math.round(route.duration / 60)} minutes</div>
                      <div>Alerts on route: {route.alertsOnRoute.length}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="map-container">
        <DisasterMap
          alerts={alerts}
          height="100vh"
          showRadius={true}
          onAlertClick={handleAlertClick}
          center={{ lat: 37.7749, lng: -122.4194 }}
          zoom={12}
        />
      </div>
    </div>
  );
};

export default MapPage;