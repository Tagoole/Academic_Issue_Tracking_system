import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import NavBar from './NavBar';
import SideBar from './Sidebar1';
import './Issues.css';
import backgroundimage from '../assets/pexels-olia-danilevich-5088017.jpg'; 

const Issues = () => {
  const [activeTab, setActiveTab] = useState('Pending');
  const [issues, setIssues] = useState([
    { id: 1, issue: 'Wrong Marks', status: 'Pending', category: 'Marks', date: '07th/10/2025' },
    { id: 2, issue: 'Missed test', status: 'Pending', category: 'Marks', date: '07th/10/2025' },
  ]);

  const tabs = ['Pending', 'In-progress', 'Resolved'];
  const navigate = useNavigate(); 

  const handleNewIssueClick = () => {
    navigate('/new-issue'); 
  };

  const handleViewDetailsClick = (issueId) => {
    navigate(`/view-details/${issueId}`); 
  };

  return (
    <div
      className="issues-container"
      style={{
        backgroundImage: 'url(${backgroundimage})', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '1000px',
      }}
    >
      <SideBar />
      <div className="dashboard-content">
        <NavBar />
        <div className="issues-panel">
          <h1 className="issues-title">Issues</h1>
          
          <div className="issues-tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`issues-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
            <button className="new-issue-btn" onClick={handleNewIssueClick}>
              + New Issue
            </button>
          </div>

          <div className="search-filter-container">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search"
                className="search-input"
                style={{ color: 'black' }}
              />
            </div>
            <button className="filter-btn">
              Filter
            </button>
          </div>

          <table className="issues-table">
            <thead>
              <tr>
                <th>Issue</th>
                <th>Status</th>
                <th>Category</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue.id}>
                  <td>{issue.issue}</td>
                  <td>
                    <span className="status-pill status-pending">
                      {issue.status}
                    </span>
                  </td>
                  <td>{issue.category}</td>
                  <td>{issue.date}</td>
                  <td>
                    <button
                      className="view-details-btn"
                      onClick={() => handleViewDetailsClick}
                    >
                      View details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Issues;