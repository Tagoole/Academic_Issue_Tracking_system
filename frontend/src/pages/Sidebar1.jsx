import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for client-side navigation
import './Sidebar1.css';
import makerereLogo from '../assets/makererelogo.png'; // Correct import

function Sidebar1() {
  return (
    <div className="sidebar-container">
      <div className="university-logo-sidebar">
        {/* Use the correct logo import */}
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

      {/* Logout Link */}
      <Link to="/" className="menu-item delete-account">
        Logout
        <svg viewBox="0 0 24 24" className="arrow-icon">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
      </Link>
    </div>
  );
}

export default Sidebar1;