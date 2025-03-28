import React, { useState } from 'react';
import NavBar from './NavBar';
import HorizontalSideBar from './HorizontalSideBar';
import './Issues.css';

const Issues = () => {
  const [activeTab, setActiveTab] = useState('Pending');
  const [issues, setIssues] = useState([
    { id: 1, issue: 'Wrong Marks', status: 'Pending', category: 'Marks', date: '07th/10/2025' },
    { id: 2, issue: 'Missed test', status: 'Pending', category: 'Marks', date: '07th/10/2025' },
  ]);

  const tabs = ['Pending', 'In-progress', 'Resolved'];

  return (
    <div className="issues-container">
      <HorizontalSideBar />
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
            <button className="new-issue-btn">
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
                    <button className="view-details-btn">View details</button>
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