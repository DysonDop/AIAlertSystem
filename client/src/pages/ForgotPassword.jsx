import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/auth.css';

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [codeDeliveryDetails, setCodeDeliveryDetails] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await forgotPassword(email.trim());
      if (response.success) {
        setSuccess(true);
        setCodeDeliveryDetails(response.destination);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <div className="auth-icon success">
                <CheckCircle size={32} />
              </div>
              <h1 className="auth-title">Check Your Email</h1>
              <p className="auth-subtitle">
                We've sent a password reset code to <strong>{email}</strong>
              </p>
            </div>

            <div className="form-group">
              <Link 
                to={`/reset-password?email=${encodeURIComponent(email)}`}
                className="auth-button"
              >
                Enter Reset Code
              </Link>
            </div>

            <div className="auth-footer">
              <p className="auth-footer-text">
                Didn't receive the code?{' '}
                <button 
                  type="button" 
                  className="auth-footer-link-button"
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                    setError('');
                  }}
                >
                  Try again
                </button>
              </p>
              <p className="auth-footer-text">
                <Link to="/login" className="auth-footer-link">
                  <ArrowLeft size={16} />
                  Back to sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">
            <Mail size={32} />
          </div>
          <h1 className="auth-title">Forgot Password?</h1>
          <p className="auth-subtitle">
            No worries! Enter your email address and we'll send you a reset code.
          </p>
        </div>

        {error && (
          <div className="error-message">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <div className="input-container">
              <Mail className="input-icon" size={16} />
              <input
                id="email"
                name="email"
                type="email"
                required
                className="form-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                disabled={loading}
                autoComplete="email"
              />
            </div>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Code'}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Remember your password?{' '}
            <Link to="/login" className="auth-footer-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ForgotPassword;