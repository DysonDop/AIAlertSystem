import React, { useState, useEffect } from 'react';
import { Search, Users, MapPin, Clock, Phone, AlertTriangle } from 'lucide-react';
import DisasterMap from '../components/maps/DisasterMap';
import { alertService, searchService } from '../services/api';

const SearchPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('incidents');
  const [showReportForm, setShowReportForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const alertsData = await alertService.getActiveAlerts();
        setAlerts(alertsData);
        
        // Mock incidents data for development
        const mockIncidents = [
          {
            id: '1',
            type: 'missing_person',
            title: 'Missing Person - John Doe',
            description: 'Last seen near Golden Gate Bridge. Wearing blue jacket.',
            location: {
              lat: 37.8199,
              lng: -122.4783,
              address: 'Golden Gate Bridge, SF',
            },
            priority: 'high',
            status: 'reported',
            reportedAt: new Date().toISOString(),
            contactInfo: '(555) 123-4567',
            peopleInvolved: 1,
          },
          {
            id: '2',
            type: 'trapped',
            title: 'Person Trapped in Building',
            description: 'Earthquake damage has trapped individual on 3rd floor.',
            location: {
              lat: 37.7749,
              lng: -122.4194,
              address: 'Downtown SF Office Building',
            },
            priority: 'critical',
            status: 'responding',
            reportedAt: new Date(Date.now() - 1800000).toISOString(),
            peopleInvolved: 1,
          },
        ];
        setIncidents(mockIncidents);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'badge-critical';
      case 'high': return 'badge-high';
      case 'medium': return 'badge-medium';
      case 'low': return 'badge-low';
      default: return 'badge-low';
    }
  };

  const getIncidentIcon = (type) => {
    switch (type) {
      case 'missing_person': return Users;
      case 'trapped': return AlertTriangle;
      case 'medical_emergency': return Phone;
      case 'evacuation_needed': return MapPin;
      default: return AlertTriangle;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading search and rescue data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Search & Rescue</h1>
          <p className="page-subtitle">
            Monitor missing persons, trapped individuals, and coordinate rescue operations
          </p>
        </div>

        {/* Search Bar */}
        <div className="content-card mb-8">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search incidents, locations, or people..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs mb-8">
          <button
            className={`tab ${activeTab === 'incidents' ? 'active' : ''}`}
            onClick={() => setActiveTab('incidents')}
          >
            Incidents ({incidents.length})
          </button>
          <button
            className={`tab ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            Related Alerts ({alerts.length})
          </button>
        </div>

        {/* Content Grid */}
        <div className="main-content-grid">
          {/* Incidents/Alerts List */}
          <div className="content-card">
            <div className="content-card-header">
              <h2 className="content-card-title">
                {activeTab === 'incidents' ? 'Active Incidents' : 'Related Alerts'}
              </h2>
              <button 
                className="btn btn-primary"
                onClick={() => setShowReportForm(true)}
              >
                Report Incident
              </button>
            </div>

            <div className="incidents-list">
              {activeTab === 'incidents' ? (
                incidents.map((incident) => {
                  const IconComponent = getIncidentIcon(incident.type);
                  return (
                    <div key={incident.id} className="incident-card">
                      <div className="incident-header">
                        <IconComponent className="incident-icon" />
                        <div className="incident-title-section">
                          <h3 className="incident-title">{incident.title}</h3>
                          <span className={`badge ${getPriorityColor(incident.priority)}`}>
                            {incident.priority.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <p className="incident-description">{incident.description}</p>
                      <div className="incident-meta">
                        <div className="meta-item">
                          <MapPin className="meta-icon" />
                          <span>{incident.location.address}</span>
                        </div>
                        <div className="meta-item">
                          <Clock className="meta-icon" />
                          <span>{new Date(incident.reportedAt).toLocaleString()}</span>
                        </div>
                        <div className="meta-item">
                          <Users className="meta-icon" />
                          <span>{incident.peopleInvolved} person(s)</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                alerts.map((alert) => (
                  <div key={alert.id} className="alert-card">
                    <div className="alert-header">
                      <AlertTriangle className="alert-icon" />
                      <div className="alert-title-section">
                        <h3 className="alert-title">{alert.title}</h3>
                        <span className={`badge badge-${alert.severity}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <p className="alert-description">{alert.description}</p>
                    <div className="alert-meta">
                      <div className="meta-item">
                        <MapPin className="meta-icon" />
                        <span>{alert.location.address}</span>
                      </div>
                      <div className="meta-item">
                        <Clock className="meta-icon" />
                        <span>{new Date(alert.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Map */}
          <div className="content-card">
            <div className="content-card-header">
              <h2 className="content-card-title">Location Map</h2>
            </div>
            <DisasterMap
              alerts={alerts}
              height="500px"
              showRadius={true}
              onAlertClick={(alert) => console.log('Alert clicked:', alert)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;