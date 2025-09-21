import React, { useState, useEffect } from 'react';
import { AlertTriangle, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/auth.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, isAuthenticated, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/app/dashboard';

  // Redirect if user is already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate, from]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      // Redirect to the page they were trying to access, or dashboard
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Show success message if coming from registration
  const successMessage = location.state?.message;

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="loading-container">
            <div className="loading-content">
              <div className="loading-spinner"></div>
              <p className="loading-text">Checking authentication...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Header */}
        <div className="auth-header">
          <Link to="/" className="auth-brand">
            <AlertTriangle className="brand-icon" />
            <span className="brand-name">Disaster Alert System</span>
          </Link>
        </div>

        {/* Form */}
        <div className="auth-card">
          <div className="auth-card-header">
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Sign in to your account to continue</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {successMessage && (
              <div className="auth-success">
                <span>{successMessage}</span>
              </div>
            )}

            {error && (
              <div className="auth-error">
                <AlertTriangle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <div className="input-wrapper">
                <Mail className="input-icon" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="form-input"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="form-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="input-action"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>

            <div className="form-actions">
              <div className="form-remember">
                <input
                  id="remember"
                  type="checkbox"
                  className="form-checkbox"
                />
                <label htmlFor="remember" className="form-checkbox-label">
                  Remember me
                </label>
              </div>
              <Link to="/forgot-password" className="form-link">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-footer-text">
              Don't have an account?{' '}
              <Link to="/register" className="auth-footer-link">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;