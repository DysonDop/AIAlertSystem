import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Route as RouteIcon } from 'lucide-react';
import DisasterMap from '../components/maps/DisasterMap';
import { alertService, routeService } from '../services/api';
import type { Alert, Route } from '../types';

const MapPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRoutes, setShowRoutes] = useState(false);
  const [routeOrigin, setRouteOrigin] = useState<{ lat: number; lng: number } | null>(null);
  const [routeDestination, setRouteDestination] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const data = await alertService.getActiveAlerts();
        setAlerts(data);
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
        // Mock data for development
        const mockAlerts: Alert[] = [
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

  const handleAlertClick = (alert: Alert) => {
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
      const mockRoutes: Route[] = [
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emergency-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg overflow-y-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Live Map</h1>
          
          {/* Route Planning */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Route Planning</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Origin
                </label>
                <input
                  type="text"
                  placeholder="Enter starting location"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emergency-500 focus:border-emergency-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination
                </label>
                <input
                  type="text"
                  placeholder="Enter destination"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emergency-500 focus:border-emergency-500"
                />
              </div>
              <button
                onClick={handleGetRoutes}
                className="w-full flex items-center justify-center px-4 py-2 bg-emergency-600 text-white rounded-md hover:bg-emergency-700 transition-colors"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Get Safe Routes
              </button>
            </div>
          </div>

          {/* Active Alerts */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Active Alerts ({alerts.length})
            </h2>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedAlert?.id === alert.id
                      ? 'bg-emergency-50 border-emergency-200'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => handleAlertClick(alert)}
                >
                  <div className="flex items-start space-x-2">
                    <span className="text-lg">
                      {alert.type === 'earthquake' ? '🌍' : 
                       alert.type === 'flood' ? '🌊' : 
                       alert.type === 'fire' ? '🔥' : '⚠️'}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm">{alert.title}</h3>
                      <p className="text-xs text-gray-600 mt-1">{alert.location.address}</p>
                      <div className="flex items-center mt-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                          alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                          alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
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
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Recommended Routes
              </h2>
              <div className="space-y-3">
                {routes.map((route, index) => (
                  <div
                    key={route.id}
                    className="p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <RouteIcon className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-900">
                        Route {index + 1} {route.isRecommended && '(Recommended)'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
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
      <div className="flex-1">
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