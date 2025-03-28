import React, { useState } from 'react';
import NavBar from './NavBar';
import HorizontalSideBar from './HorizontalSideBar';
import './IssueMgt.css';
import makerereLogo from '../assets/makererelogo.png'; // Imported unused asset

const IssueMgt = () => {
  const [activeTab, setActiveTab] = useState('Pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [issues, setIssues] = useState([
    {
      id: 1,
      studentName: 'Ssemuka Yasin',
      category: 'Missing Marks',
      submissionDate: '15/09/2025',
      status: 'Pending'
    }
  ]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleViewDetails = (issueId) => {
    console.log(`Viewing details for issue ${issueId}`);
    // Navigate to issue details page
  };

  const handleNewIssue = () => {
    console.log('Creating new issue');
    // Navigate to new issue form
  };

  // Filter issues based on active tab and search query
  const filteredIssues = issues.filter(issue => 
    issue.status === activeTab && 
    (searchQuery === '' || issue.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="issue-management-page">
      <NavBar />
      <HorizontalSideBar />
      <main className="content">
        <div className="issues-container">
          {/* Makerere Logo Section */}
          <div className="logo-section">
            <img src={makerereLogo} alt="Makerere Logo" className="makerere-logo" />
          </div>

          {/* Status Tabs */}
          <div className="status-tabs">
            {['Pending', 'In-progress', 'Resolved'].map(tab => (
              <div 
                key={tab}
                className={`tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </div>
            ))}
          </div>
          
          {/* Search and Filter Section */}
          <div className="search-filter">
            <div className="issue-search">
              <input 
                type="text" 
                placeholder="Search for issues..." 
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <button className="filter-button">
              <i className="filter-icon">⊳</i>
              Filter
            </button>
            <button className="new-issue-button" onClick={handleNewIssue}>
              <i className="new-issue-icon">+</i>
              New Issue
            </button>
          </div>
          
          {/* Issues Table */}
          <div className="issues-table-container">
            <table className="issues-table">
              <thead>
                <tr>
                  <th>ISSUE ID</th>
                  <th>STUDENT NAME</th>
                  <th>CATEGORY</th>
                  <th>SUBMISSION DATE</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.map(issue => (
                  <tr key={issue.id} className="issue-row">
                    <td>{issue.id}</td>
                    <td>{issue.studentName}</td>
                    <td>{issue.category}</td>
                    <td>{issue.submissionDate}</td>
                    <td>
                      <span className={`status-badge ${issue.status.toLowerCase().replace(' ', '-')}`}>
                        {issue.status}
                      </span>
                    </td>
                    <td className="issue-actions">
                      <div className="dropdown">
                        <button className="dropdown-toggle">⋮</button>
                        <div className="dropdown-menu">
                          <button 
                            className="view-details-btn"
                            onClick={() => handleViewDetails(issue.id)}
                          >
                            <i className="view-details-icon">👁</i>
                            View Details
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IssueMgt;