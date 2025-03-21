import React from 'react';
import makerereLogo from '../assets/makerere.logo.png';
import profilePic from '../assets/profile.png';
import settingsIcon from '../assets/settings.png';
import issueIcon from '../assets/issue.png';
import dashboardIcon from '../assets/dashboard.png';
import './NotificationSuccess.css';

const NotificationSuccess = () => {
  return (
    <div className="app-container">
      
      
      <header className="header" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '10px 20px' }}>
        <div className="user-profile" style={{ display: 'flex', alignItems: 'center' }}>
          <img src={profilePic} alt="Profile" className="profile-image" />
          <span className="user-name" style={{ fontWeight: 'bold', marginLeft: '5px' }}>[First Name]</span>
        </div>
        
        <div className="search-bar" style={{ flex: '1', margin: '0 20px', display: 'flex' }}>
          <input type="text" placeholder="Search for anything..." style={{ flex: '1' }} />
          <button className="search-button">
            <i className="search-icon">🔍</i>
          </button>
        </div>
        
        <div className="system-info" style={{ display: 'flex', alignItems: 'center' }}>
          <div className="notification-bell" style={{ marginRight: '15px' }}>
            <i className="bell-icon">🔔</i>
          </div>
          <div className="system-title" style={{ color: '#000', fontWeight: 'bold' }}>
            Academic Issue Tracking System
            <img src={makerereLogo} alt="Logo" className="logo" style={{ marginLeft: '10px', height: '40px' }} />
          </div>
        </div>
      </header>

      <nav className="navigation" style={{ 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        padding: '10px 20px',
        backgroundColor: '#f5f5f5' 
      }}>
        <button className="nav-button active">
          <img src={dashboardIcon} alt="Dashboard" className="nav-icon" /> Dashboard
        </button>
        <button className="nav-button">
          <img src={issueIcon} alt="Issues" className="nav-icon" /> Issues
        </button>
        <button className="nav-button">
          <img src={profilePic} alt="Profile" className="nav-icon" /> Profile
        </button>
        <button className="nav-button">
          <img src={settingsIcon} alt="Settings" className="nav-icon" /> Settings
        </button>
        <button className="nav-button">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg> Help & support
        </button>
        <button className="nav-button">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15M10 17L15 12M15 12L10 7M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg> Logout
        </button>
      </nav>

      <main className="main-content" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="success-message-container" style={{ width: '100%', padding: '15px 20px' }}>
          <div className="success-message" style={{ display: 'flex', alignItems: 'center', backgroundColor: '#e8f5e9', padding: '15px', borderRadius: '5px' }}>
            <div className="message-logo">
              <img src={makerereLogo} alt="Logo" className="logo-small" style={{ width: '30px', height: 'auto' }} />
            </div>
            <div className="message-text" style={{ flex: 1, padding: '0 15px' }}>
              You have successfully submitted your issues, be patient as it is worked upon.
            </div>
            <div className="message-timestamp">13/02/2025 6:00PM</div>
          </div>
        </div>

        <div className="center-logo-container" style={{ textAlign: 'center', marginTop: '30px' }}>
          <div className="makerere-logo-large-container">
            <img src={makerereLogo} alt="University Logo" className="university-logo-large" />
            <div className="university-name">MAKERERE UNIVERSITY</div>
            <div className="system-acronym">AITS</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotificationSuccess;