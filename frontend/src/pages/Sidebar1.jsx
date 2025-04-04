import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar1.css';
import dashboardIcon from "../assets/dashboard.png";
import issueIcon from "../assets/issue.png";
import profileIcon from "../assets/profile.png";
import settingsIcon from "../assets/settings.png";
import logoutIcon from "../assets/logout.png";
import helpIcon from "../assets/help.png";

const Sidebar1 = () => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault(); // Prevent default link behavior
    
    // Clear tokens from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear any session storage
    sessionStorage.clear();
    
    // Redirect to signin page
    navigate('/signin');
  };

  return (
    <div className="sidebar">
      {/* Registra Dashboard Link */}
      <div className="sidebar-item">
        <Link to="/StudentDasboard" className="sidebar-link">
          <img src={dashboardIcon} alt="Dash Icon" className="sidebar-icon" />
          <span>StudentDashboard</span>
        </Link>
      </div>
      
      {/* Issues Link */}
      <div className="sidebar-item">
        <Link to="/issues" className="sidebar-link">
          <img src={issueIcon} alt="Issue Icon" className="sidebar-icon" />
          <span>Issues</span>
        </Link>
      </div>
      
      {/* Profile Link */}
      <div className="sidebar-item">
        <Link to="/studentprofile" className="sidebar-link">
          <img src={profileIcon} alt="Profile Icon" className="sidebar-icon" />
          <span>Studentprofile</span>
        </Link>
      </div>
      
      {/* Settings Link */}
      <div className="sidebar-item">
        <Link to="/settings" className="sidebar-link">
          <img src={settingsIcon} alt="Settings Icon" className="sidebar-icon" />
          <span>Settings</span>
        </Link>
      </div>
      
      {/* Help and Support Link */}
      <div className="sidebar-item">
        <Link to="/help" className="sidebar-link">
          <img src={helpIcon} alt="Help Icon" className="sidebar-icon" />
          <span>Help and Support</span>
        </Link>
      </div>
      
      {/* Logout Link - Now with onClick handler */}
      <div className="sidebar-item logout">
        <a href="#" className="sidebar-link" onClick={handleLogout}>
          <img src={logoutIcon} alt="Logout Icon" className="sidebar-icon" />
          <span>Log Out</span>
        </a>
      </div>
    </div>
  );
};

export default Sidebar1;