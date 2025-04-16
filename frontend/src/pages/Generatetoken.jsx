import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Generatetoken.css';
import token_image from '../assets/ict.png';
import API from '../api';

function Registrationtoken() {
  const [userRole, setUserRole] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await API.post('/api/refresh_token/', {
        refresh: refreshToken,
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
      }, 3000);
      throw error;
    }
  };

  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    navigate('/registradashboard');
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

    if (!userRole) {
      setMessage('Please select a role');
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

      console.log('Sending payload:', { role: userRole, email });

      const response = await API.post(
        '/api/registration_token/',
        {
          role: userRole,
          email: email,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Show success popup instead of message
      setSuccessMessage(`The registration token has been created and sent to the Email "${email}"`);
      setShowSuccessPopup(true);
      
    } catch (error) {
      console.error('API error:', error.response);
      if (error.response?.status === 401) {
        try {
          const newAccessToken = await refreshAccessToken();
          console.log('Retrying with new token:', newAccessToken);

          const retryResponse = await API.post(
            '/api/registration_token/',
            {
              role: userRole,
              email: email,
            },
            {
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            }
          );

          // Show success popup instead of message
          setSuccessMessage(`The registration token has been created and sent to the Email "${email}"`);
          setShowSuccessPopup(true);
          
        } catch (refreshError) {
          // Error message handled in refreshAccessToken
        }
      } else {
        // Handle 400 and other errors
        const errorMessage =
          error.response?.data?.errors ||
          error.response?.data?.role?.[0] ||
          error.response?.data?.email?.[0] ||
          'Failed to generate token. Please check the input and try again.';
        setMessage(errorMessage);
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
        }, 3000);
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
              <option value="academic_registrar">Registrar</option>
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
                !email || message.includes('Failed') || message.includes('expired') || message.includes('select')
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

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-header">
              <h3>Success</h3>
            </div>
            <div className="popup-body">
              <p>{successMessage}</p>
            </div>
            <div className="popup-footer">
              <button className="popup-button" onClick={handleSuccessPopupClose}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Registrationtoken;