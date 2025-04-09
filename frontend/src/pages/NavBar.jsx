import React, { useState, useRef } from 'react';
import './NavBar.css';
import profilePic from '../assets/profile.png';
import logo from '../assets/makererelogo.png';
import notificationIcon from '../assets/notification.png';
import messageIcon from '../assets/mail.png';
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [profileImage, setProfileImage] = useState(profilePic);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${searchQuery}`);
  };

  const handleMailClick = () => {
    navigate('/messages');
  };

  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  const openFileSelector = () => {
    fileInputRef.current.click();
  };

  const handleProfileClick = () => {
    setShowProfileModal(!showProfileModal);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
        setShowProfileModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <nav className="navbar">
      {/* Left Section: Profile */}
      <div className="navbar-left">
        <div className="profile-container">
          <div className="profile-image-container" onClick={handleProfileClick}>
            <img src={profileImage} alt="Profile" className="profile-image" />
            <div className="profile-image-overlay">
              <span className="change-text">Change</span>
            </div>
          </div>
          <span className="profile-name">{'{First Name}'}</span>
        </div>
      </div>

      {/* Center Section: Search Bar */}
      <div className="search-container">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search for anything..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </form>
      </div>

      {/* Right Section: Icons and Title */}
      <div className="navbar-right">
        <div className="icon-container" onClick={handleNotificationClick}>
          <img src={notificationIcon} alt="Notifications" className="icon" />
        </div>
        <div className="icon-container" onClick={handleMailClick}>
          <img src={messageIcon} alt="Messages" className="icon" />
        </div>
        <div className="app-title">Academic Issue Tracking System</div>
        <img src={logo} alt="Logo" className="logo-image" />
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {/* Profile Picture Change Modal */}
      {showProfileModal && (
        <div className="profile-modal">
          <div className="profile-modal-content">
            <h3>Change Profile Picture</h3>
            <div className="modal-profile-preview">
              <img src={profileImage} alt="Current profile" />
            </div>
            <button onClick={openFileSelector} className="upload-btn">
              Upload New Picture
            </button>
            <button onClick={() => setShowProfileModal(false)} className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;