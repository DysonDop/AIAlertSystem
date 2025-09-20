import React, { useState } from 'react';
import { Settings, Bell, MapPin, Shield, Database, Twitter } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [settings, setSettings] = useState({
    notifications: {
      emailAlerts: true,
      pushNotifications: true,
      smsAlerts: false,
      severityThreshold: 'medium',
    },
    location: {
      defaultLocation: 'San Francisco, CA',
      autoDetect: true,
      radius: 50,
    },
    privacy: {
      shareLocation: false,
      analytics: true,
      crashReports: true,
    },
    data: {
      twitterIntegration: true,
      weatherData: true,
      cacheAlerts: true,
      autoRefresh: 30,
    },
  });

  const handleSettingChange = (category: keyof typeof settings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'data', label: 'Data Sources', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">
            Configure your alert preferences and system settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Tabs */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === id
                      ? 'bg-emergency-100 text-emergency-700 border border-emergency-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <Bell className="w-6 h-6 text-emergency-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900">Notification Settings</h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Alert Methods</h3>
                      <div className="space-y-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-emergency-600 focus:ring-emergency-500"
                            checked={settings.notifications.emailAlerts}
                            onChange={(e) => handleSettingChange('notifications', 'emailAlerts', e.target.checked)}
                          />
                          <span className="ml-3 text-sm text-gray-700">Email alerts</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-emergency-600 focus:ring-emergency-500"
                            checked={settings.notifications.pushNotifications}
                            onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                          />
                          <span className="ml-3 text-sm text-gray-700">Push notifications</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-emergency-600 focus:ring-emergency-500"
                            checked={settings.notifications.smsAlerts}
                            onChange={(e) => handleSettingChange('notifications', 'smsAlerts', e.target.checked)}
                          />
                          <span className="ml-3 text-sm text-gray-700">SMS alerts</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Alert Threshold</h3>
                      <select
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-emergency-500 focus:border-emergency-500"
                        value={settings.notifications.severityThreshold}
                        onChange={(e) => handleSettingChange('notifications', 'severityThreshold', e.target.value)}
                      >
                        <option value="low">All alerts (Low and above)</option>
                        <option value="medium">Medium and above</option>
                        <option value="high">High and above</option>
                        <option value="critical">Critical only</option>
                      </select>
                      <p className="mt-2 text-sm text-gray-600">
                        Only receive notifications for alerts at or above this severity level.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Location Settings */}
              {activeTab === 'location' && (
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <MapPin className="w-6 h-6 text-emergency-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900">Location Settings</h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Location
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-emergency-500 focus:border-emergency-500"
                        value={settings.location.defaultLocation}
                        onChange={(e) => handleSettingChange('location', 'defaultLocation', e.target.value)}
                      />
                    </div>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-emergency-600 focus:ring-emergency-500"
                        checked={settings.location.autoDetect}
                        onChange={(e) => handleSettingChange('location', 'autoDetect', e.target.checked)}
                      />
                      <span className="ml-3 text-sm text-gray-700">Auto-detect location</span>
                    </label>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alert Radius (km)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-emergency-500 focus:border-emergency-500"
                        value={settings.location.radius}
                        onChange={(e) => handleSettingChange('location', 'radius', parseInt(e.target.value))}
                      />
                      <p className="mt-2 text-sm text-gray-600">
                        Receive alerts within this distance from your location.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <Shield className="w-6 h-6 text-emergency-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900">Privacy Settings</h2>
                  </div>

                  <div className="space-y-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-emergency-600 focus:ring-emergency-500"
                        checked={settings.privacy.shareLocation}
                        onChange={(e) => handleSettingChange('privacy', 'shareLocation', e.target.checked)}
                      />
                      <div className="ml-3">
                        <span className="text-sm text-gray-700">Share location data</span>
                        <p className="text-xs text-gray-500">Help improve emergency response by sharing anonymous location data</p>
                      </div>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-emergency-600 focus:ring-emergency-500"
                        checked={settings.privacy.analytics}
                        onChange={(e) => handleSettingChange('privacy', 'analytics', e.target.checked)}
                      />
                      <div className="ml-3">
                        <span className="text-sm text-gray-700">Usage analytics</span>
                        <p className="text-xs text-gray-500">Help us improve the service by sharing usage data</p>
                      </div>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-emergency-600 focus:ring-emergency-500"
                        checked={settings.privacy.crashReports}
                        onChange={(e) => handleSettingChange('privacy', 'crashReports', e.target.checked)}
                      />
                      <div className="ml-3">
                        <span className="text-sm text-gray-700">Crash reports</span>
                        <p className="text-xs text-gray-500">Automatically send crash reports to help fix issues</p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Data Sources Settings */}
              {activeTab === 'data' && (
                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <Database className="w-6 h-6 text-emergency-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900">Data Sources</h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">External Data Sources</h3>
                      <div className="space-y-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-emergency-600 focus:ring-emergency-500"
                            checked={settings.data.twitterIntegration}
                            onChange={(e) => handleSettingChange('data', 'twitterIntegration', e.target.checked)}
                          />
                          <div className="ml-3 flex items-center">
                            <Twitter className="w-4 h-4 text-blue-500 mr-2" />
                            <span className="text-sm text-gray-700">Twitter integration</span>
                          </div>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-emergency-600 focus:ring-emergency-500"
                            checked={settings.data.weatherData}
                            onChange={(e) => handleSettingChange('data', 'weatherData', e.target.checked)}
                          />
                          <span className="ml-3 text-sm text-gray-700">Meteorological data</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-emergency-600 focus:ring-emergency-500"
                            checked={settings.data.cacheAlerts}
                            onChange={(e) => handleSettingChange('data', 'cacheAlerts', e.target.checked)}
                          />
                          <span className="ml-3 text-sm text-gray-700">Cache alerts for offline access</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Auto-refresh interval (seconds)
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-emergency-500 focus:border-emergency-500"
                        value={settings.data.autoRefresh}
                        onChange={(e) => handleSettingChange('data', 'autoRefresh', parseInt(e.target.value))}
                      >
                        <option value={15}>15 seconds</option>
                        <option value={30}>30 seconds</option>
                        <option value={60}>1 minute</option>
                        <option value={300}>5 minutes</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                <div className="flex justify-end">
                  <button className="px-4 py-2 bg-emergency-600 text-white rounded-md hover:bg-emergency-700 transition-colors">
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;