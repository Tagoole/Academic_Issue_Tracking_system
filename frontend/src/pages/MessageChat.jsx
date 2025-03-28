import React from 'react';
import profilePic from '../assets/profile.png';
import settingsIcon from '../assets/settings.png';
import makerereLogo from '../assets/makererelogo.png';
import issueIcon from '../assets/issue.png';
import dashboardIcon from '../assets/dashboard.png';
import './MessageChat.css';

const MessageChat = () => {
  return (
    <div className="container">
      <header className="header">
        <div className="header-left">
          <div className="user-avatar">
            <img src={profilePic} alt="User avatar" />
          </div>
          <div className="user-name">[First Name]</div>
          <div className="search-container">
            <input type="text" placeholder="Search for anything..." className="search-input" />
            <button className="search-button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        <div className="header-right">
          <div className="notification-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C10.8954 22 10 21.1046 10 20H14C14 21.1046 13.1046 22 12 22Z" fill="white"/>
              <path d="M18 10C18 13 20 14 20 15C20 16 16 16 12 16C8 16 4 16 4 15C4 14 6 13 6 10C6 7.23858 8.23858 5 11 5C13.7614 5 16 7.23858 16 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="system-title">Academic Issue Tracking System</div>
          <div className="logo">
            <img src={makerereLogo} alt="System logo" />
          </div>
        </div>
      </header>

      <nav className="navigation">
        <div className="nav-item active">
          <img src={dashboardIcon} alt="Dashboard" className="nav-icon" />
          <span>Dashboard</span>
        </div>
        <div className="nav-item">
          <img src={issueIcon} alt="Issues" className="nav-icon" />
          <span>Issues</span>
        </div>
        <div className="nav-item">
          <img src={profilePic} alt="Profile" className="nav-icon" />
          <span>Profile</span>
        </div>
        <div className="nav-item">
          <img src={settingsIcon} alt="Settings" className="nav-icon" />
          <span>Settings</span>
        </div>
        <div className="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Help & support</span>
        </div>
        <div className="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15M10 17L15 12M15 12L10 7M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Logout</span>
        </div>
      </nav>

      <main className="main-content">
        <div className="content-header">
          <div className="back-button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2>Messages</h2>
        </div>
        <div className="content-body">
          <div className="messages-sidebar">
            <div className="search-box">
              <input type="text" placeholder="Search something here..." className="search-input" />
            </div>
            <div className="contacts-list">
              {['Rinah N', 'Ssentumbwe J', 'Mark Musisi', 'Dennu Jennifer', 
                'Larrie Adrine', 'Idhe Suhaila', 'Nathan A', 'Ampumuzza', 'Igonga R'].map((name, index) => (
                <div key={index} className="contact-item">
                  <div className="avatar">
                    <img src={profilePic} alt="Contact avatar" />
                  </div>
                  <span className="contact-name">{name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="chat-area">
            <div className="chat-header">Chat Area</div>
            <div className="chat-content">
              <div className="no-chat-selected">
                <p>Select a chat for it to appear here by clicking on it</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MessageChat;