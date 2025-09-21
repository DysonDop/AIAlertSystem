import React, { useState, useEffect } from 'react';
import { AlertTriangle, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser, confirmRegistration, resendConfirmationCode, user, isAuthenticated, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [confirmationData, setConfirmationData] = useState({
    code: '',
    email: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState('register'); // 'register' or 'confirm'

  // Redirect if user is already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/app/dashboard', { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await registerUser(formData.name, formData.email, formData.password);
      
      if (result.success) {
        // User was automatically signed in
        navigate('/app/dashboard', { replace: true });
      } else if (result.requiresConfirmation) {
        // User needs to confirm email
        setConfirmationData({ code: '', email: formData.email });
        setStep('confirm');
        setSuccess(result.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await confirmRegistration(confirmationData.email, confirmationData.code);
      // After confirmation, redirect to login
      navigate('/login', { 
        replace: true,
        state: { message: 'Email confirmed! Please sign in to continue.' }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');

    try {
      await resendConfirmationCode(confirmationData.email);
      setSuccess('Verification code sent to your email!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="auth-title">
              {step === 'register' ? 'Create your account' : 'Confirm your email'}
            </h1>
            <p className="auth-subtitle">
              {step === 'register' 
                ? 'Join us to stay safe and informed' 
                : `We sent a verification code to ${confirmationData.email}`}
            </p>
          </div>

          {step === 'confirm' ? (
            <form className="auth-form" onSubmit={handleConfirmSubmit}>
              {error && (
                <div className="auth-error">
                  <AlertTriangle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="auth-success">
                  <span>{success}</span>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="code" className="form-label">
                  Verification code
                </label>
                <div className="input-wrapper">
                  <Mail className="input-icon" />
                  <input
                    id="code"
                    name="code"
                    type="text"
                    required
                    className="form-input"
                    placeholder="Enter verification code"
                    value={confirmationData.code}
                    onChange={(e) => setConfirmationData(prev => ({ ...prev, code: e.target.value }))}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="auth-button"
                disabled={loading}
              >
                {loading ? 'Confirming...' : 'Confirm Email'}
              </button>

              <div className="form-actions">
                <button
                  type="button"
                  className="form-link"
                  onClick={handleResendCode}
                  disabled={loading}
                >
                  Didn't receive code? Resend
                </button>
              </div>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
            {error && (
              <div className="auth-error">
                <AlertTriangle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full name
              </label>
              <div className="input-wrapper">
                <User className="input-icon" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="form-input"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
            </div>

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
                  placeholder="Create a password"
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

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm password
              </label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className="form-input"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="input-action"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>

              <div style={{ marginTop: '1.5rem' }}>
                <button
                  type="submit"
                  className="auth-button"
                  disabled={loading}
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </div>
            </form>
          )}

          <div className="auth-footer">
            <p className="auth-footer-text">
              {step === 'confirm' ? (
                <>
                  Want to use a different email?{' '}
                  <button
                    type="button"
                    className="auth-footer-link"
                    onClick={() => setStep('register')}
                  >
                    Go back
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <Link to="/login" className="auth-footer-link">
                    Sign in
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;