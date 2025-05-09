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
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorType, setErrorType] = useState(''); // For styling different types of errors
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const clearErrors = () => {
    setErrorMessage('');
    setErrorType('');
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    clearErrors(); // Clear errors when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();
    
    // Form validation
    if (!username.trim()) {
      setErrorMessage('Username is required');
      setErrorType('validation');
      return;
    }

    if (!password) {
      setErrorMessage('Password is required');
      setErrorType('validation');
      return;
    }

    setIsLoading(true);

    try {
      // Make API call to authenticate user
      const response = await API.post('/api/access_token/', {
        username,
        password
      });

      // API response handling
      const data = response.data;
      console.log('API Response:', data);

      // Store user data in localStorage
      const userDataItems = [
        { key: 'userEmail', value: data.email },
        { key: 'userGender', value: data.gender },
        { key: 'userName', value: data.username },
        { key: 'userProgram', value: data.program },
        { key: 'userId', value: data.id },
        { key: 'accessToken', value: data.access },
        { key: 'refreshToken', value: data.refresh },
        { key: 'userRole', value: data.role }
      ];

      userDataItems.forEach(item => {
        if (item.value) {
          localStorage.setItem(item.key, item.value);
        }
      });

      // Handle navigation based on role
      if (data.role) {
        switch (data.role.toLowerCase()) {
          case 'student':
            navigate('/studentdashboard');
            break;
          case 'academic_registrar':
            navigate('/registradashboard');
            break;
          case 'lecturer':
            navigate('/lecturerdashboard');
            break;
          default:
            navigate('/landingpage');
            break;
        }
      } else {
        setErrorMessage('Login successful but role information is missing. Please contact administrator.');
        setErrorType('role');
        navigate('/landingpage');
      }

    } catch (err) {
      // Enhanced error handling with specific messages
      if (err.response) {
        const status = err.response.status;
        
        // Handle specific HTTP status codes
        switch (status) {
          case 400:
            setErrorMessage('Invalid username or password format.');
            break;
          case 401:
            setErrorMessage('Incorrect username or password. Please try again.');
            break;
          case 403:
            setErrorMessage('Your account is inactive or suspended. Please contact administrator.');
            break;
          case 404:
            setErrorMessage('User not found. Please check your username or sign up.');
            break;
          case 429:
            setErrorMessage('Too many login attempts. Please try again later.');
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            setErrorMessage('Server error. Please try again later or contact support.');
            break;
          default:
            // Use server's error message if available
            setErrorMessage(err.response.data.message || 
              err.response.data.detail || 
              err.response.data.error || 
              `Login failed (Error: ${status})`);
        }
        
        console.error('Response error:', err.response.data);
      } else if (err.request) {
        setErrorMessage('Unable to connect to the server. Please check your internet connection and try again.');
        console.error('Request error:', err.request);
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
        console.error('Sign in error:', err);
      }
      
      setErrorType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorClass = () => {
    switch (errorType) {
      case 'validation':
        return 'validation-error';
      case 'role':
        return 'role-error';
      case 'error':
      default:
        return 'server-error';
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
            <h1 className="green-text">WELCOME TO THE ACADEMIC ISSUE TRACKING SYSTEM</h1>
          </div>

          <div className="content">
            <h4 className="sign-in-heading">Sign in</h4>
            
            {errorMessage && (
              <div className={`error-message ${getErrorClass()}`}>
                {errorMessage}
              </div>
            )}
            
            <form className="sign-in-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <div className="input-container">
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={handleInputChange(setUsername)}
                    placeholder="Enter your Username"
                    aria-label="Username"
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
                    onChange={handleInputChange(setPassword)}
                    placeholder="Enter your password"
                    aria-label="Password"
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