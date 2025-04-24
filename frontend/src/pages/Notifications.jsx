import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './NavBar';
import SideBar from './Sidebar1';
import './Notifications.css';
import backgroundimage from '../assets/backgroundimage.jpg';
import API from '../api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated when component mounts
    const checkAuth = () => {
      const accessToken = localStorage.getItem('accessToken');
      // If no access token is available, redirect to login
      if (!accessToken) {
        navigate('/signin');
        return false;
      }
      return true;
    };
    
    // Fetch notifications when component mounts
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        
        // Get access token
        const accessToken = localStorage.getItem('accessToken');
        
        // Set authorization header with access token
        API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        
        const response = await API.get('/api/notifications/');
        console.log("Notifications API Response:", response.data); // Debug log
        setNotifications(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        
        // Check if error is due to unauthorized access (401)
        if (err.response && err.response.status === 401) {
          // Try refreshing the token
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            
            if (refreshToken) {
              const refreshResponse = await API.post('/api/refresh_token/', {
                refresh: refreshToken
              });
              
              // Store the new access token
              const newAccessToken = refreshResponse.data.access;
              localStorage.setItem('accessToken', newAccessToken);
              
              // Retry the original request with new token
              API.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
              const retryResponse = await API.get('/api/notifications/');
              setNotifications(retryResponse.data);
              setLoading(false);
            } else {
              // No refresh token available, redirect to login
              navigate('/signin');
            }
          } catch (refreshErr) {
            console.error('Error refreshing token:', refreshErr);
            setError('Your session has expired. Please log in again.');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/signin');
          }
        } else {
          setError('Failed to load notifications. Please try again later.');
          setLoading(false);
        }
      }
    };

    // Only fetch data if authentication check passes
    if (checkAuth()) {
      fetchNotifications();
    }
  }, [navigate]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return 'N/A';
    
    // Format time
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    // Format date
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    return {
      date: `${month}/${day}/${year}`,
      time: `${formattedHours}:${formattedMinutes} ${ampm}`
    };
  };

  const handleNotificationClick = (issueId) => {
    if (issueId) {
      navigate(`/view-details/${issueId}`);
    }
  };

  return (
    <div
      className="page-container"
      style={{
        backgroundImage: `url(${backgroundimage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
    >
      <SideBar />
      <div className="dashboard-content">
        <Navbar />
        <div className="content-container">
          <h1 className="notifications-title">NOTIFICATIONS</h1>
          
          {loading ? (
            <div className="loading-message">Loading notifications...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => {
              const formattedTime = formatDate(notification.created_at);
              return (
                <div 
                  className="notification-card" 
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.issue_id)}
                >
                  <div className="notification-content">
                    <p className="notification-text">
                      {notification.message}
                    </p>
                    <div className="notification-timestamp">
                      {formattedTime.date}
                      <br />
                      {formattedTime.time}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-notifications">
              <p>You have no notifications at this time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;