import React from 'react';
import { AlertTriangle, Clock, MapPin } from 'lucide-react';

const AlertCard = ({ alert, onClick }) => {
  const getAlertIcon = (type) => {
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

  return (
    <div
      className={`alert-card ${alert.severity}`}
      onClick={() => onClick?.(alert)}
    >
      <div className="alert-card-header">
        <div className="alert-card-content">
          <div className="alert-card-icon">{getAlertIcon(alert.type)}</div>
          <div className="alert-card-details">
            <div className="alert-card-title">
              <h3>{alert.title}</h3>
              <span className={`badge badge-${alert.severity}`}>
                {alert.severity.toUpperCase()}
              </span>
            </div>
            <p className="alert-card-description">{alert.description}</p>
            
            <div className="alert-card-meta">
              <div className="alert-card-meta-item">
                <MapPin className="alert-card-meta-icon" />
                <span>{alert.location.address}</span>
              </div>
              <div className="alert-card-meta-item">
                <Clock className="alert-card-meta-icon" />
                <span>{new Date(alert.timestamp).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`alert-card-status ${alert.isActive ? 'active' : 'inactive'}`}>
          <div className={`status-indicator ${alert.isActive ? 'status-active' : 'status-inactive'}`} />
          <span>{alert.isActive ? 'Active' : 'Inactive'}</span>
        </div>
      </div>
      
      {alert.recommendations && alert.recommendations.length > 0 && (
        <div className="alert-card-recommendations">
          <div className="alert-card-recommendations-header">
            <AlertTriangle className="icon" />
            <span className="alert-card-recommendations-title">Recommendations:</span>
          </div>
          <ul className="alert-card-recommendations-list">
            {alert.recommendations.slice(0, 2).map((rec, index) => (
              <li key={index}>
                <span className="alert-card-recommendations-bullet">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AlertCard;
