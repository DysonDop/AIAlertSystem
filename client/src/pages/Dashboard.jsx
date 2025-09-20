import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Clock, TrendingUp } from 'lucide-react';
import AlertCard from '../components/alerts/AlertCard.jsx';
import DisasterMap from '../components/maps/DisasterMap.jsx';
import { alertService } from '../services/api.js';
import '../styles/pages/dashboard.css';

const Dashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    critical: 0,
    resolved: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [allAlerts, activeAlertsData] = await Promise.all([
          alertService.getAlerts(),
          alertService.getActiveAlerts(),
        ]);
        
        setAlerts(allAlerts);
        setActiveAlerts(activeAlertsData);
        
        // Calculate stats
        const total = allAlerts.length;
        const active = activeAlertsData.length;
        const critical = allAlerts.filter(alert => alert.severity === 'critical').length;
        const resolved = allAlerts.filter(alert => !alert.isActive).length;
        
        setStats({ total, active, critical, resolved });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
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
            recommendations: [
              'Stay away from windows and heavy objects',
              'Find shelter under sturdy furniture',
              'Evacuate damaged buildings immediately',
            ],
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
            recommendations: [
              'Move to higher ground immediately',
              'Avoid driving through flooded roads',
              'Stay indoors until conditions improve',
            ],
          },
        ];
        
        setAlerts(mockAlerts);
        setActiveAlerts(mockAlerts);
        setStats({
          total: mockAlerts.length,
          active: mockAlerts.length,
          critical: 1,
          resolved: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="stat-card">
      <div className="stat-card-content">
        <div className={`stat-card-icon ${color}`}>
          <Icon />
        </div>
        <div className="stat-card-text">
          <p className="stat-card-label">{label}</p>
          <p className="stat-card-value">{value}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Disaster Alert Dashboard</h1>
          <p className="dashboard-subtitle">
            Real-time monitoring of natural disasters and emergency alerts
          </p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <StatCard
            icon={AlertTriangle}
            label="Total Alerts"
            value={stats.total}
            color="blue"
          />
          <StatCard
            icon={TrendingUp}
            label="Active Alerts"
            value={stats.active}
            color="green"
          />
          <StatCard
            icon={AlertTriangle}
            label="Critical Alerts"
            value={stats.critical}
            color="red"
          />
          <StatCard
            icon={Clock}
            label="Resolved Today"
            value={stats.resolved}
            color="gray"
          />
        </div>

        {/* Main Content Grid */}
        <div className="main-content-grid">
          {/* Map Section */}
          <div className="content-card">
            <div className="content-card-header">
              <h2 className="content-card-title">Live Alert Map</h2>
              <div className="alert-count">
                <MapPin />
                <span>{activeAlerts.length} active incidents</span>
              </div>
            </div>
            <DisasterMap
              alerts={activeAlerts}
              height="400px"
              showRadius={true}
              onAlertClick={(alert) => console.log('Alert clicked:', alert)}
            />
          </div>

          {/* Recent Alerts */}
          <div className="content-card">
            <div className="content-card-header">
              <h2 className="content-card-title">Recent Alerts</h2>
              <button className="view-all-btn">
                View All
              </button>
            </div>
            <div className="alerts-list">
              {alerts.slice(0, 5).map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onClick={(alert) => console.log('Alert clicked:', alert)}
                />
              ))}
            </div>
            {alerts.length === 0 && (
              <div className="no-alerts">
                <AlertTriangle />
                <p>No alerts at this time</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="content-card quick-actions">
          <h2 className="content-card-title">Quick Actions</h2>
          <div className="quick-actions-grid">
            <button className="quick-action-btn">
              <MapPin className="quick-action-icon blue" />
              <h3 className="quick-action-title">View Full Map</h3>
              <p className="quick-action-desc">Explore detailed incident map</p>
            </button>
            <button className="quick-action-btn">
              <AlertTriangle className="quick-action-icon orange" />
              <h3 className="quick-action-title">Report Incident</h3>
              <p className="quick-action-desc">Submit new alert or incident</p>
            </button>
            <button className="quick-action-btn">
              <TrendingUp className="quick-action-icon green" />
              <h3 className="quick-action-title">Analytics</h3>
              <p className="quick-action-desc">View trends and statistics</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;