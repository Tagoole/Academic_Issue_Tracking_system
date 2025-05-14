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
    // Check for username in localStorage
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      const capitalizedName = storedUserName.charAt(0).toUpperCase() + storedUserName.slice(1);
      setUserName(capitalizedName);
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
      {/* Left Section: Username greeting */}
      <div className="username-greeting">
        <span>Hello, {userName}</span>
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
      
      {/* Icons Section: After Search */}
      <div className="icon-section">
        <div className="icon-container" onClick={handleNotificationClick}>
          <img src={notificationIcon} alt="Notifications" className="icon" />
        </div>
        <div className="icon-container" onClick={handleMailClick}>
          <img src={messageIcon} alt="Messages" className="icon" />
        </div>
      </div>
      
      {/* Right Section: Title and Logo */}
      <div className="navbar-right">
        <div className="app-title">Academic Issue Tracking System</div>
        <img src={logo} alt="Logo" className="logo-image" />
      </div>
    </nav>
  );
};

export default NavBar;