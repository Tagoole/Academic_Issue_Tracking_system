import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import makerereLogo from '../assets/makererelogo.png'; // Add the logo if needed
import './Deleteaccount.css';

const Deleteaccount = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleDeleteAccount = () => {
    setShowConfirmModal(true);
  };

  const confirmDeleteAccount = () => {
    // Implement actual account deletion logic here
    console.log('Account deleted');
    setShowConfirmModal(false);
  };

  const cancelDeleteAccount = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="settings-container">
      {/* Sidebar */}
      <div className="settings-sidebar">
        <div className="university-logo-sidebar">
          <img src={makerereLogo} alt="University Logo" className="logo-sidebar" />
        </div>

        <Link to="/changepassword" className="menu-item">
          Change Password
          <svg viewBox="0 0 24 24" className="arrow-icon">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </Link>

        <Link to="/preferences" className="menu-item">
          Preferences
          <svg viewBox="0 0 24 24" className="arrow-icon">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </Link>

        <Link to="/help" className="menu-item">
          Support/Help
          <svg viewBox="0 0 24 24" className="arrow-icon">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </Link>

        <Link to="/deleteaccount" className="menu-item active">
          Delete Account
          <svg viewBox="0 0 24 24" className="arrow-icon">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </Link>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="delete-account-title">Delete Account</div>

        <div className="delete-account-description">
          You are about to delete your account permanently.
        </div>

        <div className="delete-account-button-container">
          <button 
            className="delete-account-button"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </div>

        {showConfirmModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Are you absolutely sure?</h2>
              <p>This action cannot be undone. This will permanently delete your account.</p>
              <div className="modal-buttons">
                <button 
                  className="cancel-btn"
                  onClick={cancelDeleteAccount}
                >
                  Cancel
                </button>
                <button 
                  className="confirm-delete-btn"
                  onClick={confirmDeleteAccount}
                >
                  I understand, delete my account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Deleteaccount;
