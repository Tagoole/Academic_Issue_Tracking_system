import React from 'react';
import { Link } from 'react-router-dom'; 
import './Sidebar1.css';
import dashboardIcon from "../assets/dash.png";
import issueIcon from "../assets/issue.png";
import profileIcon from "../assets/profile.png";
import settingsIcon from "../assets/settings.png";
import logoutIcon from "../assets/logout.png";
import helpIcon from "../assets/help.png";

const Sidebar1 = () => {
  return (
    <div className="sidebar">
      {/* Registra Dashboard Link */}
      <div className="sidebar-item">
        <Link to="/StudentDashboard" className="sidebar-link">
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

      {/* Logout Link */}
      <div className="sidebar-item logout">
        <Link to="/logout" className="sidebar-link">
          <img src={logoutIcon} alt="Logout Icon" className="sidebar-icon" />
          <span>Log Out</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar1;