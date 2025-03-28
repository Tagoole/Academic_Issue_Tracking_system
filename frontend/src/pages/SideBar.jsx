import React from 'react';
import './Sidebar.css';
import dashboardIcon from "../assets/dashboard.png";
import issueIcon from "../assets/issue.png";
import profileIcon from "../assets/profile.png";
import settingsIcon from "../assets/settings.png"
import logoutIcon from "../assets/logout.png";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-item">
        <img src={dashboardIcon} alt="Dashboard Icon" className="sidebar-icon" />
        <span>Dashboard</span>
      </div>
      <div className="sidebar-item">
        <img src={issueIcon} alt="Issue Management Icon" className="sidebar-icon" />
        <span>Issue Management</span>
      </div>
      <div className="sidebar-item">
        <img src={profileIcon} alt="Profile Icon" className="sidebar-icon" />
        <span>Profile</span>
      </div>
      <div className="sidebar-item">
        <img src={settingsIcon} alt="Settings Icon" className="sidebar-icon" />
        <span>Settings</span>
      </div>
      <div className="sidebar-item">
        
        <span>Help and Support</span>
      </div>
      <div className="sidebar-item logout">
        <img src={logoutIcon} alt="Logout Icon" className="sidebar-icon" />
        <span>Log Out</span>
      </div>
    </div>
  );
};

export default Sidebar;