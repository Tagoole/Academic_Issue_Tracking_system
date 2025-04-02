import React from 'react';
import makerereLogo from '../assets/makererelogo.png';
import NavBar from './NavBar';
import './NotificationSuccess.css';
import backgroundImage from '../assets/pexels-olia-danilevich-5088017.jpg';

const NotificationSuccess = () => {
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
      </main>
    </div>
  );
};

export default NotificationSuccess;