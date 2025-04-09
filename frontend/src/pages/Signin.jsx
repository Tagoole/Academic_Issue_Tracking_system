import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
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
      // Make API call to authenticate user using your API instance
      const response = await API.post('/api/access_token/', {
        username,
        password
      });

      // API response is automatically parsed by axios
      const data = response.data;
      // Add this right after getting the response
      console.log('API Response:', response.data);
      
      // Store tokens in localStorage
      if (data.access) {
        localStorage.setItem('accessToken', data.access);
      } else {
        console.warn('No access token in response');
      }
      
      if (data.refresh) {
        localStorage.setItem('refreshToken', data.refresh);
      }
      
      // Check the role directly from the response
      // (Modified to check for role directly in response instead of nested in user object)
      if (data.role) {
        // Store role in localStorage for future use if needed
        localStorage.setItem('userRole', data.role);
        
        switch (data.role.toLowerCase()) {
          case 'student':
            navigate('/studentdashboard');
            break;
          case 'academic_registrar':
            navigate('/registrardashboard');
            break;
          default:
            navigate('/landingpage'); 
            break;
        }
      } else {
        // If no role is provided, show warning and redirect to default dashboard
        console.warn('No role found in response');
        setError('Login successful but role information is missing. Contact administrator.');
        navigate('/landingpage');
      }
      
    } catch (err) {
      // Axios error handling
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(err.response.data.message || `Error: ${err.response.status}`);
        console.error('Response error:', err.response.data);
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response received from server. Please try again later.');
        console.error('Request error:', err.request);
      } else {
        // Something happened in setting up the request
        setError(err.message || 'An error occurred during sign in');
        console.error('Sign in error:', err);
      }
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