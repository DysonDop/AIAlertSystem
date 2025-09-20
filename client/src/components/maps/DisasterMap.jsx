import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DisasterMap = ({
  alerts,
  center = { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
  zoom = 10,
  height = '500px',
  onAlertClick,
  showRadius = true,
}) => {
  const getMarkerColor = (severity) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const createCustomIcon = (alert) => {
    const color = getMarkerColor(alert.severity);
    return L.divIcon({
      html: `
        <div style="
          background-color: ${color};
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 10px;
          font-weight: bold;
        ">
          ${getAlertEmoji(alert.type)}
        </div>
      `,
      className: 'custom-div-icon',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  const getAlertEmoji = (type) => {
    switch (type) {
      case 'earthquake': return '🌍';
      case 'flood': return '🌊';
      case 'fire': return '🔥';
      case 'storm': return '⛈️';
      case 'tsunami': return '🌊';
      case 'hurricane': return '🌀';
      case 'tornado': return '🌪️';
      default: return '⚠️';
    }
  };

  const getRadiusColor = (severity) => {
    switch (severity) {
      case 'critical': return '#fecaca';
      case 'high': return '#fed7aa';
      case 'medium': return '#fef3c7';
      case 'low': return '#dbeafe';
      default: return '#f3f4f6';
    }
  };

  return (
    <div style={{ height }} className="rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {alerts.map((alert) => (
          <React.Fragment key={alert.id}>
            {/* Alert Radius */}
            {showRadius && (
              <Circle
                center={[alert.location.lat, alert.location.lng]}
                radius={alert.location.radius * 1000} // Convert km to meters
                fillColor={getRadiusColor(alert.severity)}
                fillOpacity={0.2}
                color={getMarkerColor(alert.severity)}
                opacity={0.6}
                weight={2}
              />
            )}
            
            {/* Alert Marker */}
            <Marker
              position={[alert.location.lat, alert.location.lng]}
              icon={createCustomIcon(alert)}
              eventHandlers={{
                click: () => onAlertClick?.(alert),
              }}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{getAlertEmoji(alert.type)}</span>
                    <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>Severity: <span className="font-medium">{alert.severity}</span></div>
                    <div>Location: {alert.location.address}</div>
                    <div>Time: {new Date(alert.timestamp).toLocaleString()}</div>
                    <div>Status: <span className={alert.isActive ? 'text-green-600' : 'text-gray-600'}>
                      {alert.isActive ? 'Active' : 'Inactive'}
                    </span></div>
                  </div>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
};

export default DisasterMap;
