import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Clock, Bell } from 'lucide-react';
import AlertCard from '../components/alerts/AlertCard.jsx';
import Navigation from '../components/layout/Navigation.jsx';
import MapReport from '../components/maps/MapReport.jsx';
import { alertService, searchService } from '../services/api.js';
import '../styles/pages/alerts.css';

// AWS Manual Alerts Component
function ManualAlertsComponent({ refreshTrigger }) {
  const [alerts, setAlerts] = useState([]);

  const loadAlerts = async () => {
    try {
      const resp = await fetch("https://kj5uk03dk9.execute-api.us-east-1.amazonaws.com/alerts/manual");
      const data = await resp.json();
      setAlerts(data.alerts || []);
    } catch (error) {
      console.error('Failed to load manual alerts:', error);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [refreshTrigger]); // Refresh when refreshTrigger changes

  return (
    <div className="aws-manual-alerts">
      <div className="aws-alerts-list">
        {alerts.length === 0 ? (
          <p>No manual alerts available</p>
        ) : (
          alerts.map((a, index) => {
            return (
              <div 
                key={a.id || a.SK || index} 
                className="aws-alert-item"
                style={{
                  border: '2px solid red',
                  padding: '1rem',
                  margin: '0.5rem 0',
                  backgroundColor: 'white',
                  color: 'black'
                }}
              >
                <div style={{marginBottom: '0.5rem'}}>
                  <span className={`alert-type ${a.severity?.toLowerCase()}`}>
                    {a.type || 'Alert'}
                  </span>
                </div>
                <div style={{marginBottom: '0.5rem'}}>
                  <span className="alert-severity">{a.severity || 'HIGH'}</span>
                </div>
                <div style={{marginBottom: '0.5rem'}}>
                  <span className="alert-description">
                    {a.description || a.title || 'Manual alert reported'}
                  </span>
                </div>
                <div style={{marginBottom: '0.25rem'}}>
                  <span className="alert-status">Status: {a.status || 'OPEN'}</span>
                </div>
                <div>
                  <span className="alert-time">
                    {new Date(a.createdAt).toLocaleString()}
                  </span>
                </div>
            </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add refresh trigger
  const [filters, setFilters] = useState({
    alertTypes: [],
    severity: [],
    source: [],
  });

  // Function to refresh manual alerts
  const refreshManualAlerts = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const data = await alertService.getAlerts(filters);
        setAlerts(data);
        setFilteredAlerts(data);
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
        // Mock alerts placeholder - Replace with real data later
        const mockAlerts = [];
        setAlerts(mockAlerts);
        setFilteredAlerts(mockAlerts);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [filters]);

  useEffect(() => {
    // Filter alerts based on search term
    if (searchTerm) {
      const filtered = alerts.filter(alert =>
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.location.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAlerts(filtered);
    } else {
      setFilteredAlerts(alerts);
    }
  }, [searchTerm, alerts]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const alertTypes = ['earthquake', 'flood', 'fire', 'storm', 'tsunami', 'hurricane', 'tornado'];
  const severityLevels = ['low', 'medium', 'high', 'critical'];
  const sources = ['twitter', 'meteorological', 'manual'];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="alerts-page">
      <div className="alerts-container">
        {/* Header */}
        <div className="alerts-header">
          <h1 className="alerts-title">Disaster Alerts</h1>
          <p className="alerts-subtitle">
            Monitor and manage all disaster alerts and incidents
          </p>
        </div>

        {/* Search and Filters */}
        <div className="search-filters-panel">
          <div className="search-filters-row">
            {/* Search Bar */}
            <div className="search-container">
              <div className="search-input-wrapper">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search alerts..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="filter-toggle-btn"
            >
              <Filter className="filter-toggle-icon" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="filter-panel">
              <div className="filter-grid">
                {/* Alert Types */}
                <div>
                  <label className="filter-label">
                    Alert Types
                  </label>
                  <div className="filter-options">
                    {alertTypes.map((type) => (
                      <label key={type} className="filter-option">
                        <input
                          type="checkbox"
                          className="filter-checkbox"
                          checked={filters.alertTypes.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleFilterChange('alertTypes', [...filters.alertTypes, type]);
                            } else {
                              handleFilterChange('alertTypes', filters.alertTypes.filter(t => t !== type));
                            }
                          }}
                        />
                        <span className="filter-option-label">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Severity */}
                <div>
                  <label className="filter-label">
                    Severity
                  </label>
                  <div className="filter-options">
                    {severityLevels.map((severity) => (
                      <label key={severity} className="filter-option">
                        <input
                          type="checkbox"
                          className="filter-checkbox"
                          checked={filters.severity.includes(severity)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleFilterChange('severity', [...filters.severity, severity]);
                            } else {
                              handleFilterChange('severity', filters.severity.filter(s => s !== severity));
                            }
                          }}
                        />
                        <span className="filter-option-label">{severity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Source */}
                <div>
                  <label className="filter-label">
                    Source
                  </label>
                  <div className="filter-options">
                    {sources.map((source) => (
                      <label key={source} className="filter-option">
                        <input
                          type="checkbox"
                          className="filter-checkbox"
                          checked={filters.source.includes(source)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleFilterChange('source', [...filters.source, source]);
                            } else {
                              handleFilterChange('source', filters.source.filter(s => s !== source));
                            }
                          }}
                        />
                        <span className="filter-option-label">{source}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="results-header">
          <div className="results-info">
            <h2 className="results-count">
              {filteredAlerts.length} Alert{filteredAlerts.length !== 1 ? 's' : ''}
            </h2>
            {searchTerm && (
              <span className="search-term-display">
                for "{searchTerm}"
              </span>
            )}
          </div>
          
          <select className="sort-select">
            <option>Sort by newest</option>
            <option>Sort by severity</option>
            <option>Sort by location</option>
          </select>
        </div>

        {/* Alerts List */}
        <div className="alerts-list">
          {filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onClick={(alert) => console.log('Alert clicked:', alert)}
            />
          ))}
        </div>

        {filteredAlerts.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">
              <MapPin />
            </div>
            <h3 className="no-results-title">No alerts found</h3>
            <p className="no-results-description">
              {searchTerm ? 'Try adjusting your search terms or filters.' : 'There are no alerts at this time.'}
            </p>
          </div>
        )}

        {/* Manual Alerts Section */}
        <div className="manual-alerts-section">
          <h2>
            <Bell size={20} />
            Manual Alerts
          </h2>
          <ManualAlertsComponent refreshTrigger={refreshTrigger} />
        </div>

        {/* Submit Alert Section */}
        <div className="submit-alert-section" style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: 'var(--color-background-secondary)',
          borderRadius: '6px',
          border: '1px solid var(--color-border)'
        }}>
          <h3 style={{
            color: 'var(--color-text-primary)',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1rem',
            fontWeight: '600'
          }}>
            <MapPin size={16} />
            Submit New Alert
          </h3>
          <MapReport onAlertSubmitted={refreshManualAlerts} />
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;