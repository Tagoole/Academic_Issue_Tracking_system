import React, { useState } from 'react';
import makerereLogo from '../assets/makererelogo.png';
import hidden from '../assets/hidden.png';
import './Changepassword.css';

function Changepassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="settings-container">
      <div className="settings-sidebar">
        <div className="university-logo-sidebar">
          <img src={makerereLogo} alt="University Logo" className="logo-sidebar" />
        </div>

        {/* Change Password */}
        <a href="/changepassword" className="menu-item active">
          Change Password
          <svg viewBox="0 0 24 24" className="arrow-icon">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </a>

        {/* Preferences */}
        <a href="/preferences" className="menu-item">
          Preferences
          <svg viewBox="0 0 24 24" className="arrow-icon">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </a>

        {/* Support/Help */}
        <a href="/support" className="menu-item">
          Support/Help
          <svg viewBox="0 0 24 24" className="arrow-icon">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </a>

        {/* Delete Account */}
        <a href="/delete-account" className="delete-account">
          Delete Account
          <svg viewBox="0 0 24 24" className="arrow-icon">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </a>
      </div>

      <div className="main-content">
        <div className="password-change-form">
          <h2>Settings</h2>

          <div className="form-group">
            <label>Old Password</label>
            <div className="input-wrapper">
              <input
                type={showOldPassword ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter your Old password"
              />
              <button
                className="toggle-password"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                <img src={hidden} alt="Toggle visibility" />
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>New Password</label>
            <div className="input-wrapper">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your New password"
              />
              <button
                className="toggle-password"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                <img src={hidden} alt="Toggle visibility" />
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <div className="input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your New password"
              />
              <button
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <img src={hidden} alt="Toggle visibility" />
              </button>
            </div>
          </div>

          <button className="save-changes">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

export default Changepassword;
