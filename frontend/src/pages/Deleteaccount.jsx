import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import makerereLogo from '../assets/makererelogo.png';
import './Deleteaccount.css';

const DeleteAccount = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleDeleteAccount = () => {
    setShowConfirmModal(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      
      // Get user ID from local storage
      const userId = localStorage.getItem('userId');
      const accessToken = localStorage.getItem('accessToken');
      
      if (!userId || !accessToken) {
        throw new Error('Authentication information not found. Please log in again.');
      }
      
      // Send delete request to Django backend using your API module
      await API.delete(`/users/delete-account/${userId}/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      // Clear all data from local storage
      localStorage.removeItem('userId');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user'); // Remove any other user-related data
      
      setShowConfirmModal(false);
      
      // Show brief success message before redirecting
      alert('Account deleted successfully');
      
      // Navigate to the landing page
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.detail || err.message || 'Failed to delete account';
      setError(errorMessage);
      console.error('Error deleting account:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDeleteAccount = () => {
    setShowConfirmModal(false);
    setError(null);
  };

  return (
    <div className="settings-container" style={{
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              minHeight: '100vh',
              width: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
     }}>
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
            {error && <p className="error-message">{error}</p>}
            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={cancelDeleteAccount}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="confirm-delete-btn"
                onClick={confirmDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'I understand, delete my account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;