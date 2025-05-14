import React, { useState, useEffect } from 'react';
import './NavBar.css';
import logo from '../assets/makererelogo.png';
import notificationIcon from '../assets/notification.png';
import messageIcon from '../assets/mail.png';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userName, setUserName] = useState('User'); // Initialize with a default value
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check all possible localStorage keys that might contain the username
    console.log("Checking localStorage for username...");
    
    // Try common variations of the key name
    const possibleKeys = ['userName', 'username', 'user', 'name', 'userInfo', 'user_name'];
    let foundUserName = null;
    
    possibleKeys.forEach(key => {
      const value = localStorage.getItem(key);
      console.log(`Checking localStorage key: ${key} = ${value}`);
      if (value && !foundUserName) {
        foundUserName = value;
      }
    });
    
    // Check if there's any user data stored as JSON
    try {
      const userJSON = localStorage.getItem('user');
      if (userJSON) {
        const userData = JSON.parse(userJSON);
        console.log("Found user JSON data:", userData);
        if (userData.name || userData.userName || userData.username) {
          foundUserName = userData.name || userData.userName || userData.username;
        }
      }
    } catch (error) {
      console.log("Error parsing user JSON:", error);
    }
    
    if (foundUserName) {
      const capitalizedName = foundUserName.charAt(0).toUpperCase() + foundUserName.slice(1);
      console.log(`Setting username to: ${capitalizedName}`);
      setUserName(capitalizedName);
    } else {
      console.log("No username found in localStorage, using default 'User'");
    }
  }, []);
  
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
      {/* Left Section: Profile */}
      <div className="navbar-left">
        <div className="profile-container">
          <span className="profile-name" style={{ display: 'inline-block', visibility: 'visible' }}>
            Hello, {userName || 'User'}
          </span>
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
    </nav>
  );
};

export default NavBar;