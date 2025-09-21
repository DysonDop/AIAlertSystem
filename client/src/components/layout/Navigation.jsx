import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AlertTriangle, Map, Search, Home, Settings, LogOut, User, ChevronDown, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navigation = ({ className }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
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
    { to: '/app/search', icon: Search, label: 'Social Monitor' },
    { to: '/app/settings', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const handleProfileClick = () => {
    setShowUserMenu(false);
    setShowMobileMenu(false);
    navigate('/app/profile');
  };

  const handleMobileNavClick = () => {
    setShowMobileMenu(false);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
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
          
          {/* Desktop Navigation */}
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

          {/* Desktop User Menu */}
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
                <div 
                  className="user-menu-header"
                  onClick={handleProfileClick}
                  style={{ cursor: 'pointer' }}
                >
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
          <button 
            className="navbar-mobile-btn"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={showMobileMenu}
          >
            {showMobileMenu ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="navbar-mobile-menu" ref={mobileMenuRef}>
            <div className="mobile-nav-items">
              {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `navbar-link ${isActive ? 'active' : ''}`
                  }
                  onClick={handleMobileNavClick}
                >
                  <Icon className="navbar-link-icon" />
                  {label}
                </NavLink>
              ))}
            </div>
            
            <div className="mobile-user-section">
              <div className="mobile-user-info">
                <div className="user-avatar">
                  <User size={20} />
                </div>
                <div>
                  <div className="user-name">{user?.name || 'User'}</div>
                  <div className="user-email">{user?.email}</div>
                </div>
              </div>
              <button 
                className="mobile-profile-btn"
                onClick={handleProfileClick}
              >
                <User size={16} />
                Profile
              </button>
              <button 
                className="mobile-logout-btn"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
