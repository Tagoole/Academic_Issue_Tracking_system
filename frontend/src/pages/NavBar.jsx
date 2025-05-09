import React, { useState, useEffect } from 'react';
import './NavBar.css';
import logo from '../assets/makererelogo.png';
import notificationIcon from '../assets/notification.png';
import messageIcon from '../assets/mail.png';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch username from localStorage when component mounts
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      const capitalizedName = storedUserName.charAt(0).toUpperCase() + storedUserName.slice(1);
      setUserName(capitalizedName);
    } else {
      setUserName('User'); // Fallback value if userName is not found
    }
  }, []);

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
          <span className="profile-name">Hello, {userName}</span>
        </div>
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