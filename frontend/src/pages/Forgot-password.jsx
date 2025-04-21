import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Forgot-password.css';
import keyIcon from '../assets/group.png';
import helpIcon from '../assets/question.png';
import API from '../api';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitStatus(null);
      setError(null);

      // Create form data
      const formData = new FormData();
      formData.append('email', email);

      // Log the data being sent for debugging
      console.log('Submitting password reset request for:', email);
      
      // Make API request
      const response = await API.post('/api/password_reset_code/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      // Handle success
      setSubmitStatus('success');
      console.log('Password reset response:', response.data);
      
      // Navigate to verification page or show success message
      setTimeout(() => {
        navigate('/reset-verification', {
          state: {
            email: email
          }
        });
      }, 1500);
      
    } catch (err) {
      console.error('Password reset error:', err);
      setSubmitStatus('error');
      
      // Enhanced error handling
      if (err.response?.data) {
        console.log('Error response data:', err.response.data);
        let errorMessage = 'Failed to request password reset';
        
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.detail) {
          errorMessage = err.response.data.detail;
        } else if (err.response.data.email) {
          // Handle field-specific error for email
          errorMessage = Array.isArray(err.response.data.email) 
            ? err.response.data.email.join(', ') 
            : err.response.data.email;
        } else {
          // Try to extract field-specific errors
          const fieldErrors = Object.entries(err.response.data)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join('; ');
          
          if (fieldErrors) {
            errorMessage = `Validation errors: ${fieldErrors}`;
          }
        }
        
        setError(errorMessage);
      } else {
        setError('Network error or server unavailable');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reset-password-container">
      {/* Header Section */}
      <nav className="header-nav">
        <div className="nav-brand">
          <strong>AITS</strong>
        </div>
        <div className="nav-help">
          <img src={helpIcon} alt="Help" className="help-icon" />
          <span>Help?</span>
        </div>
      </nav>
      
      {/* Main Content Section */}
      <div className="reset-password-card">
        <div className="key-icon-container">
          <img src={keyIcon} alt="Key" className="key-icon" />
        </div>
        
        <h1 className="reset-title">Reset Password</h1>
        
        <p className="reset-instructions">
          Enter your registered Email Address below to reset your password.
        </p>
        
        {/* Error message display */}
        {error && (
          <div className="error-banner">
            <p>{error}</p>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}
        
        {/* Success message display */}
        {submitStatus === 'success' && (
          <div className="success-banner">
            <p>Password reset link has been sent to your email!</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your Email Address"
              required
              className="email-input"
              disabled={isSubmitting}
            />
            <div className="input-icon">
              {/* Icon content if needed */}
            </div>
          </div>
          
          <button 
            type="submit" 
            className="next-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Next'}
          </button>
        </form>
        
        <div className="sign-in-link-container">
          <Link to="/Signin" className="sign-in-link">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;