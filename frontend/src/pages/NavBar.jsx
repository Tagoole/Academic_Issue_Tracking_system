import React, { useState } from 'react';
import './NavBar.css';
import profilePic from '../assets/profile.png';
import logo from '../assets/makererelogo.png';
import searchbar from '../assets/searchbar.png';
import notification from '../assets/notification.png';
import mail from '../assets/mail.png';
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
            <img 
              src={searchbar} 
              alt="Search Icon" 
              className="search-input-icon" 
            />
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

      <div className="navbar-right">
        <img
          src={mail}
          alt="Mail Icon"
          className="mail-icon"
          onClick={handleMailClick}
        />
        <img
          src={notification}
          alt="Notification Icon"
          className="notification-icon"
          onClick={handleNotificationClick}
        />
        <div className="app-title">Academic Issue Tracking System</div>
        <img src={logo} alt="Logo" className="logo-image" />
      </div>
    </nav>
  );
};

export default NavBar;