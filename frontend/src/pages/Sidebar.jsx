import React from 'react';
import { useNavigate } from 'react-router-dom';
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
      <a href="/RegistraDashboard" className="menu-item">
        Registrar Dashboard
        <svg viewBox="0 0 24 24" className="arrow-icon">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
      </a>

      {/* Issue Management Link */}
      <a href="/IssueManagement" className="menu-item">
        Issue Management
        <svg viewBox="0 0 24 24" className="arrow-icon">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
      </a>

      {/* Registrar Profile Link */}
      <a href="/Registraprofile" className="menu-item">
        Registrar Profile
        <svg viewBox="0 0 24 24" className="arrow-icon">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
      </a>

      {/* Settings Link */}
      <a href="/settings" className="menu-item">
        Settings
        <svg viewBox="0 0 24 24" className="arrow-icon">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
      </a>

      {/* Help and Support Link */}
      <a href="/help" className="menu-item">
        Help and Support
        <svg viewBox="0 0 24 24" className="arrow-icon">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
      </a>

      {/* Generate Token Link */}
      <a href="/GenerateToken" className="menu-item">
        Generate Token
        <svg viewBox="0 0 24 24" className="arrow-icon">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
      </a>

      {/* Logout Link */}
      <a href="/logout" className="menu-item delete-account" onClick={handleLogout}>
        Logout
        <svg viewBox="0 0 24 24" className="arrow-icon">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
      </a>
    </div>
  );
}

export default Sidebar;