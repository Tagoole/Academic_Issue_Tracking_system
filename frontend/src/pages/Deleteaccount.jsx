import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import makerereLogo from '../assets/makererelogo.png';
import backgroundImage from '../assets/pexels-olia-danilevich-5088017.jpg';
import './Deleteaccount.css';

const DeleteAccount = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();

  const handleDeleteAccount = () => {
    setShowConfirmModal(true);
  };

  const confirmDeleteAccount = () => {
    console.log('Account deleted');
    setShowConfirmModal(false);

    // Show brief success message before redirecting
    alert('Account deleted successfully');

    
    navigate('/');
  };

  const cancelDeleteAccount = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="settings-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="settings-sidebar glass-effect">
        <div className="university-logo-sidebar">
          <img src={makerereLogo} alt="Makerere University Logo" className="logo-sidebar" />
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

      <div className="main-content glass-effect">
        <h1 className="delete-account-title">Delete Account</h1>

        <div className="delete-account-content">
          <div className="trash-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#ff3333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </div>

          <div className="delete-account-description">
            <p>You are about to delete your account permanently. This action cannot be undone.</p>
            <p>All your data, including personal information, saved preferences, and history will be removed from our system.</p>
          </div>

          <div className="delete-account-button-container">
            <button
              className="delete-account-button pulse"
              onClick={handleDeleteAccount}
            >
              Delete My Account
            </button>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-effect">
            <h2>Are you absolutely sure?</h2>
            <p>This action cannot be undone. This will permanently delete your account and remove all data associated with it.</p>
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
  );
};

export default DeleteAccount;