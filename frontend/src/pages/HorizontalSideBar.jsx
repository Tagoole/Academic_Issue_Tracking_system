import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HorizontalSidebar.css'
import dashboardIcon from "../assets/dashboard.png";
import issueIcon from "../assets/issue.png";
import profileIcon from "../assets/profile.png";
import settingsIcon from "../assets/settings.png";
import supportIcon from "../assets/help-icon.png";
import logoutIcon from "../assets/logout.png";

const HorizontalSidebar = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: dashboardIcon,
      route: '/dashboard'
    },
    { 
      id: 'issues', 
      label: 'Issues', 
      icon: issueIcon,
      route: '/issues'
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: profileIcon,
      route: '/profile'
    },
    { 
      id: 'support', 
      label: 'Support', 
      icon: supportIcon,
      route: '/support'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: settingsIcon,
      route: '/settings'
    },
    { 
      id: 'logout', 
      label: 'Logout', 
      icon: logoutIcon,
      route: '/logout'
    }
  ];

  const handleNavigation = (route, id) => {
    setActiveTab(id);
    navigate(route);
  };

  return (
    <nav className="horizontal-sidebar">
      <div className="sidebar-nav-container">
        {navItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => handleNavigation(item.route, item.id)}
            className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
          >
            <img 
              src={item.icon} 
              alt={item.label} 
              className="sidebar-nav-icon"
            />
            <span className="sidebar-nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default HorizontalSidebar;