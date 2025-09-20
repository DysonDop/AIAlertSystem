import React, { useState, useEffect } from 'react';
import { Bell, User, Shield, Globe, Moon, Sun, Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/pages/settings.css';

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  
  const [settings, setSettings] = useState({
    notifications: {
      pushNotifications: true,
      emailAlerts: true,
      smsAlerts: false,
      soundAlerts: true,
    },
    preferences: {
      theme: 'light', // This will be synced with ThemeContext
      language: 'en',
      units: 'metric',
      mapStyle: 'default',
    },
    alerts: {
      severityFilter: ['critical', 'high'],
      alertTypes: ['earthquake', 'flood', 'fire'],
      autoRefresh: true,
      refreshInterval: 30,
    },
    privacy: {
      shareLocation: true,
      anonymousReports: false,
      dataRetention: '1year',
    },
  });

  // Sync settings with theme context on mount
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        theme: theme
      }
    }));
  }, [theme]);

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
    
    // Handle theme changes
    if (category === 'preferences' && key === 'theme') {
      setTheme(value);
    }
  };

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">
            Configure your preferences and notification settings
          </p>
        </div>

        <div className="settings-grid">
          {/* Notifications */}
          <div className="content-card">
            <div className="content-card-header">
              <Bell className="settings-section-icon" />
              <h2 className="content-card-title">Notifications</h2>
            </div>
            
            <div className="settings-group">
              <div className="setting-item">
                <div className="setting-info">
                  <h3 className="setting-label">Push Notifications</h3>
                  <p className="setting-description">Receive alerts directly on your device</p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={settings.notifications.pushNotifications}
                    onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3 className="setting-label">Email Alerts</h3>
                  <p className="setting-description">Get notifications via email</p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={settings.notifications.emailAlerts}
                    onChange={(e) => handleSettingChange('notifications', 'emailAlerts', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3 className="setting-label">SMS Alerts</h3>
                  <p className="setting-description">Receive emergency alerts via SMS</p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={settings.notifications.smsAlerts}
                    onChange={(e) => handleSettingChange('notifications', 'smsAlerts', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3 className="setting-label">Sound Alerts</h3>
                  <p className="setting-description">Play sound for new alerts</p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={settings.notifications.soundAlerts}
                    onChange={(e) => handleSettingChange('notifications', 'soundAlerts', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="content-card">
            <div className="content-card-header">
              <User className="settings-section-icon" />
              <h2 className="content-card-title">Preferences</h2>
            </div>

            <div className="settings-group">
              <div className="setting-item">
                <div className="setting-info">
                  <h3 className="setting-label">Theme</h3>
                  <p className="setting-description">Choose your preferred theme</p>
                </div>
                <div className="setting-control">
                  <select 
                    className="form-select"
                    value={settings.preferences.theme}
                    onChange={(e) => handleSettingChange('preferences', 'theme', e.target.value)}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3 className="setting-label">Language</h3>
                  <p className="setting-description">Select your language</p>
                </div>
                <div className="setting-control">
                  <select 
                    className="form-select"
                    value={settings.preferences.language}
                    onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3 className="setting-label">Units</h3>
                  <p className="setting-description">Choose measurement units</p>
                </div>
                <div className="setting-control">
                  <select 
                    className="form-select"
                    value={settings.preferences.units}
                    onChange={(e) => handleSettingChange('preferences', 'units', e.target.value)}
                  >
                    <option value="metric">Metric (km, °C)</option>
                    <option value="imperial">Imperial (mi, °F)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Alert Settings */}
          <div className="content-card">
            <div className="content-card-header">
              <Shield className="settings-section-icon" />
              <h2 className="content-card-title">Alert Settings</h2>
            </div>

            <div className="settings-group">
              <div className="setting-item">
                <div className="setting-info">
                  <h3 className="setting-label">Auto Refresh</h3>
                  <p className="setting-description">Automatically update alerts</p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={settings.alerts.autoRefresh}
                    onChange={(e) => handleSettingChange('alerts', 'autoRefresh', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3 className="setting-label">Refresh Interval</h3>
                  <p className="setting-description">How often to check for updates (seconds)</p>
                </div>
                <input
                  type="number"
                  className="form-input"
                  value={settings.alerts.refreshInterval}
                  min="10"
                  max="300"
                  onChange={(e) => handleSettingChange('alerts', 'refreshInterval', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="content-card">
            <div className="content-card-header">
              <Globe className="settings-section-icon" />
              <h2 className="content-card-title">Privacy</h2>
            </div>

            <div className="settings-group">
              <div className="setting-item">
                <div className="setting-info">
                  <h3 className="setting-label">Share Location</h3>
                  <p className="setting-description">Allow location sharing for better alerts</p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={settings.privacy.shareLocation}
                    onChange={(e) => handleSettingChange('privacy', 'shareLocation', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3 className="setting-label">Anonymous Reports</h3>
                  <p className="setting-description">Submit incident reports anonymously</p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={settings.privacy.anonymousReports}
                    onChange={(e) => handleSettingChange('privacy', 'anonymousReports', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="text-center mt-8">
          <button className="btn btn-primary btn-large">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;