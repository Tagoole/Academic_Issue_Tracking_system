import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Generatetoken.css';
import token_image from '../assets/ict.png';
import API from '../api';
import axios from 'axios';

function Registrationtoken() {
  const [userRole, setUserRole] = useState(''); // Changed from userId to userRole for clarity
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await API.post('/api/refresh_token/', {
        refresh: refreshToken, // Match backend field name
      });

      const newAccessToken = response.data.access;
      localStorage.setItem('accessToken', newAccessToken);
      console.log('New access token obtained:', newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      localStorage.clear();
      setMessage('Session expired. Please log in again.');
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
        navigate('/');
      }, 5000);
      throw error;
    }
  };

  const handleGenerateToken = async () => {
    if (!email) {
      setMessage('Please enter an email address');
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
      return;
    }

    try {
      let accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setMessage('Please log in to generate a token.');
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
          navigate('/');
        }, 3000);
        return;
      }

      console.log('Sending payload:', { user_role: userRole, email }); // Log payload for debugging

      const response = await API.post(
        '/api/registration_token/',
        {
          user_role: userRole, // Changed to user_role to match potential serializer field
          email: email,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setMessage(`The registration token has been created and sent to the Email "${email}"`);
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 5000);
    } catch (error) {
      console.error('API error:', error.response); // Log full error response
      if (error.response?.status === 401) {
        try {
          const newAccessToken = await refreshAccessToken();
          console.log('Retrying with new token:', newAccessToken);

          const retryResponse = await API.post(
            '/api/registration_token/',
            {
              user_role: userRole,
              email: email,
            },
            {
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            }
          );

          setMessage(`The registration token has been created and sent to the Email "${email}"`);
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false);
          }, 5000);
        } catch (refreshError) {
          // Error message handled in refreshAccessToken
        }
      } else {
        // Handle 400 and other errors
        const errorMessage =
          error.response?.data?.errors ||
          error.response?.data?.user_role?.[0] ||
          error.response?.data?.email?.[0] ||
          'Failed to generate token. Please check the input and try again.';
        setMessage(errorMessage);
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
        }, 5000);
      }
    }
  };

  return (
    <div className="page-container">
      <div className="container">
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
            >
              <option value="" disabled>
                Select a role
              </option>
              <option value="lecturer">Lecturer</option>
              <option value="registrar">Registrar</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              placeholder="Enter the email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="generate-btn" onClick={handleGenerateToken}>
            Generate Registration Token
          </div>

          {showMessage && (
            <div
              className={`message ${
                !email || message.includes('Failed') || message.includes('expired')
                  ? 'error'
                  : 'success'
              }`}
            >
              {message}
            </div>
          )}
        </div>
        <div className="image-section">
          <div className="image-bubble">
            <div className="token-image">
              <img src={token_image} alt="Token" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registrationtoken;