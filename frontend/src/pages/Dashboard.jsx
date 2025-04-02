import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import libraryImage from '../assets/student.png'; // Import the library image (you'll need to add this)
import dashboardIcon from '../assets/knowledge.png'; // Import dashboard icon (you'll need to add this)
import './Dashboard.css';
import './Deleteaccount.css';

const DashboardSetup = () => {
  const navigate = useNavigate();
  const handleStartSetup = () => {
    navigate('/ProfileSetup');
  };

  return (
    <div className="dashboard-setup-container">
      <div className="split-layout">
        <div className="left-section">
          <img src={libraryImage} alt="Library" className="library-image" />
        </div>
        
        <div className="right-section">
          <div className="setup-content">
            <h1 className="welcome-title">Welcome!</h1>
            <h2 className="setup-subtitle">This is your Dashboard setup</h2>
            
            <p className="setup-description">
              Help us customize your account and preferences to get started quickly.
            </p>
            
            <img src={dashboardIcon} alt="Dashboard" className="dashboard-icon" />
            
            <button onClick={handleStartSetup} className="setup-button">
              Start Setup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
    <div className="delete-account-container">
      <div className="delete-account-title">Delete Account</div>
      <div className="delete-account-description">
        Are you sure you want to delete your account? This action cannot be undone.
      </div>
      <div className="delete-account-button-container">
        <button className="delete-account-button" onClick={handleDeleteClick}>
          Delete Account
        </button>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete your account? This action is irreversible.</p>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={handleCancelDelete}>
                Cancel
              </button>
              <button className="confirm-delete-btn" onClick={handleConfirmDelete}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { DashboardSetup, DeleteAccount };