import React from 'react';
import './Sidebar1.css';
import makerereLogo from '../assets/makererelogo.png';


function Sidebar1() {
  return (
    <div className="sidebar-container">
      <div className="university-logo-sidebar">
        <img src={studentLogo} alt="Student Logo" className="logo-sidebar" />
      </div>

      {/* Student Dashboard Link */}
      <a href="/dashboard" className="menu-item">
        Student Dashboard
        <svg viewBox="0 0 24 24" className="arrow-icon">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
      </a>

      {/* Issues Link */}
      <a href="/issues" className="menu-item">
        Issues
        <svg viewBox="0 0 24 24" className="arrow-icon">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
      </a>

      {/* Profile Link */}
      <a href="/profile" className="menu-item">
        Student Profile
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

      {/* Logout Link */}
      <a href="/logout" className="menu-item delete-account">
        Logout
        <svg viewBox="0 0 24 24" className="arrow-icon">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
      </a>
    </div>
  );
}

export default Sidebar1;