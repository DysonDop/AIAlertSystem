import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Clock } from 'lucide-react';
import AlertCard from '../components/alerts/AlertCard.jsx';
import Navigation from '../components/layout/Navigation.jsx';
import { alertService, searchService } from '../services/api.js';
import '../styles/pages/alerts.css';

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
        // Mock data for development
        const mockAlerts = [
          {
            id: '1',
            type: 'earthquake',
            severity: 'high',
            title: 'Magnitude 6.2 Earthquake',
            description: 'Strong earthquake detected near downtown area. Buildings may be affected.',
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
            description: 'Severe flooding expected in low-lying areas due to heavy rainfall.',
            location: {
              lat: 37.7849,
              lng: -122.4094,
              address: 'Mission District, SF',
              radius: 15,
            },
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            source: 'twitter',
            isActive: true,
          },
          {
            id: '3',
            type: 'fire',
            severity: 'medium',
            title: 'Wildfire Alert',
            description: 'Wildfire spreading in rural areas. Evacuation may be necessary.',
            location: {
              lat: 37.7649,
              lng: -122.4294,
              address: 'Golden Gate Park, SF',
              radius: 10,
            },
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            source: 'meteorological',
            isActive: false,
          },
        ];
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
      </div>
    </div>
  );
};

export default AlertsPage;