import React, { useState } from 'react';
import profilePic from '../assets/profile.png';
import settingsIcon from '../assets/settings.png';
import makerereLogo from '../assets/makerere.logo.png';
import issueIcon from '../assets/issue.png';
import dashboardIcon from '../assets/dashboard.png';
import './Notification.css';

const Notification = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [activeIssueTab, setActiveIssueTab] = useState('Pending');
  const [selectedIssue, setSelectedIssue] = useState(null);

  const issues = [
    { id: 1, title: 'Wrong Marks', status: 'Pending', category: 'Marks', date: '07th/10/2025' },
    { id: 2, title: 'Wrong Marks', status: 'Pending', category: 'Marks', date: '07th/10/2025' },
    { id: 3, title: 'missed test', status: 'Pending', category: 'Marks', date: '07th/10/2025' },
    { id: 4, title: 'Wrong Marks', status: 'Pending', category: 'Marks', date: '07th/10/2025' },
    { id: 5, title: 'Wrong Marks', status: 'Pending', category: 'Marks', date: '07th/10/2025' },
    { id: 6, title: 'Wrong Marks', status: 'Pending', category: 'Marks', date: '07th/10/2025' },
    { id: 7, title: 'Wrong Marks', status: 'Pending', category: 'Marks', date: '07th/10/2025' },
    { id: 8, title: 'Wrong Marks', status: 'Pending', category: 'Marks', date: '07th/10/2025' },
    { id: 9, title: 'Wrong Marks', status: 'Pending', category: 'Marks', date: '13th/02/2025' },
    { id: 10, title: 'Wrong Marks', status: 'Pending', category: 'Marks', date: '13th/02/2025' },
  ];

  const viewDetails = (issue) => {
    setSelectedIssue(issue);
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="user-profile">
          <img src={profilePic} alt="Profile" className="profile-image" />
          <span className="user-name">[First Name]</span>
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Search for anything..." />
          <button className="search-button">
            <i className="search-icon">🔍</i>
          </button>
        </div>
        <div className="system-title">
          Academic Issue Tracking System
          <img src={makerereLogo} alt="Logo" className="logo" />
        </div>
      </header>

      <nav className="horizontal-navigation">
        <button 
          className={`nav-button ${activeTab === 'Dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('Dashboard')}
        >
          <img src={dashboardIcon} alt="Dashboard" className="nav-icon" /> Dashboard
        </button>
        <button 
          className={`nav-button ${activeTab === 'Issues' ? 'active' : ''}`}
          onClick={() => setActiveTab('Issues')}
        >
          <img src={issueIcon} alt="Issues" className="nav-icon" /> Issues
        </button>
        <button 
          className={`nav-button ${activeTab === 'Profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('Profile')}
        >
          <img src={profilePic} alt="Profile" className="nav-icon" /> Profile
        </button>
        <button 
          className={`nav-button ${activeTab === 'Settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('Settings')}
        >
          <img src={settingsIcon} alt="Settings" className="nav-icon" /> Settings
        </button>
        <button 
          className={`nav-button ${activeTab === 'Help' ? 'active' : ''}`}
          onClick={() => setActiveTab('Help')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg> Help & support
        </button>
        <button 
          className={`nav-button ${activeTab === 'Logout' ? 'active' : ''}`}
          onClick={() => setActiveTab('Logout')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15M10 17L15 12M15 12L10 7M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg> Logout
        </button>
      </nav>

      <main className="main-content">
        <h1 className="page-title">Dashboard</h1>

        <div className="dashboard-container">
          <div className="stats-section">
            <div className="stats-card">
              <h2>Resolved Issues</h2>
              <div className="stats-number">2</div>
              <p className="stats-detail">You have 0 resolved issues</p>
            </div>

            <div className="stats-card">
              <h2>Pending Issues</h2>
              <div className="stats-number">5</div>
              <p className="stats-detail">You have 0 pending issues</p>
            </div>

            <div className="stats-card">
              <h2>In-progress Issues</h2>
              <div className="stats-number">1</div>
              <p className="stats-detail">You have 0 in-progress issues</p>
            </div>
          </div>

          <div className="issues-section">
            <div className="issues-header">
              <h2>Issues</h2>
              <button className="new-issue-button">
                <i className="plus-icon">+</i> New Issue
              </button>
            </div>

            <div className="issues-tabs">
              <button 
                className={`tab ${activeIssueTab === 'Pending' ? 'active' : ''}`}
                onClick={() => setActiveIssueTab('Pending')}
              >
                Pending
              </button>
              <button 
                className={`tab ${activeIssueTab === 'In-progress' ? 'active' : ''}`}
                onClick={() => setActiveIssueTab('In-progress')}
              >
                In-progress
              </button>
              <button 
                className={`tab ${activeIssueTab === 'Resolved' ? 'active' : ''}`}
                onClick={() => setActiveIssueTab('Resolved')}
              >
                Resolved
              </button>
            </div>

            <div className="issues-filter">
              <h3>My Issues</h3>
              <div className="filter-controls">
                <div className="search-input">
                  <input type="text" placeholder="Search for issues..." />
                  <button className="search-button">
                    <i className="search-icon">🔍</i>
                  </button>
                </div>
                <button className="filter-button">
                  <i className="filter-icon">⚙</i> Filter
                </button>
              </div>
            </div>

            <div className="issues-table">
              <div className="table-header">
                <div className="header-cell">ISSUE</div>
                <div className="header-cell">STATUS</div>
                <div className="header-cell">CATEGORY</div>
                <div className="header-cell">DATE</div>
                <div className="header-cell"></div>
              </div>

              {issues.map((issue, index) => (
                <div className="table-row" key={issue.id}>
                  <div className="cell">{issue.title}</div>
                  <div className="cell">{issue.status}</div>
                  <div className="cell">{issue.category}</div>
                  <div className="cell">{issue.date}</div>
                  <div className="cell actions">
                    {index === 1 && (
                      <button className="view-details-button" onClick={() => viewDetails(issue)}>
                        <i className="eye-icon">👁</i> View details
                      </button>
                    )}
                    <button className="options-button">⋮</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Notification;