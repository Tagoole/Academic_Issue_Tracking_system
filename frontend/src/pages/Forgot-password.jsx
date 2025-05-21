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
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email
    if (!email.trim()) {
      setErrorMessage('Please enter your email address');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitStatus(null);
      setErrorMessage(null);

      // Create form data
      const formData = new FormData();
      formData.append('email', email);
      
      // Make API request
      const response = await API.post('/api/password_reset_code/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      // Handle success
      setSubmitStatus('success');
      
      // Navigate to verification page
      setTimeout(() => {
        navigate('/reset-verification', {
          state: { email }
        });
      }, 1500);
      
    } catch (err) {
      setSubmitStatus('error');
      
      // Simple error handling
      if (err.response?.status === 404) {
        setErrorMessage('Email not found. Please check your email address.');
      } else if (err.response?.data?.Error) {
        setErrorMessage('Account not found with this email address.');
      } else if (err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      } else if (err.response?.data?.detail) {
        setErrorMessage(err.response.data.detail);
      } else if (err.response?.data?.email) {
        setErrorMessage(Array.isArray(err.response.data.email) 
          ? err.response.data.email[0] 
          : err.response.data.email);
      } else {
        setErrorMessage('Unable to send reset code. Please try again later.');
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
        {errorMessage && (
          <div className="error-banner">
            <p>{errorMessage}</p>
            <button onClick={() => setErrorMessage(null)}>×</button>
          </div>
        )}
        
        {/* Success message display */}
        {submitStatus === 'success' && (
          <div className="success-banner">
            <p>Password reset code has been sent to your email!</p>
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