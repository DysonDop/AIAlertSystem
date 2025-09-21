import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Clock, TrendingUp, Twitter, CheckCircle, XCircle, BarChart3, Zap } from 'lucide-react';
import AlertCard from '../components/alerts/AlertCard.jsx';
import DisasterMap from '../components/maps/DisasterMap.jsx';
import { alertService } from '../services/api.js';
import '../styles/pages/dashboard.css';

const Dashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [socialMediaStats, setSocialMediaStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPosts: 0,
    verifiedPosts: 0,
    validatedAlerts: 0,
    responseTime: 0,
    accuracyRate: 0,
    activeMonitoring: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Skip API call for now and use mock data directly
        // const activeAlertsData = await alertService.getActiveAlerts();
        
        // Mock alerts placeholder - Replace with real data later
        const mockAlerts = [];
        
        setAlerts(mockAlerts);
        
        // Mock social media monitoring statistics - Replace with real data later
        const mockStats = {
          totalPosts: '-',
          verifiedPosts: '-', 
          validatedAlerts: '-',
          responseTime: '-', // minutes
          accuracyRate: '-', // percentage
          activeMonitoring: '-', // active sources
        };
        setStats(mockStats);
        console.log('📊 Dashboard stats updated:', mockStats);

        // Mock social media platform stats - Replace with real data later
        setSocialMediaStats({
          twitter: { posts: '-', verified: '-', accuracy: '-' },
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Set some default dash data even on error
        setStats({
          totalPosts: '-',
          verifiedPosts: '-',
          validatedAlerts: '-',
          responseTime: '-',
          accuracyRate: '-',
          activeMonitoring: '-',
        });
        setSocialMediaStats({
          twitter: { posts: '-', verified: '-', accuracy: '-' },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const StatCard = ({ icon: Icon, label, value, color, suffix = '' }) => (
    <div className="stat-card">
      <div className="stat-card-content">
        <div className={`stat-card-icon ${color}`}>
          <Icon size={20} />
        </div>
        <div className="stat-card-text">
          <p className="stat-card-label" style={{ fontSize: '0.95em', fontWeight: '500' }}>{label}</p>
          <p className="stat-card-value">{value}{suffix}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading AI monitoring dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">🤖 AI Disaster Alert Dashboard</h1>
          <p className="dashboard-subtitle">
            Real-time social media monitoring with AI-driven disaster validation
          </p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <StatCard
            icon={Twitter}
            label="Social Media Posts"
            value={stats.totalPosts.toLocaleString ? stats.totalPosts.toLocaleString() : stats.totalPosts}
            color="blue"
          />
          <StatCard
            icon={CheckCircle}
            label="Verified Posts"
            value={stats.verifiedPosts.toLocaleString ? stats.verifiedPosts.toLocaleString() : stats.verifiedPosts}
            color="green"
          />
          <StatCard
            icon={AlertTriangle}
            label="Validated Alerts"
            value={stats.validatedAlerts}
            color="red"
          />
          <StatCard
            icon={Zap}
            label="Response Time"
            value={stats.responseTime}
            color="orange"
            suffix={stats.responseTime !== '-' ? ' min' : ''}
          />
          <StatCard
            icon={TrendingUp}
            label="Accuracy Rate"
            value={stats.accuracyRate}
            color="purple"
            suffix={stats.accuracyRate !== '-' ? '%' : ''}
          />
          <StatCard
            icon={BarChart3}
            label="Active Monitoring"
            value={stats.activeMonitoring}
            color="indigo"
            suffix={stats.activeMonitoring !== '-' ? ' sources' : ''}
          />
        </div>

        {/* Main Content Grid */}
        <div className="main-content-grid">
          {/* Map Section */}
          <div className="content-card">
            <div className="content-card-header">
              <h2 className="content-card-title">🌍 Live Validation Map</h2>
              <div className="alert-count">
                <MapPin />
                <span>{alerts.length} validated incidents</span>
              </div>
            </div>
            <DisasterMap
              alerts={alerts}
              height="400px"
              showRadius={true}
              onAlertClick={(alert) => console.log('Alert clicked:', alert)}
            />
          </div>

          {/* Recent Validated Alerts */}
          <div className="content-card">
            <div className="content-card-header">
              <h2 className="content-card-title">🔍 Recently Validated Alerts</h2>
              <button className="view-all-btn">
                View All
              </button>
            </div>
            <div className="alerts-list">
              {alerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="validated-alert-card">
                  <div className="alert-header">
                    <div className="alert-title-section">
                      <h3>{alert.title}</h3>
                      <div className={`validation-status ${alert.validationStatus}`}>
                        {alert.validationStatus === 'verified' && <CheckCircle size={16} />}
                        {alert.validationStatus === 'pending' && <Clock size={16} />}
                        {alert.validationStatus}
                      </div>
                    </div>
                    <div className="alert-meta">
                      <span className="timestamp">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                  <p className="alert-description">{alert.description}</p>
                  <div className="validation-details">
                    <div className="validation-source">
                      <Twitter size={14} />
                      <span>{alert.socialMediaSources} social posts</span>
                    </div>
                    <div className="meteorological-status">
                      {alert.meteorologicalConfirmation ? (
                        <>
                          <CheckCircle size={14} className="text-green-500" />
                          <span>Meteorological data confirmed</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={14} className="text-orange-500" />
                          <span>Awaiting meteorological confirmation</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {alerts.length === 0 && (
              <div className="no-alerts">
                <AlertTriangle />
                <p>No validated alerts at this time</p>
              </div>
            )}
          </div>
        </div>

        {/* Twitter Analytics - Enhanced */}
        <div className="content-card twitter-analytics">
          <div className="content-card-header">
            <h2 className="content-card-title">
              <Twitter size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Twitter Analytics
            </h2>
          </div>
          <div className="twitter-stats-container">
            <div className="twitter-card-enhanced">
              <div className="twitter-metrics">
                <div className="metric-item">
                  <span className="metric-label">Posts Monitored</span>
                  <span className="metric-value">{socialMediaStats.twitter?.posts || '-'}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Verified Posts</span>
                  <span className="metric-value">{socialMediaStats.twitter?.verified || '-'}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Accuracy Rate</span>
                  <span className="metric-value">{socialMediaStats.twitter?.accuracy !== '-' ? `${socialMediaStats.twitter?.accuracy}%` : '-'}</span>
                </div>
              </div>
              <div className="twitter-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: socialMediaStats.twitter?.accuracy !== '-' ? `${socialMediaStats.twitter?.accuracy}%` : '0%'}}></div>
                </div>
                <span className="progress-label">Validation Accuracy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="content-card quick-actions">
          <h2 className="content-card-title">⚡ Quick Actions</h2>
          <div className="quick-actions-grid">
            <button className="quick-action-btn">
              <Twitter className="quick-action-icon blue" />
              <h3 className="quick-action-title">Social Monitor</h3>
              <p className="quick-action-desc">View live social media feeds</p>
            </button>
            <button className="quick-action-btn">
              <BarChart3 className="quick-action-icon green" />
              <h3 className="quick-action-title">Validation Analytics</h3>
              <p className="quick-action-desc">Detailed accuracy metrics</p>
            </button>
            <button className="quick-action-btn">
              <MapPin className="quick-action-icon orange" />
              <h3 className="quick-action-title">Alert Map</h3>
              <p className="quick-action-desc">Full interactive map view</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
