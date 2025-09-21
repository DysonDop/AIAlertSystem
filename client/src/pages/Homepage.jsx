import React from 'react';
import { Shield, Bell, MapPin, Users, AlertTriangle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/homepage.css';

const Homepage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: AlertTriangle,
      title: 'Real-time Alerts',
      description: 'Get instant notifications about natural disasters and emergencies in your area.'
    },
    {
      icon: MapPin,
      title: 'Interactive Maps',
      description: 'View live disaster maps with detailed location information and affected areas.'
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Receive personalized alerts based on your location and preferences.'
    },
    {
      icon: Users,
      title: 'Search & Rescue',
      description: 'Connect with emergency services and coordinate rescue operations.'
    },
    {
      icon: Shield,
      title: 'Safety Recommendations',
      description: 'Get expert safety guidelines and emergency response procedures.'
    },
    {
      icon: Clock,
      title: '24/7 Monitoring',
      description: 'Round-the-clock monitoring of weather patterns and seismic activities.'
    }
  ];

  return (
    <div className="homepage">
      {/* Navigation */}
      <nav className="homepage-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <AlertTriangle className="brand-icon" />
            <span className="brand-name">Disaster Alert System</span>
          </div>
          <div className="nav-actions">
            <button 
              className="nav-btn nav-btn-secondary"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button 
              className="nav-btn nav-btn-primary"
              onClick={() => navigate('/register')}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Stay Safe with
              <span className="hero-title-accent"> Real-time Disaster Alerts</span>
            </h1>
            <p className="hero-subtitle">
              Get instant notifications about natural disasters, emergencies, and safety threats in your area. 
              Stay informed, stay prepared, stay safe.
            </p>
            <div className="hero-actions">
              <button 
                className="hero-btn hero-btn-primary"
                onClick={() => navigate('/register')}
              >
                Create Account
              </button>
              <button 
                className="hero-btn hero-btn-secondary"
                onClick={() => navigate('/login')}
              >
                Sign In
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-header">
                <div className="status-indicator status-active"></div>
                <span className="status-text">Live Monitoring</span>
              </div>
              <div className="hero-card-content">
                <AlertTriangle className="hero-card-icon" />
                <div>
                  <h3>- Active Alerts</h3>
                  <p>System monitoring 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="features-header">
            <h2 className="features-title">Comprehensive Disaster Management</h2>
            <p className="features-subtitle">
              Everything you need to stay safe and informed during emergencies
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <feature.icon />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3 className="stat-number">24/7</h3>
              <p className="stat-label">Monitoring</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">-</h3>
              <p className="stat-label">Alert Types</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">-</h3>
              <p className="stat-label">Users Protected</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-number">-</h3>
              <p className="stat-label">Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Stay Safe?</h2>
            <p className="cta-subtitle">
              Join thousands of users who trust our disaster alert system to keep them informed and protected.
            </p>
            <div className="cta-actions">
              <button 
                className="cta-btn cta-btn-primary"
                onClick={() => navigate('/register')}
              >
                Create Free Account
              </button>
              <button 
                className="cta-btn cta-btn-secondary"
                onClick={() => navigate('/login')}
              >
                Already have an account?
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="homepage-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <AlertTriangle className="footer-icon" />
              <span className="footer-name">Disaster Alert System</span>
            </div>
            <p className="footer-text">
              Keeping communities safe through real-time disaster monitoring and alerts.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;