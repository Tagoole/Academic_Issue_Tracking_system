import React, { useState } from 'react';
import makerereLogo from '../assets/makererelogo.png';
import './Preferences.css';
import NavBar from './Navbar';
import backgroundimage from '../assets/pexels-olia-danilevich-5088017.jpg'; // Updated background image

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
        backgroundImage: `url(${backgroundimage})`, // Updated background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      {/* NavBar */}
      <NavBar />

      {/* Sidebar */}
      <div
        className="settings-sidebar"
        style={{
          background: 'rgba(0, 0, 0, 0.6)', // Black with 60% opacity for glassmorphism
          backdropFilter: 'blur(6px)', // Blur effect
          WebkitBackdropFilter: 'blur(6px)', // For Safari support
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.1)', // Subtle border
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)', // Enhanced shadow
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

        <a href="/support" className="menu-item">
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
          background: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white background
          backdropFilter: 'blur(12px)', // Blur effect
          WebkitBackdropFilter: 'blur(12px)', // For Safari support
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.18)', // Subtle border
          boxShadow: '0 8px 32px 0 rgba(5, 5, 5, 0.37)', // Enhanced shadow
        }}
      >
        <div className="preferences-container">
          <div className="preferences-title">Preferences</div>

          <div className="menu-options">
            <div className="preference-section">
              <div className="preference-title">In-App Messaging</div>
              <div className="preference-description">
                Click the toggle button to deactivate that field.
              </div>
              <div
                className={`toggle-switch ${inAppMessaging ? 'active' : ''}`}
                onClick={toggleInAppMessaging}
              >
                <div className="toggle-slider"></div>
              </div>
            </div>

            <div className="preference-section">
              <div className="preference-title">Email Updates</div>
              <div className="preference-description">
                Click the toggle button to deactivate that field.
              </div>
              <div
                className={`toggle-switch ${emailUpdates ? 'active' : ''}`}
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
