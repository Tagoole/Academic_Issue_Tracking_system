import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import NavBar from './NavBar';
import SideBar from './Sidebar1';
import './StudentDashboard.css'; 
import backgroundimage from '../assets/pexels-olia-danilevich-5088017.jpg'; 

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('Pending');
  const navigate = useNavigate(); 

  const issueData = [
    { issue: 'Wrong Marks', status: 'Pending', category: 'Marks', date: '07/10/2025' },
    { issue: 'Missing test', status: 'Pending', category: 'Marks', date: '07/10/2025' },
    { issue: 'Wrong Marks', status: 'In-progress', category: 'Marks', date: '13/02/2025' },
    { issue: 'Wrong Marks', status: 'Resolved', category: 'Marks', date: '07/10/2025' },
  ];

  const filteredIssues = issueData.filter(issue => 
    activeTab === 'Pending' ? issue.status === 'Pending' :
    activeTab === 'In-progress' ? issue.status === 'In-progress' :
    activeTab === 'Resolved' ? issue.status === 'Resolved' : true
  );

  const handleNewIssueClick = () => {
    navigate('/new-issue'); // Navigate to the new issue page
  };

  return (
    <div 
      className="dashboard-container"
      style={{
        backgroundImage: `url(${backgroundimage})`, // Use the imported background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width:'1205px'
      }}
    >
      <SideBar />
      <div className="dashboard-wrapper">
        <NavBar />
        
        {/* Dashboard Panels */}
        <div className="dashboard-panels">
          <div className="panel">
            <div className="panel-title">Resolved Issues</div>
            <div className="panel-count">{filteredIssues.filter(issue => issue.status === 'Resolved').length}</div>
          </div>
          <div className="panel">
            <div className="panel-title">Pending Issues</div>
            <div className="panel-count">{filteredIssues.filter(issue => issue.status === 'Pending').length}</div>
          </div>
          <div className="panel">
            <div className="panel-title">In-progress Issues</div>
            <div className="panel-count">{filteredIssues.filter(issue => issue.status === 'In-progress').length}</div>
          </div>
        </div>
        
        {/* Search Input */}
        <div className="search-container">
          <input type="text" placeholder="Search for issues..." className="search-input" />
          <button className="filter-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 16v-4.414L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="new-issue-button" onClick={handleNewIssueClick}>+ New Issue</button>
        </div>
        
        {/* Issues Container */}
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
          </div>
        </div>
        
        {/* Table Container */}
        <div className="table-container">
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
              {filteredIssues.map((issue, index) => (
                <tr key={index}>
                  <td>{issue.issue}</td>
                  <td>
                    <>
                      <span className={`status-tag status-${issue.status.toLowerCase().replace('-', '')}`}>
                        {issue.status}
                      </span>
                    </>
                  </td>
                  <td>{issue.category}</td>
                  <td>{issue.date}</td>
                  <td>
                    <button className="view-details-btn">View Details</button>
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

export default StudentDashboard;