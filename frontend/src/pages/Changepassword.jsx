import React, { useState } from 'react';
import makerereLogo from '../assets/makererelogo.png';
import hidden from '../assets/hidden.png';
import './Changepassword.css';
import NavBar from './NavBar'; // Implemented NavBar
import backgroundimage from '../assets/pexels-olia-danilevich-5088017.jpg'; // Updated background image

function Changepassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false); // State to show confirmation modal
  const [successMessage, setSuccessMessage] = useState(false); // State to show success message
  const [passwordError, setPasswordError] = useState(''); // State to show password error

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return "";
  };

  const handleSaveChanges = () => {
    // Add validation here before showing confirmation
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields");
      return;
    }

    // Validation for password length
    if (newPassword.length <= 6) {
      alert("New password must be more than 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords don't match");
      return;
    }
    setShowConfirmation(true); // Show confirmation modal
  };

  const confirmChangePassword = () => {
    setShowConfirmation(false); // Close confirmation modal
    setSuccessMessage(true); // Show success message
    // Add logic to handle password change here
    console.log('Password changed successfully!');
    
    // Reset form fields after successful change
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    
    // Hide success message after 3 seconds
    setTimeout(() => setSuccessMessage(false), 3000);
  };

  const cancelChangePassword = () => {
    setShowConfirmation(false); // Close confirmation modal
  };

  const handleNewPasswordChange = (e) => {
    const newPass = e.target.value;
    setNewPassword(newPass);
    
    // Only validate if there's something to validate
    if (newPass) {
      setPasswordError(validatePassword(newPass));
    } else {
      setPasswordError('');
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundimage})`, // Fixed: Using template literals for string interpolation
        backgroundSize: 'cover', // Ensure the image covers the entire screen
        backgroundPosition: 'center', // Center the image
        backgroundRepeat: 'no-repeat', // Prevent the image from repeating
        minHeight: '100vh', // Ensure the background covers the full viewport height
        width: '100%', // Ensure the background covers the full viewport width
      }}
    >
      {/* Add the NavBar */}
      <NavBar />

      {/* Main content container */}
      <div className="settings-container">
        {/* Glassmorphism applied to sidebar */}
        <div
          className="settings-sidebar"
          style={{
            background: 'rgba(0, 0, 0, 0.6)', // Black with 60% opacity for glassmorphism
            backdropFilter: 'blur(6px)', // Reduced blur effect
            WebkitBackdropFilter: 'blur(6px)', // For Safari support
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)', // Subtle border
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)', // Enhanced shadow
          }}
        >
          <div className="university-logo-sidebar">
            <img src={makerereLogo} alt="University Logo" className="logo-sidebar" />
          </div>

          {/* Sidebar menu items */}
          <a href="/dashboard" className="menu-item">
            Back to Dashboard
            <svg viewBox="0 0 24 24" className="arrow-icon">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </a>

          <a href="/changepassword" className="menu-item active">
            Change Password
            <svg viewBox="0 0 24 24" className="arrow-icon">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </a>

          <a href="/preferences" className="menu-item">
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

        {/* Glassmorphism applied to main content */}
        <div
          className="main-content"
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            boxShadow: '0 8px 32px 0 rgba(5, 5, 5, 0.37)',
          }}
        >
          <div className="password-change-form">
            <h2>Settings</h2>

            <div className="form-group">
              <label>Old Password</label>
              <div
                className="input-wrapper"
                style={{
                  background: 'rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                  borderRadius: '5px',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                }}
              >
                <input
                  type={showOldPassword ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter Old password"
                  style={{
                    background: 'transparent',
                    color: '#333',
                  }}
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
              <div
                className="input-wrapper"
                style={{
                  background: 'rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                  borderRadius: '5px',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                }}
              >
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  placeholder="Enter New password"
                  style={{
                    background: 'transparent',
                    color: '#333',
                  }}
                />
                <button
                  className="toggle-password"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  <img src={hidden} alt="Toggle visibility" />
                </button>
              </div>
              {passwordError && (
                <div className="error-message" style={{ color: '#ff3333', fontSize: '0.8rem', marginTop: '5px' }}>
                  {passwordError}
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <div
                className="input-wrapper"
                style={{
                  background: 'rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                  borderRadius: '5px',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                }}
              >
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New password"
                  style={{
                    background: 'transparent',
                    color: '#333',
                  }}
                />
                <button
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <img src={hidden} alt="Toggle visibility" />
                </button>
              </div>
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <div className="error-message" style={{ color: '#ff3333', fontSize: '0.8rem', marginTop: '5px' }}>
                  Passwords don't match
                </div>
              )}
            </div>

            <button
              className="save-changes"
              style={{
                background: 'rgba(11, 11, 11, 0.7)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                boxShadow: '0 8px 32px 0 rgba(6, 6, 6, 0.37)',
                color: 'white',
                padding: '10px 25px',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onClick={handleSaveChanges}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Password Change</h2>
            <p>Are you sure you want to change your password?</p>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={cancelChangePassword}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={confirmChangePassword}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Success Message */}
      {successMessage && (
        <div className="success-message-overlay">
          <div 
            className="success-message-content"
            style={{
              background: 'rgba(10, 10, 10, 0.9)',
              color: 'white',
              padding: '20px 30px',
              borderRadius: '10px',
              boxShadow: '0 8px 32px 0 rgba(6, 6, 6, 0.37)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              animation: 'fadeInOut 3s ease',
              maxWidth: '400px',
              textAlign: 'center'
            }}
          >
            <div 
              className="success-icon"
              style={{
                width: '60px',
                height: '60px',
                background: 'white',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '15px'
              }}
            >
              <svg 
                viewBox="0 0 24 24" 
                width="40" 
                height="40" 
                fill="rgb(11, 11, 11)"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
            </div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>Success!</h3>
            <p style={{ margin: '0', fontSize: '16px' }}>Your password has been changed successfully.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Changepassword;