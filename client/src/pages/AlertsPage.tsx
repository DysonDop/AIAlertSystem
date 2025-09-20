import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Clock } from 'lucide-react';
import AlertCard from '../components/alerts/AlertCard';
import { alertService, searchService } from '../services/api';
import type { Alert, SearchFilters } from '../types';

const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
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
        const mockAlerts: Alert[] = [
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

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const alertTypes: Alert['type'][] = ['earthquake', 'flood', 'fire', 'storm', 'tsunami', 'hurricane', 'tornado'];
  const severityLevels: Alert['severity'][] = ['low', 'medium', 'high', 'critical'];
  const sources: Alert['source'][] = ['twitter', 'meteorological', 'manual'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emergency-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Disaster Alerts</h1>
          <p className="mt-2 text-gray-600">
            Monitor and manage all disaster alerts and incidents
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search alerts..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-emergency-500 focus:border-emergency-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Alert Types */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alert Types
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {alertTypes.map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-emergency-600 focus:ring-emergency-500"
                          checked={filters.alertTypes.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleFilterChange('alertTypes', [...filters.alertTypes, type]);
                            } else {
                              handleFilterChange('alertTypes', filters.alertTypes.filter(t => t !== type));
                            }
                          }}
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Severity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Severity
                  </label>
                  <div className="space-y-2">
                    {severityLevels.map((severity) => (
                      <label key={severity} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-emergency-600 focus:ring-emergency-500"
                          checked={filters.severity.includes(severity)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleFilterChange('severity', [...filters.severity, severity]);
                            } else {
                              handleFilterChange('severity', filters.severity.filter(s => s !== severity));
                            }
                          }}
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{severity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Source */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Source
                  </label>
                  <div className="space-y-2">
                    {sources.map((source) => (
                      <label key={source} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-emergency-600 focus:ring-emergency-500"
                          checked={filters.source.includes(source)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleFilterChange('source', [...filters.source, source]);
                            } else {
                              handleFilterChange('source', filters.source.filter(s => s !== source));
                            }
                          }}
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{source}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {filteredAlerts.length} Alert{filteredAlerts.length !== 1 ? 's' : ''}
            </h2>
            {searchTerm && (
              <span className="text-sm text-gray-600">
                for "{searchTerm}"
              </span>
            )}
          </div>
          
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emergency-500 focus:border-emergency-500">
            <option>Sort by newest</option>
            <option>Sort by severity</option>
            <option>Sort by location</option>
          </select>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onClick={(alert) => console.log('Alert clicked:', alert)}
            />
          ))}
        </div>

        {filteredAlerts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <MapPin className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms or filters.' : 'There are no alerts at this time.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsPage;