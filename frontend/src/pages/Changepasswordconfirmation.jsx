import React, { useState } from 'react';
import makerereLogo from '../assets/makererelogo.png';
import hidden from '../assets/hidden.png';
import './Changepasswordconfirmation.css';

function Changepasswordconfirmation() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveChanges = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleNext = () => {
    console.log('Changes saved!');
    setIsModalOpen(false);
  };

  return (
    <div className={`settings-container ${isModalOpen ? 'blurred' : ''}`}>
      <div className="settings-sidebar">
        <div className="university-logo-sidebar">
          <img src={makerereLogo} alt="University Logo" className="logo-sidebar" />
        </div>
        <a href="/preferences" className="menu-item">Preferences</a>
        <a href="/support" className="menu-item">Support/Help</a>
        <a href="/delete-account" className="delete-account">Delete Account</a>
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
          <button className="save-changes" onClick={handleSaveChanges}>
            Save Changes
          </button>
        </div>
      </div>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-message">Are you sure you want to save the changes?</h2>
            <div className="modal-actions">
              <button className="cancel-button" onClick={handleCancel}>
                Cancel
              </button>
              <button className="next-button" onClick={handleNext}>
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Changepasswordconfirmation;
