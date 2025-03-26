import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import HorizontalSidebar from './HorizontalSideBar';
import filtericon from '../assets/filter.png';
import searchbar from '../assets/searchbar.png';
import './Issues.css';

const Issues = () => {
  const [activeTab, setActiveTab] = useState('Pending');
  const [issues, setIssues] = useState([
    { id: 1, issue: 'Wrong Marks', status: 'Pending', category: 'Marks', date: '07th/10/2025' },
    { id: 2, issue: 'Wrong Marks', status: 'Pending', category: 'Marks', date: '07th/10/2025' },
    { id: 3, issue: 'missed test', status: 'Pending', category: 'Marks', date: '07th/10/2025' },
    { id: 4, issue: 'Wrong Marks', status: 'Pending', category: 'Marks', date: '07th/10/2025' },
    { id: 5, issue: 'Wrong Marks', status: 'Pending', category: 'Marks', date: '07th/10/2025' },
    { id: 6, issue: 'Wrong Marks', status: 'Pending', category: 'Marks', date: '07th/10/2025' },
    { id: 7, issue: 'Wrong Marks', status: 'Pending', category: 'Marks', date: '07th/10/2025' },
    { id: 8, issue: 'Wrong Marks', status: 'Pending', category: 'Marks', date: '07th/10/2025' },
  ]);

  const navigate = useNavigate();

  const tabs = ['Pending', 'In-progress', 'Resolved'];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleNewIssueClick = () => {
    navigate('/new-issue');
  };

  const handleViewDetailsClick = (issueId) => {
    navigate(`/issue/${issueId}`);
  };

  return (
    <div className="create-issue-page">
      <NavBar />
      <HorizontalSidebar />
      <div className="issues-container">
        <div className="issues-header">
          <h1>Issues</h1>
          <button className="new-issue-btn" onClick={handleNewIssueClick}>
            <span className="plus-icon">+</span> New Issue
          </button>
        </div>
        
        <div className="tab-container">
          {tabs.map(tab => (
            <button 
              key={tab} 
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="my-issues-section">
          <h2>My Issues</h2>
          <div className="search-filter">
            <div className="search-container">
              <input type="text" placeholder="Search for issues..." />
              <img src={searchbar} alt="Search Icon" className="search-icon" />
            </div>
            <button className="filter-btn">
              <img src={filtericon} alt="Filter Icon" className="filter-icon" /> Filter
            </button>
          </div>
          
          <div className="issues-table">
            <table>
              <thead>
                <tr>
                  <th>ISSUE</th>
                  <th>STATUS</th>
                  <th>CATEGORY</th>
                  <th>DATE</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {issues.map(issue => (
                  <tr key={issue.id}>
                    <td>{issue.issue}</td>
                    <td>{issue.status}</td>
                    <td>{issue.category}</td>
                    <td>{issue.date}</td>
                    <td className="action-cell">
                      <div className="action-buttons">
                        <button className="view-btn" onClick={() => handleViewDetailsClick(issue.id)}>
                          <span className="eye-icon">👁</span> View details
                        </button>
                        <button className="more-btn">⋮</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Issues;