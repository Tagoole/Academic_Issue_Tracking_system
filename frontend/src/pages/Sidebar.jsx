import React from 'react';
import './Sidebar.css';
import dashboardIcon from "../assets/dash.png";
import issueIcon from "../assets/issue.png";
import profileIcon from "../assets/profile.png";
import settingsIcon from "../assets/settings.png";
import logoutIcon from "../assets/logout.png";
import helpIcon from "../assets/help.png";

const Sidebar = () => {
  const handleNavigation = (path) => {
    window.location.href = path;
  };

  return (
    <div className="sidebar">
      {/* Registra Dashboard Link */}
      <div className="sidebar-item">
        <div className="sidebar-link" onClick={() => handleNavigation('/RegistraDashboard')}>
          <img src={dashboardIcon} alt="Dashboard Icon" className="sidebar-icon" />
          <span>RegistraDashboard</span>
        </div>
      </div>

      {/* Issues Link */}
      <div className="sidebar-item">
        <div className="sidebar-link" onClick={() => handleNavigation('/IssueManagement')}>
          <img src={issueIcon} alt="Issue Icon" className="sidebar-icon" />
          <span>IssueManagement</span>
        </div>
      </div>

      {/* Profile Link */}
      <div className="sidebar-item">
        <div className="sidebar-link" onClick={() => handleNavigation('/Registraprofile')}>
          <img src={profileIcon} alt="Profile Icon" className="sidebar-icon" />
          <span>Registraprofile</span>
        </div>
      </div>

      {/* Settings Link */}
      <div className="sidebar-item">
        <div className="sidebar-link" onClick={() => handleNavigation('/settings')}>
          <img src={settingsIcon} alt="Settings Icon" className="sidebar-icon" />
          <span>Settings</span>
        </div>
      </div>

      {/* Help and Support Link */}
      <div className="sidebar-item">
        <div className="sidebar-link" onClick={() => handleNavigation('/help')}>
          <img src={helpIcon} alt="Help Icon" className="sidebar-icon" />
          <span>Help and Support</span>
        </div>
      </div>

      {/* Logout Link */}
      <div className="sidebar-item logout">
        <div className="sidebar-link" onClick={() => handleNavigation('/logout')}>
          <img src={logoutIcon} alt="Logout Icon" className="sidebar-icon" />
          <span>Log Out</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;