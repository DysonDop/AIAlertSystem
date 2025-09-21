import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Clock } from 'lucide-react';
import AlertCard from '../components/alerts/AlertCard.jsx';
import Navigation from '../components/layout/Navigation.jsx';
import { alertService, searchService } from '../services/api.js';
import '../styles/pages/alerts.css';

// Manual Alerts Component
function AlertsList() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    async function loadAlerts() {
      try {
        const resp = await fetch("https://kj5uk03dk9.execute-api.us-east-1.amazonaws.com/alerts/manual");
        const data = await resp.json();
        setAlerts(data.alerts || []);
      } catch (error) {
        console.error('Failed to load manual alerts:', error);
      }
    }
    loadAlerts();
  }, []);

  return (
    <div className="manual-alerts-section">
      <h3>Manual Alerts</h3>
      <div className="manual-alerts-list">
        {alerts.length === 0 ? (
          <p>No manual alerts available</p>
        ) : (
          alerts.map(a => (
            <div key={a.id} className="manual-alert-item">
              <span className={`alert-type ${a.severity?.toLowerCase()}`}>{a.type}</span>
              <span className="alert-severity">{a.severity}</span>
              <span className="alert-description">{a.description}</span>
              <span className="alert-time">{new Date(a.createdAt).toLocaleString()}</span>
            </div>
          ))
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
  const [filters, setFilters] = useState({
    alertTypes: [],
    severity: [],
    source: [],
  });

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
        <AlertsList />
      </div>
    </div>
  );
};

export default AlertsPage;