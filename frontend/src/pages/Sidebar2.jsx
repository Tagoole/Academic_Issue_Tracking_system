import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Sidebar2.css';
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
      
      {/* Lecturer Dashboard Link */}
      <Link to="/Lecturerdashboard" className="menu-item">
        Lecturer Dashboard
        <svg viewBox="0 0 24 24" className="arrow-icon">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
      </Link>
      
      {/* Issue Management Link */}
      <Link to="/LecturerIssueManagement" className="menu-item">
        Issue Management
        <svg viewBox="0 0 24 24" className="arrow-icon">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
      </Link>
      
      {/* Registrar Profile Link */}
      <Link to="/Lecturerprofile" className="menu-item">
        Lecturer Profile
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
      <Link to="#" className="menu-item delete-account" onClick={handleLogout}>
        Logout
        <svg viewBox="0 0 24 24" className="arrow-icon">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
      </Link>
    </div>
  );
}

export default Sidebar;