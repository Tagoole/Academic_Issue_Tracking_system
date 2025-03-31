import React, { useState } from 'react';
import './NavBar.css';
import profilePic from '../assets/profile.png';
import logo from '../assets/makererelogo.png';
import notificationIcon from '../assets/notification.png';
import messageIcon from '../assets/mail.png';
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
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

  return (
    <nav className="navbar">
      
      <div className="navbar-left">
        <div className="profile-container">
          <img src={profilePic} alt="Profile" className="profile-image" />
          <span className="profile-name">{'{First Name}'}</span>
        </div>
      </div>

      
      <div className="search-container">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search for anything..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input global-search"
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
    </nav>
  );
};

export default NavBar;