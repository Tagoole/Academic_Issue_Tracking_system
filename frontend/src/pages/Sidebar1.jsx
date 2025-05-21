// Sidebar1.jsx (Student Sidebar)
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css'; // Using consistent CSS file name
import makerereLogo from '../assets/makererelogo.png';

function Sidebar1() {
  const navigate = useNavigate();
  
  // Function to handle logout
  const handleLogout = (e) => {
    e.preventDefault();
    
    // Clear all items from localStorage
    localStorage.clear();
    
    // Log for debugging
    console.log('All localStorage items cleared for logout');
    
    // Navigate to home/login page
    navigate('/');
  };
  
  return (
    <div className="sidebar-container">
      <div className="university-logo-sidebar">
        <img src={makerereLogo} alt="Makerere University Logo" className="logo-sidebar" />
      </div>
      
      {/* Student Dashboard Link */}
      <Link to="/studentdashboard" className="menu-item">
        Student Dashboard
        <svg viewBox="0 0 24 24" className="arrow-icon">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
      </Link>
      
      {/* Issues Link */}
      <Link to="/issues" className="menu-item">
        Issues
        <svg viewBox="0 0 24 24" className="arrow-icon">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
      </Link>
      
      {/* Profile Link */}
      <Link to="/StudentsProfile" className="menu-item">
        Student Profile
        <svg viewBox="0 0 24 24" className="arrow-icon">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
      </Link>
      
      {/* Settings Link */}
      <Link to="/settings" className="menu-item">
        Settings
        <svg viewBox="0 0 24 24" className="arrow-icon">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
      </Link>
      
      {/* Help and Support Link */}
      <Link to="/help" className="menu-item">
        Help and Support
        <svg viewBox="0 0 24 24" className="arrow-icon">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
      </Link>
      
      {/* Logout Link - Using Link component consistently */}
      <Link to="/" onClick={handleLogout} className="menu-item logout-item">
        Logout
        <svg viewBox="0 0 24 24" className="arrow-icon">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
      </Link>
    </div>
  );
}

export default Sidebar1;