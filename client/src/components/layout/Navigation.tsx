import React from 'react';
import { NavLink } from 'react-router-dom';
import { AlertTriangle, Map, Search, Home, Settings } from 'lucide-react';

interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className }) => {
  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/alerts', icon: AlertTriangle, label: 'Alerts' },
    { to: '/map', icon: Map, label: 'Map' },
    { to: '/search', icon: Search, label: 'Search & Rescue' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className={`navbar ${className || ''}`}>
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-brand">
            <AlertTriangle className="navbar-logo" />
            <span className="navbar-title">
              Disaster Alert System
            </span>
          </div>
          
          <div className="navbar-nav">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `navbar-link ${isActive ? 'active' : ''}`
                }
              >
                <Icon className="navbar-link-icon" />
                {label}
              </NavLink>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="navbar-mobile-btn">
            <button>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="navbar-mobile-menu">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `navbar-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon className="navbar-link-icon" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;