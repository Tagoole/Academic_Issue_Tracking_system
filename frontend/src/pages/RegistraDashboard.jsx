import React from 'react';
import NavBar from './NavBar';
import SideBar from './SideBar';
import './RegistraDashboard.css';

const RegistraDashboard = () => {
  const issueStats = [
    { label: 'Total issues', value: 0 },
    { label: 'Pending issues', value: 0 },
    { label: 'In-progress issues', value: 0 },
    { label: 'Resolved issues', value: 1 }
  ];

  const issueData = [
    {
      id: 1,
      status: 'Resolved',
      studentNo: '25/I/0000/PS',
      category: 'Missing Mark',
      date: '01/01/2025'
    }
  ];

  return (
    <div className="dashboard-container">
      <NavBar />
      <div className="main-content">
        <SideBar />
        <div className="dashboard-content">
          <div className="issue-stats-grid">
            {issueStats.map((stat, index) => (
              <div key={index} className="stat-card">
                <h3>{stat.label}</h3>
                <p>You currently have {stat.value} {stat.label.toLowerCase()}</p>
                <span className="stat-value">{stat.value}</span>
              </div>
            ))}
          </div>
          
          <div className="issues-table-section">
            <div className="issues-header">
              <h2>My Issues</h2>
              <div className="search-filter-container">
                <input 
                  type="text" 
                  placeholder="Search for issues" 
                  className="issues-search-input"
                />
                <button className="filter-button">Filter</button>
              </div>
            </div>
            
            <table className="issues-table">
              <thead>
                <tr>
                  <th>Issue ID</th>
                  <th>Status</th>
                  <th>Student No</th>
                  <th>Category</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {issueData.map((issue) => (
                  <tr key={issue.id}>
                    <td>{issue.id}</td>
                    <td>{issue.status}</td>
                    <td>{issue.studentNo}</td>
                    <td>{issue.category}</td>
                    <td>{issue.date}</td>
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

export default RegistraDashboard;