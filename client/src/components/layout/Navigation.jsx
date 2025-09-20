import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AlertTriangle, Map, Search, Home, Settings, LogOut, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navigation = ({ className }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navItems = [
    { to: '/app/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/app/alerts', icon: AlertTriangle, label: 'Alerts' },
    { to: '/app/map', icon: Map, label: 'Map' },
    { to: '/app/search', icon: Search, label: 'Search & Rescue' },
    { to: '/app/settings', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

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

          {/* User Menu */}
          <div className="navbar-user" ref={userMenuRef}>
            <div 
              className="user-menu-trigger"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="user-avatar">
                <User size={16} />
              </div>
              <span className="user-name">{user?.name || 'User'}</span>
              <ChevronDown size={16} className="user-menu-icon" />
            </div>
            
            {showUserMenu && (
              <div className="user-menu">
                <div className="user-menu-header">
                  <div className="user-info">
                    <div className="user-info-name">{user?.name}</div>
                    <div className="user-info-email">{user?.email}</div>
                  </div>
                </div>
                <div className="user-menu-divider"></div>
                <button 
                  className="user-menu-item logout-btn"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            )}
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
    </nav>
  );
};

export default Navigation;
