import React from 'react';
import { Link } from 'react-router-dom'; 
import './Sidebar.css';
import dashboardIcon from "../assets/dashboard.png";
import issueIcon from "../assets/issue.png";
import profileIcon from "../assets/profile.png";
import settingsIcon from "../assets/settings.png";
import logoutIcon from "../assets/logout.png";
import helpIcon from "../assets/help.png"; 

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-item">
        <Link to="/registradashboard" className="sidebar-link">
          <img src={dashboardIcon} alt="Dashboard Icon" className="sidebar-icon" />
          <span>RegistraDashboard</span>
        </Link>
      </div>
      <div className="sidebar-item">
        <Link to="/issuemanagement" className="sidebar-link">
          <img src={issueIcon} alt="Issue Management Icon" className="sidebar-icon" />
          <span>Issue Management</span>
        </Link>
      </div>
      <div className="sidebar-item">
        <Link to="/profile" className="sidebar-link">
          <img src={profileIcon} alt="Profile Icon" className="sidebar-icon" />
          <span>Profile</span>
        </Link>
      </div>
      <div className="sidebar-item">
        <Link to="/settings" className="sidebar-link">
          <img src={settingsIcon} alt="Settings Icon" className="sidebar-icon" />
          <span>Settings</span>
        </Link>
      </div>
      <div className="sidebar-item">
        <Link to="/help" className="sidebar-link">
          <img src={helpIcon} alt="Help Icon" className="sidebar-icon" /> 
          <span>Help and Support</span>
        </Link>
      </div>
      <div className="sidebar-item logout">
        <Link to="/logout" className="sidebar-link">
          <img src={logoutIcon} alt="Logout Icon" className="sidebar-icon" />
          <span>Log Out</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;