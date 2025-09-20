import React, { useState, useEffect } from 'react';
import { Search, Users, MapPin, Clock, Phone, AlertTriangle } from 'lucide-react';
import DisasterMap from '../components/maps/DisasterMap';
import { alertService, searchService } from '../services/api';
import type { Alert } from '../types';

interface SearchAndRescueIncident {
  id: string;
  type: 'missing_person' | 'trapped' | 'medical_emergency' | 'evacuation_needed';
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'responding' | 'resolved';
  reportedAt: string;
  contactInfo?: string;
  peopleInvolved: number;
}

const SearchPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [incidents, setIncidents] = useState<SearchAndRescueIncident[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'incidents' | 'alerts'>('incidents');
  const [showReportForm, setShowReportForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const alertsData = await alertService.getActiveAlerts();
        setAlerts(alertsData);
        
        // Mock incidents data for development
        const mockIncidents: SearchAndRescueIncident[] = [
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
            status: 'responding',
            reportedAt: new Date(Date.now() - 3600000).toISOString(),
            contactInfo: '+1 (555) 123-4567',
            peopleInvolved: 1,
          },
          {
            id: '2',
            type: 'trapped',
            title: 'People Trapped in Flooding',
            description: 'Multiple people stranded on rooftop due to flash flooding.',
            location: {
              lat: 37.7849,
              lng: -122.4094,
              address: 'Mission District, SF',
            },
            priority: 'critical',
            status: 'reported',
            reportedAt: new Date(Date.now() - 1800000).toISOString(),
            peopleInvolved: 5,
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

  const getPriorityColor = (priority: SearchAndRescueIncident['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: SearchAndRescueIncident['status']) => {
    switch (status) {
      case 'reported': return 'bg-yellow-100 text-yellow-800';
      case 'responding': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIncidentIcon = (type: SearchAndRescueIncident['type']) => {
    switch (type) {
      case 'missing_person': return '👤';
      case 'trapped': return '🏠';
      case 'medical_emergency': return '🏥';
      case 'evacuation_needed': return '🚨';
      default: return '⚠️';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emergency-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading search & rescue data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Search & Rescue</h1>
            <p className="mt-2 text-gray-600">
              Coordinate rescue operations and manage emergency incidents
            </p>
          </div>
          
          <button
            onClick={() => setShowReportForm(true)}
            className="mt-4 lg:mt-0 flex items-center px-4 py-2 bg-emergency-600 text-white rounded-lg hover:bg-emergency-700 transition-colors"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Report Incident
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search incidents, locations, or people..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-emergency-500 focus:border-emergency-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Incidents List */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('incidents')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'incidents'
                      ? 'bg-emergency-100 text-emergency-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Incidents ({incidents.length})
                </button>
                <button
                  onClick={() => setActiveTab('alerts')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'alerts'
                      ? 'bg-emergency-100 text-emergency-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Related Alerts ({alerts.length})
                </button>
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {activeTab === 'incidents' ? (
                incidents.map((incident) => (
                  <div
                    key={incident.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{getIncidentIcon(incident.type)}</span>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{incident.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{incident.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{incident.location.address}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(incident.reportedAt).toLocaleString()}</span>
                      </div>
                      {incident.contactInfo && (
                        <div className="flex items-center space-x-1">
                          <Phone className="w-3 h-3" />
                          <span>{incident.contactInfo}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(incident.priority)}`}>
                          {incident.priority.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(incident.status)}`}>
                          {incident.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-xs text-gray-600">
                        <Users className="w-3 h-3" />
                        <span>{incident.peopleInvolved} people</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                alerts.map((alert) => (
                  <div key={alert.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <span className="text-lg">
                        {alert.type === 'earthquake' ? '🌍' : 
                         alert.type === 'flood' ? '🌊' : 
                         alert.type === 'fire' ? '🔥' : '⚠️'}
                      </span>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{alert.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                            alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {alert.severity.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Incident Locations</h2>
            <DisasterMap
              alerts={[...alerts, ...incidents.map(incident => ({
                id: incident.id,
                type: 'fire' as const, // Default type for incidents
                severity: incident.priority as any,
                title: incident.title,
                description: incident.description,
                location: {
                  ...incident.location,
                  radius: 5,
                },
                timestamp: incident.reportedAt,
                source: 'manual' as const,
                isActive: incident.status !== 'resolved',
              }))]}
              height="400px"
              showRadius={false}
              center={{ lat: 37.7749, lng: -122.4194 }}
              zoom={11}
            />
          </div>
        </div>

        {/* Report Form Modal (simplified placeholder) */}
        {showReportForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Report Incident</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Incident Type
                  </label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option>Missing Person</option>
                    <option>People Trapped</option>
                    <option>Medical Emergency</option>
                    <option>Evacuation Needed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Describe the incident..."
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowReportForm(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowReportForm(false)}
                    className="px-4 py-2 bg-emergency-600 text-white rounded-md hover:bg-emergency-700"
                  >
                    Submit Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;