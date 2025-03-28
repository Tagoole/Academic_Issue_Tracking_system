import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import NavBar from './NavBar';
import HorizontalSideBar from './HorizontalSideBar';
import uploadIcon from '../assets/box.png';
import './Dashboard.css'; 
import './New-Message.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Pending');
  const navigate = useNavigate(); 

  const issueData = [
    { issue: 'Wrong Marks', status: 'Pending', category: 'Marks', date: '07/10/2025' },
    { issue: 'Missing test', status: 'Pending', category: 'Marks', date: '07/10/2025' },
    { issue: 'Wrong Marks', status: 'Pending', category: 'Marks', date: '07/10/2025' },
    { issue: 'Wrong Marks', status: 'Pending', category: 'Marks', date: '07/10/2025' },
    { issue: 'Wrong Marks', status: 'Pending', category: 'Marks', date: '07/10/2025' },
    { issue: 'Wrong Marks', status: 'In-progress', category: 'Marks', date: '13/02/2025' },
    { issue: 'Wrong Marks', status: 'Resolved', category: 'Marks', date: '07/10/2025' },
  ];

  const filteredIssues = issueData.filter(issue => 
    activeTab === 'Pending' ? issue.status === 'Pending' :
    activeTab === 'In-progress' ? issue.status === 'In-progress' :
    activeTab === 'Resolved' ? issue.status === 'Resolved' : true
  );

  const getIssueCount = (status) => {
    return issueData.filter(issue => issue.status === status).length;
  };

  const handleNewChatClick = () => {
    navigate('/new-chat'); // Navigate to the new chat page
  };

  return (
    <div className="dashboard-container">
      <NavBar />
      <div className="main-content">
        <HorizontalSideBar />
        <div className="dashboard-wrapper">
          {/* Dashboard Panels */}
          <div className="dashboard-panels">
            <div className="panel">
              <div className="panel-title">Resolved Issues</div>
              <div className="panel-count">{getIssueCount('Resolved')}</div>
              <div className="panel-subtitle">You have 0 resolved issues</div>
            </div>
            <div className="panel">
              <div className="panel-title">Pending Issues</div>
              <div className="panel-count">{getIssueCount('Pending')}</div>
              <div className="panel-subtitle">You have 0 pending issues</div>
            </div>
            <div className="panel">
              <div className="panel-title">In-progress Issues</div>
              <div className="panel-count">{getIssueCount('In-progress')}</div>
              <div className="panel-subtitle">You have 0 in-progress issues</div>
            </div>
          </div>

          {/* Issues Table */}
          <div className="issues-container">
            <div className="issues-header">
              <div className="tab-container">
                {['Pending', 'In-progress', 'Resolved'].map(tab => (
                  <button
                    key={tab}
                    className={`tab-button ${activeTab === tab ? 'active' : 'inactive'}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="search-container">
                <input 
                  type="text" 
                  placeholder="Search for issues..." 
                  className="search-input"
                />
                <button className="filter-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 16v-4.414L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="new-issue-button">
                  + New Issue
                </button>
              </div>
            </div>
            <table className="issues-table">
              <thead>
                <tr>
                  <th>ISSUE</th>
                  <th>STATUS</th>
                  <th>CATEGORY</th>
                  <th>DATE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.map((issue, index) => (
                  <tr key={index}>
                    <td>{issue.issue}</td>
                    <td>
                      <span className={`status-tag status-${issue.status.toLowerCase().replace('-', '')}`}>
                        {issue.status}
                      </span>
                    </td>
                    <td>{issue.category}</td>
                    <td>{issue.date}</td>
                    <td>
                      <a className="action-link">View details</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="messaging-container">
        <div className="messaging-content">
          <div className="messages-sidebar">
            <div className="search-container">
              <input 
                type="text" 
                placeholder="Search for anything..." 
                className="search-input" 
              />
            </div>
            <div className="start-chat-section">
              <div className="uploadicon">
                <img src={uploadIcon} alt="Upload Icon" className="upload-icon-image" />
              </div>
              <p>Click on the button below to start a new chat.</p>
              <button 
                className="new-chat-button" 
                onClick={handleNewChatClick} // Add onClick handler for navigation
              >
                New Chat
              </button>
            </div>
          </div>
          <div className="chat-area">
            <div className="chat-placeholder">
              <p>Select a chat for it to appear here by clicking on it</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;