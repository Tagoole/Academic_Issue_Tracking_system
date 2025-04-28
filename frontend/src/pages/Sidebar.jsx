import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Sidebar.css';
import makerereLogo from '../assets/makererelogo.png';

function Sidebar() {
  const navigate = useNavigate();
  
  // Function to handle logout
  const handleLogout = (e) => {
    e.preventDefault(); // Prevent default link behavior
    // Clear all items from localStorage
    localStorage.clear();
    console.log('All localStorage items cleared for logout');
    // Navigate to home/login page
    navigate('/');
  };

  return (
    <div className="sidebar-container">
      <div className="university-logo-sidebar">
        <img src={makerereLogo} alt="University Logo" className="logo-sidebar" />
      </div>
      
      {/* Registrar Dashboard Link */}
      <Link to="/RegistraDashboard" className="menu-item">
        Registrar Dashboard
        <svg viewBox="0 0 24 24" className="arrow-icon">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
      </Link>
      
      {/* Issue Management Link */}
      <Link to="/IssueManagement" className="menu-item">
        Issue Management
        <svg viewBox="0 0 24 24" className="arrow-icon">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
      </Link>
      
      {/* Registrar Profile Link */}
      <Link to="/Registraprofile" className="menu-item">
        Registrar Profile
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
      
      {/* Generate Token Link */}
      <Link to="/GenerateToken" className="menu-item">
        Generate Token
        <svg viewBox="0 0 24 24" className="arrow-icon">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
      </Link>
      
      {/* Spacer to push logout to bottom */}
      <div className="sidebar-spacer"></div>
      
      {/* Logout button - styled as a button for better visibility */}
      <button className="logout-button" onClick={handleLogout}>
        <svg viewBox="0 0 24 24" className="logout-icon">
          <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
        </svg>
        Logout
      </button>
    </div>
  );
}

export default Sidebar;
