import React, { useState } from 'react';
import makerereLogo from '../assets/makererelogo.png';
import './Preferences.css';

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
    <div className="settings-container">
      {/* Sidebar */}
      <div className="settings-sidebar">
        <div className="university-logo-sidebar">
          <img src={makerereLogo} alt="University Logo" className="logo-sidebar" />
        </div>

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
      <div className="main-content">
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
