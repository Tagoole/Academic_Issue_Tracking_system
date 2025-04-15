import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './reset.css';
import keyIcon from '../assets/group.png';
import mailIcon from '../assets/mail.png';
import helpIcon from '../assets/question.png';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle password reset logic here
    console.log('Password reset requested for:', email);
  };

  const handleSignIn = () => {
    navigate('/login');
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

        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your Email Address"
              required
              className="email-input"
            />
            <img src={mailIcon} alt="Email" className="email-icon" />
          </div>

          <button type="submit" className="next-button">
            Next
          </button>
        </form>

        <div className="sign-in-link-container">
          {/* Option 1: Using Link component (recommended for React Router) */}
          <Link to="/Signin" className="sign-in-link">
            Sign In
          </Link>

          {/* Option 2: Alternative using button with onClick handler */}
          {/* <button onClick={handleSignIn} className="sign-in-link">
            Sign In
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;