import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import makerereLogo from '../assets/makererelogo.png';
import NavBar from './NavBar';
import './notification-success.css';
import backgroundImage from '../assets/pexels-olia-danilevich-5088017.jpg';

const NotificationSuccess = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Set timer to redirect after 2 seconds
    const redirectTimer = setTimeout(() => {
      navigate('/studentdashboard'); // Redirect to student dashboard
    }, 2000);
    
    // Clean up the timer if component unmounts before timeout completes
    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <div
      className="notification-success-page"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh'
      }}
    >
      <NavBar />
      {/* Main Content Section */}
      <main
        className="main-content"
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',  // semi-transparent white background
          margin: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Success Message Section */}
        <div
          className="success-message-container"
          style={{ width: '100%', padding: '15px 20px' }}
        >
          <div
            className="success-message"
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#e8f5e9',
              padding: '15px',
              borderRadius: '5px',
            }}
          >
            <div className="message-logo">
              <img
                src={makerereLogo}
                alt="Logo"
                className="logo-small"
                style={{ width: '30px', height: 'auto' }}
              />
            </div>
            <div
              className="message-text"
              style={{ flex: 1, padding: '0 15px' }}
            >
              You have successfully submitted your issues, be patient as it is
              worked upon.
            </div>
            <div className="message-timestamp">13/02/2025 6:00PM</div>
          </div>
        </div>
        
        {/* University Logo Section */}
        <div
          className="center-logo-container"
          style={{ textAlign: 'center', marginTop: '30px' }}
        >
          <div className="makerere-logo-large-container">
            <img
              src={makerereLogo}
              alt="University Logo"
              className="university-logo-large"
            />
            <div className="university-name">MAKERERE UNIVERSITY</div>
            <div className="system-acronym">AITS</div>
          </div>
        </div>
        
        {/* Redirect Message */}
        <div
          className="redirect-message"
          style={{
            marginTop: '20px',
            padding: '10px',
            backgroundColor: '#f8f9fa',
            borderRadius: '5px',
            textAlign: 'center',
            animation: 'fadeIn 0.5s ease'
          }}
        >
          Redirecting to dashboard in 2 seconds...
        </div>
      </main>
    </div>
  );
};

export default NotificationSuccess;