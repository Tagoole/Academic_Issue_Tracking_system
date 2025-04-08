import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar1.css';
import dashboardIcon from "../assets/dash.png";
import issueIcon from "../assets/issue.png";
import profileIcon from "../assets/profile.png";
import settingsIcon from "../assets/settings.png";
import logoutIcon from "../assets/logout.png";
import helpIcon from "../assets/help.png";

const Sidebar1 = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Clear all tokens from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    
    // Clear session storage as well
    sessionStorage.clear();
    
    // Replace current history entry with the landing page
    // This prevents going back to the dashboard with the back button
    navigate('/', { replace: true });
    
    // For extra security, reload the page to clear any in-memory state
    window.location.reload();
  };

  return (
    <div className="sidebar">
      <div className="sidebar-menu">
        {/* Student Dashboard Link */}
        <Link to="/dashboard" className="sidebar-item">
          <img src={dashboardIcon} alt="Dashboard" className="sidebar-icon" />
          <span>StudentDashboard</span>
        </Link>
        
        {/* Issues Link */}
        <Link to="/issues" className="sidebar-item">
          <img src={issueIcon} alt="Issues" className="sidebar-icon" />
          <span>Issues</span>
        </Link>
        
        {/* Profile Link */}
        <Link to="/profile" className="sidebar-item">
          <img src={profileIcon} alt="Profile" className="sidebar-icon" />
          <span>Studentprofile</span>
        </Link>
        
        {/* Settings Link */}
        <Link to="/settings" className="sidebar-item">
          <img src={settingsIcon} alt="Settings" className="sidebar-icon" />
          <span>Settings</span>
        </Link>
        
        {/* Help and Support Link */}
        <Link to="/help" className="sidebar-item">
          <img src={helpIcon} alt="Help" className="sidebar-icon" />
          <span>Help and Support</span>
        </Link>
        
        {/* Logout Button */}
        <button onClick={handleLogout} className="sidebar-item logout-btn">
          <img src={logoutIcon} alt="Logout" className="sidebar-icon" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar1;