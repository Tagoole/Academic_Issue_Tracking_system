import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mail from '../assets/mail.png';
import hidden from '../assets/hidden.png';
import codeIcon from '../assets/code-icon.png';
import graduateImage from '../assets/congragulation.png';
import './signin.css';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Make API call to authenticate user
      const response = await fetch('/api/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      // Check if response is empty
      const responseText = await response.text();
      if (!responseText) {
        throw new Error('Server returned empty response');
      }

      // Try to parse the response as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError);
        console.error('Response text:', responseText);
        throw new Error('Invalid response format from server');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to sign in');
      }
      
      // Store tokens in localStorage
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
      } else {
        console.warn('No access token in response');
      }
      
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      
      // Check user role and redirect accordingly
      if (data.user && data.user.role) {
        switch (data.user.role.toLowerCase()) {
          case 'student':
            navigate('/studentdashboard');
            break;
          case 'academic_registrar':
            navigate('/registrardashboard');
            break;
          default:
            navigate('/dashboard'); // Default dashboard if role is not recognized
            break;
        }
      } else {
        // If no role is provided, redirect to a default page
        console.warn('No user role found in response');
        navigate('/dashboard');
      }
      
    } catch (err) {
      setError(err.message || 'An error occurred during sign in');
      console.error('Sign in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <div className="top-navigation">
        <a href="/forgot-password" className="forgot-password-link">FORGOT PASSWORD</a>
        <img src={codeIcon} alt="Code Icon" className="code-icon" />
      </div>
      
      <div className="split-layout">
        <div className="left-section">
          <div className="header">
            <h1 className="green-text">WELCOME TO THE ACADEMIC TRACKING SYSTEM</h1>
            <h2 className="green-text">(ATIS)</h2>
          </div>

          <div className="content">
            <h4 className="sign-in-heading">Sign in</h4>
            {error && <div className="error-message">{error}</div>}
            <form className="sign-in-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <div className="input-container">
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your Username"
                    required
                  />
                  <img src={mail} alt="User Icon" className="icon" />
                </div>
              </div>

              <div className="form-group">
                <div className="input-container">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <img
                    src={hidden}
                    alt="Toggle Password"
                    className="icon"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              </div>
              
              <a href="/forgot-password" className="forgot-password-text">Forgot the password?</a>

              <div className="terms-group">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  required
                />
                <label htmlFor="terms">I have read and understood the terms and conditions of the ATIS.</label>
              </div>

              <button 
                type="submit" 
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <p className="sign-up-link">
              Don't have an account? <a href="/signup" className="signup-link">Sign Up.</a>
            </p>
          </div>
        </div>

        <div className="right-section">
          <img src={graduateImage} alt="Graduate celebrating with confetti" className="graduate-image" />
        </div>
      </div>
    </div>
  );
};

export default SignIn;