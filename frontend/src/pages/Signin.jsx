import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mail from '../assets/mail.png';
import hidden from '../assets/hidden.png';
import visible from '../assets/visible.png';
import codeIcon from '../assets/code-icon.png';
import graduateImage from '../assets/congragulation.png';
import API from '../api';
import './signin.css';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState(null); // Store response data for debugging
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    
    if (!agreeToTerms) {
      setError('You must agree to the terms and conditions.');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      // Call the token endpoint
      const response = await API.post('access_token/', {
        username,
        password
      });
      
      // Store and log the complete response data for debugging
      setResponseData(response.data);
      console.log('===== LOGIN RESPONSE =====');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('==========================');
      
      // Store tokens in localStorage
      if (response.data.access) {
        localStorage.setItem('accessToken', response.data.access);
        console.log('Access token stored successfully');
      }
      
      if (response.data.refresh) {
        localStorage.setItem('refreshToken', response.data.refresh);
        console.log('Refresh token stored successfully');
      }
      
      // Option 1: If the user role is included in the token response
      if (response.data.user_role || response.data.role) {
        const userRole = response.data.user_role || response.data.role;
        console.log('Role found directly in response:', userRole);
        localStorage.setItem('userRole', userRole);
        
        // Navigate based on user role
        redirectBasedOnRole(userRole);
      } 
      // Option 2: If we need to fetch user profile to get role
      else if (response.data.access) {
        try {
          console.log('Attempting to fetch user profile for role information...');
          
          // First try to extract role from JWT token
          const tokenPayload = parseJwt(response.data.access);
          console.log('Parsed JWT payload:', tokenPayload);
          
          if (tokenPayload && (tokenPayload.user_role || tokenPayload.role)) {
            const userRole = tokenPayload.user_role || tokenPayload.role;
            console.log('Role found in JWT token:', userRole);
            localStorage.setItem('userRole', userRole);
            redirectBasedOnRole(userRole);
          } else {
            // If token doesn't have role, try to fetch user profile
            try {
              // Set the token in the authorization header
              API.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
              
              // Fetch user profile to get role
              const profileResponse = await API.get('user_profile/');
              console.log('Profile response:', JSON.stringify(profileResponse.data, null, 2));
              
              if (profileResponse.data && (profileResponse.data.role || profileResponse.data.user_role)) {
                const userRole = profileResponse.data.role || profileResponse.data.user_role;
                console.log('Role found in user profile:', userRole);
                localStorage.setItem('userRole', userRole);
                redirectBasedOnRole(userRole);
              } else {
                // If we still don't have a role, try to determine from username
                console.log('No role found in profile, using username convention');
                determineRoleFromUsername(username);
              }
            } catch (profileError) {
              console.error('Error fetching user profile:', profileError);
              // Fall back to username-based role determination
              determineRoleFromUsername(username);
            }
          }
        } catch (error) {
          console.error('Error parsing token:', error);
          // Fall back to username-based role determination
          determineRoleFromUsername(username);
        }
      } else {
        // Fall back to username-based role determination
        console.log('No tokens contain role info, using username convention');
        determineRoleFromUsername(username);
      }
      
    } catch (err) {
      console.error('Login error:', err);
      
      // Log detailed error information
      if (err.response) {
        console.log('Error response status:', err.response.status);
        console.log('Error response data:', err.response.data);
        
        if (err.response.data.detail) {
          setError(err.response.data.detail);
        } else if (err.response.data.non_field_errors) {
          setError(err.response.data.non_field_errors.join(', '));
        } else {
          setError('Invalid username or password. Please try again.');
        }
      } else if (err.request) {
        console.log('No response received from server');
        setError('No response from server. Please check your connection.');
      } else {
        console.log('Error setting up request:', err.message);
        setError('Error connecting to the server. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to determine role based on username or email patterns
  const determineRoleFromUsername = (usernameOrEmail) => {
    console.log('Determining role from username/email:', usernameOrEmail);
    
    // Check if input is an email
    const isEmail = usernameOrEmail.includes('@');
    const input = usernameOrEmail.toLowerCase();
    
    // Pattern matching for different roles
    if (input.includes('student') || input.startsWith('st') || input.match(/^s\d+$/)) {
      console.log('Username/email pattern indicates student role');
      localStorage.setItem('userRole', 'student');
      redirectBasedOnRole('student');
    } else if (input.includes('teacher') || input.includes('lecturer') || input.startsWith('lec')) {
      console.log('Username/email pattern indicates lecturer role');
      localStorage.setItem('userRole', 'teacher');
      redirectBasedOnRole('teacher');
    } else if (input.includes('registrar') || input.startsWith('reg') || input.includes('admin')) {
      console.log('Username/email pattern indicates registrar role');
      localStorage.setItem('userRole', 'registrar');
      redirectBasedOnRole('registrar');
    } else {
      console.log('Role could not be determined from username/email, using default');
      // Default path if role can't be determined
      navigate('/dashboard');
    }
  };

  // Helper function to redirect based on role
  const redirectBasedOnRole = (role) => {
    console.log('Redirecting based on role:', role);
    
    // Make role check case-insensitive
    const roleLower = role.toLowerCase();
    
    if (roleLower === 'student') {
      navigate('/studentdashboard');
    } else if (roleLower === 'teacher' || roleLower === 'lecturer') {
      navigate('/lecturerdashboard');
    } else if (roleLower === 'registrar' || roleLower === 'admin') {
      navigate('/registradashboard');
    } else {
      // Default dashboard for other roles
      navigate('/dashboard');
    }
  };

  // Helper function to parse JWT token
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error parsing JWT token:', e);
      return null;
    }
  };

  // Debug view for development only
  const renderDebugView = () => {
    if (!responseData) return null;
    
    return (
      <div className="debug-panel" style={{
        padding: '15px',
        margin: '20px 0',
        backgroundColor: '#f5f5f5',
        border: '1px solid #ddd',
        borderRadius: '4px',
        overflow: 'auto',
        maxHeight: '300px'
      }}>
        <h4>Debug Response Data:</h4>
        <pre style={{ whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(responseData, null, 2)}
        </pre>
      </div>
    );
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
            
            {error && <p className="error-message">{error}</p>}
            
            <form className="sign-in-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <div className="input-container">
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your Username or Email"
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
                    src={passwordVisible ? visible : hidden}
                    alt="Toggle Password"
                    className="icon clickable"
                    onClick={() => setPasswordVisible(!passwordVisible)}
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
            
            {/* Display response data in development environment */}
            {process.env.NODE_ENV === 'development' && renderDebugView()}
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