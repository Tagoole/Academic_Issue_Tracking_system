import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import makerereLogo from '../assets/makererelogo.png'; 
import './Deleteaccount.css';
import NavBar from './Navbar';
import backgroundimage from '../assets/backgroundimage.jpg'; // Background image

const DeleteAccount = () => {
  const [showModal, setShowModal] = useState(false);

  const handleDeleteClick = () => {
    setShowModal(true); // Show the confirmation modal
  };

  const handleConfirmDelete = () => {
    setShowModal(false); // Close the modal
    alert('Your account has been deleted successfully!');
    // Add logic to delete the account here (e.g., API call)
    console.log('Account deleted');
  };

  const handleCancelDelete = () => {
    setShowModal(false); // Close the modal
  };

  return (
    <div
      className="settings-container"
      style={{
        backgroundImage: `url(${backgroundimage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
    >
      {/* NavBar */}
      <NavBar />

      {/* Sidebar with glassmorphism effect */}
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

        <Link to="/dashboard" className="menu-item">
          Back to Dashboard
          <svg viewBox="0 0 24 24" className="arrow-icon">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </Link>

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

      {/* Main Content with glassmorphism effect */}
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
        <div className="delete-account-title">Delete Account</div>

        <div className="delete-account-description">
          Are you sure you want to delete your account? This action cannot be undone.
        </div>

        <div className="delete-account-button-container">
          <button
            className="delete-account-button"
            onClick={handleDeleteClick}
          >
            Delete Account
          </button>
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Confirm Deletion</h2>
              <p>Are you sure you want to delete your account? This action is irreversible.</p>
              <div className="modal-buttons">
                <button
                  className="cancel-btn"
                  onClick={handleCancelDelete}
                >
                  Cancel
                </button>
                <button
                  className="confirm-delete-btn"
                  onClick={handleConfirmDelete}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteAccount;
