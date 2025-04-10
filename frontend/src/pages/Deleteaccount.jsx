import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import makerereLogo from '../assets/makererelogo.png';
import backgroundImage from '../assets/pexels-olia-danilevich-5088017.jpg';
import './Deleteaccount.css';

const DeleteAccount = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleDeleteAccount = () => {
    setShowConfirmModal(true);
  };

  const confirmDeleteAccount = () => {
    console.log('Account deleted');
    setShowConfirmModal(false);
    setShowSuccessModal(true);
    
    setTimeout(() => {
      // window.location.href = '/login';
      setShowSuccessModal(false);
    }, 3000);
  };

  const cancelDeleteAccount = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="settings-container">
      <div className="background-image"></div>
      
      {/* Sidebar */}
      <div className="settings-sidebar glass-effect">
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
      
      {/* Confirmation Modal */}
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
      
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-effect success-modal">
            <div className="success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2>Account Deleted Successfully</h2>
            <p>Your account has been permanently deleted. You will be redirected to the login page shortly.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;