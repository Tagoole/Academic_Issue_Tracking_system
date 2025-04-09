import React, { useState } from 'react';
import makerereLogo from '../assets/makererelogo.png';
import './Preferences.css';
import NavBar from './Navbar';
import backgroundImage from '../assets/pexels-olia-danilevich-5088017.jpg'; // Background image

const Preferences = () => {
  const [inAppMessaging, setInAppMessaging] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);

  const toggleInAppMessaging = () => {
    setInAppMessaging(!inAppMessaging);
  };

  const toggleEmailUpdates = () => {
    setEmailUpdates(!emailUpdates);
  };

  return (
    <div
      className="settings-container"
      style={{
        backgroundImage: `url(${backgroundImage})`, // Fixed template literal syntax
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100%',
        position: 'absolute', // Position absolute to cover the entire viewport
        top: 0,
        left: 0,
      }}
    >
      {/* NavBar */}
      <NavBar />

      {/* Sidebar */}
      <div
        className="settings-sidebar"
        style={{
          background: 'rgba(0, 0, 0, 0.4)', // Increased opacity for better visibility
          backdropFilter: 'blur(10px)', // Enhanced blur effect
          WebkitBackdropFilter: 'blur(10px)', // For Safari support
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.18)', // More visible border
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)', // Enhanced shadow
          padding: '25px 20px', // Improved padding
          zIndex: 10, // Ensure sidebar is above background
        }}
      >
        <div className="university-logo-sidebar">
          <img src={makerereLogo} alt="University Logo" className="logo-sidebar" />
        </div>

        {/* Back to Dashboard Button */}
        <a href="/dashboard" className="menu-item back-to-dashboard">
          Back to Dashboard
          <svg viewBox="0 0 24 24" className="arrow-icon">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </a>

        {/* Change Password Button */}
        <a href="/changepassword" className="menu-item">
          Change Password
          <svg viewBox="0 0 24 24" className="arrow-icon">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </a>

        <a href="/preferences" className="menu-item active">
          Preferences
          <svg viewBox="0 0 24 24" className="arrow-icon">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </a>

        <a href="/help" className="menu-item">
          Support/Help
          <svg viewBox="0 0 24 24" className="arrow-icon">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </a>

        <a href="/delete-account" className="delete-account">
          Delete Account
          <svg viewBox="0 0 24 24" className="arrow-icon">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </a>
      </div>

      {/* Main Content */}
      <div
        className="main-content"
        style={{
          background: 'rgba(255, 255, 255, 0.15)', // More transparent to enhance glassmorphism
          backdropFilter: 'blur(15px)', // Increased blur for more glassmorphism effect
          WebkitBackdropFilter: 'blur(15px)', // For Safari support
          borderRadius: '15px',
          border: '1px solid rgba(255, 255, 255, 0.2)', // More visible border
          boxShadow: '0 8px 32px 0 rgba(5, 5, 5, 0.37)', // Enhanced shadow
          padding: '30px', // Increased padding for better spacing
          marginTop: '20px', // Add some space from the top
          maxWidth: '800px', // Limit width for better readability
          width: '100%', // Take full width up to max-width
          zIndex: 5, // Ensure content is above background
          marginLeft: '300px', // Adjusted margin to account for sidebar width 
        }}
      >
        <div className="preferences-container">
          <div className="preferences-title">Preferences</div>

          <div className="menu-options">
            <div className="preference-section" style={{
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <div className="preference-title">In-App Messaging</div>
              <div className="preference-description">
                Click the toggle button to deactivate that field.
              </div>
              <div
                className={`toggle-switch ${inAppMessaging ? 'active' : ''}`} // Fixed template literal syntax
                onClick={toggleInAppMessaging}
              >
                <div className="toggle-slider"></div>
              </div>
            </div>

            <div className="preference-section" style={{
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <div className="preference-title">Email Updates</div>
              <div className="preference-description">
                Click the toggle button to deactivate that field.
              </div>
              <div
                className={`toggle-switch ${emailUpdates ? 'active' : ''}`} // Fixed template literal syntax
                onClick={toggleEmailUpdates}
              >
                <div className="toggle-slider"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preferences;