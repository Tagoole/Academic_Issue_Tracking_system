import React from 'react';
import profilePic from '../assets/profile.png';
import settingsIcon from '../assets/settings.png';
import makerereLogo from '../assets/makerere.logo.png';
import issueIcon from '../assets/issue.png';
import dashboardIcon from '../assets/dashboard.png';
import './Newchat.css';

const Newchat = () => {
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
          <div className="system-title">
            Academic Issue Tracking System
            <img src={makerereLogo} alt="System logo" className="system-logo" />
          </div>
        </div>
      </header>

      <nav className="horizontal-navigation">
        <div className="nav-item">
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
            <div className="sidebar-search">
              <input type="text" placeholder="Search something here..." />
            </div>
            <div className="contacts-list">
              <div className="contact-item">
                <img src={profilePic} alt="Rinah N" className="contact-avatar" />
                <span className="contact-name">Rinah N</span>
              </div>
              <div className="contact-item">
                <img src={profilePic} alt="Ssentumbwe J" className="contact-avatar" />
                <span className="contact-name">Ssentumbwe J</span>
              </div>
              <div className="contact-item">
                <img src={profilePic} alt="Mark Musisi" className="contact-avatar" />
                <span className="contact-name">Mark Musisi</span>
              </div>
              <div className="contact-item active">
                <img src={profilePic} alt="Dennu Jennifer" className="contact-avatar" />
                <span className="contact-name">Dennu Jennifer</span>
              </div>
              <div className="contact-item">
                <img src={profilePic} alt="Larrie Adrine" className="contact-avatar" />
                <span className="contact-name">Larrie Adrine</span>
              </div>
              <div className="contact-item">
                <img src={profilePic} alt="Idhe Suhaila" className="contact-avatar" />
                <span className="contact-name">Idhe Suhaila</span>
              </div>
              <div className="contact-item">
                <img src={profilePic} alt="Nathan A" className="contact-avatar" />
                <span className="contact-name">Nathan A</span>
              </div>
              <div className="contact-item">
                <img src={profilePic} alt="Ampumuzza" className="contact-avatar" />
                <span className="contact-name">Ampumuzza</span>
              </div>
              <div className="contact-item">
                <img src={profilePic} alt="Igonga R" className="contact-avatar" />
                <span className="contact-name">Igonga R</span>
              </div>
            </div>
          </div>
          <div className="chat-area">
            <div className="chat-header">
              <img src={profilePic} alt="Dennu Jennifer" className="chat-header-avatar" />
              <span className="chat-header-name">Dennu Jennifer</span>
            </div>
            <div className="chat-content">
              {/* Chat messages would go here */}
            </div>
            <div className="chat-input-container">
              <input type="text" placeholder="Type here..." className="chat-input" />
              <button className="attachment-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59723 21.9983 8.005 21.9983C6.41277 21.9983 4.88584 21.3658 3.76 20.24C2.63416 19.1142 2.00166 17.5872 2.00166 15.995C2.00166 14.4028 2.63416 12.8758 3.76 11.75L12.33 3.17997C13.0806 2.42808 14.0991 2.00515 15.16 2.00515C16.2209 2.00515 17.2394 2.42808 17.99 3.17997C18.7419 3.93062 19.1648 4.94916 19.1648 5.99997C19.1648 7.05079 18.7419 8.06933 17.99 8.81997L9.41 17.41C9.03472 17.7853 8.52573 17.9961 7.995 17.9961C7.46427 17.9961 6.95528 17.7853 6.58 17.41C6.20472 17.0347 5.99389 16.5257 5.99389 15.995C5.99389 15.4643 6.20472 14.9553 6.58 14.58L13.07 8.09998" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="send-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Newchat;