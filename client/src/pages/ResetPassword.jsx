import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft, Key, Check, X } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/auth.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { confirmForgotPassword } = useAuth();
  
  const [formData, setFormData] = useState({
    email: searchParams.get('email') || '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumbers: false,
    hasSpecialChar: false,
    passwordsMatch: false
  });

  // Redirect to forgot password if no email is provided
  useEffect(() => {
    if (!formData.email) {
      navigate('/forgot-password');
    }
  }, [formData.email, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');

    // Real-time password validation
    if (name === 'newPassword' || name === 'confirmPassword') {
      const passwordToValidate = name === 'newPassword' ? value : formData.newPassword;
      const confirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword;
      
      setPasswordValidation({
        minLength: passwordToValidate.length >= 8,
        hasUpperCase: /[A-Z]/.test(passwordToValidate),
        hasLowerCase: /[a-z]/.test(passwordToValidate),
        hasNumbers: /\d/.test(passwordToValidate),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(passwordToValidate),
        passwordsMatch: passwordToValidate === confirmPassword && passwordToValidate.length > 0
      });
    }
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return 'Password must be at least 8 characters long';
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!hasNumbers) {
      return 'Password must contain at least one number';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.code.trim()) {
      setError('Please enter the verification code');
      return;
    }

    if (!formData.newPassword) {
      setError('Please enter a new password');
      return;
    }

    // Validate password strength
    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await confirmForgotPassword(
        formData.email,
        formData.code.trim(),
        formData.newPassword
      );
      setSuccess(true);
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
            <h1 className="auth-title">Password Reset Successful!</h1>
            <p className="auth-subtitle">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
          </div>

          <div className="form-group">
            <Link to="/login" className="auth-button">
              Sign In
            </Link>
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
            <Lock size={32} />
          </div>
          <h1 className="auth-title">Reset Your Password</h1>
          <p className="auth-subtitle">
            Enter the verification code sent to <strong>{formData.email}</strong> and your new password.
          </p>
        </div>

        {error && (
          <div className="error-message">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="code" className="form-label">
              Verification Code
            </label>
            <div className="input-container">
              <Key className="input-icon" size={16} />
              <input
                id="code"
                name="code"
                type="text"
                required
                className="form-input"
                placeholder="Enter 6-digit code"
                value={formData.code}
                onChange={handleInputChange}
                disabled={loading}
                maxLength={6}
                autoComplete="one-time-code"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">
              New Password
            </label>
            <div className="input-container">
              <Lock className="input-icon" size={16} />
              <input
                id="newPassword"
                name="newPassword"
                type={showPassword ? 'text' : 'password'}
                required
                className="form-input"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={handleInputChange}
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="input-action"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm New Password
            </label>
            <div className="input-container">
              <Lock className="input-icon" size={16} />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                className="form-input"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="input-action"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="password-requirements">
            <h4>Password must contain:</h4>
            <ul>
              <li className={passwordValidation.minLength ? 'requirement-met' : 'requirement-unmet'}>
                {passwordValidation.minLength ? <Check size={14} /> : <X size={14} />}
                At least 8 characters
              </li>
              <li className={passwordValidation.hasUpperCase ? 'requirement-met' : 'requirement-unmet'}>
                {passwordValidation.hasUpperCase ? <Check size={14} /> : <X size={14} />}
                One uppercase letter
              </li>
              <li className={passwordValidation.hasLowerCase ? 'requirement-met' : 'requirement-unmet'}>
                {passwordValidation.hasLowerCase ? <Check size={14} /> : <X size={14} />}
                One lowercase letter
              </li>
              <li className={passwordValidation.hasNumbers ? 'requirement-met' : 'requirement-unmet'}>
                {passwordValidation.hasNumbers ? <Check size={14} /> : <X size={14} />}
                One number
              </li>
              <li className={passwordValidation.hasSpecialChar ? 'requirement-met' : 'requirement-unmet'}>
                {passwordValidation.hasSpecialChar ? <Check size={14} /> : <X size={14} />}
                One special character
              </li>
              {formData.confirmPassword && (
                <li className={passwordValidation.passwordsMatch ? 'requirement-met' : 'requirement-unmet'}>
                  {passwordValidation.passwordsMatch ? <Check size={14} /> : <X size={14} />}
                  Passwords match
                </li>
              )}
            </ul>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            <Link to="/forgot-password" className="auth-footer-link">
              <ArrowLeft size={16} />
              Back to forgot password
            </Link>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ResetPassword;