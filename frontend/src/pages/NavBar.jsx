import React, { useState, useEffect } from 'react';
import './NavBar.css';
import logo from '../assets/makererelogo.png'
import { useNavigate } from 'react-router-dom';
import  MailIcon from  '../assets/mail.png'; // Adjust the path as necessary

const NavBar = () => {
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

  return (
    <nav className="navbar">
      {/* Left Section: Username greeting */}
      <div className="username-greeting">
        <span>Hello, {userName}</span>
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