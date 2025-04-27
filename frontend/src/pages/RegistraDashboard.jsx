import React from 'react';
import Navbar from './NavBar';
import Sidebar from './Sidebar'; 
import './RegistraDashboard.css';

const RegistraDashboard = () => {
  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="dashboard-content">
          <div className="issue-stats-container">
            <div className="issue-stat-card total">
              <h3>Total issues</h3>
              <p className="count">0</p>
              <p className="description">You currently have 0 issues</p>
            </div>
            
            <div className="issue-stat-card pending">
              <h3>Pending issues</h3>
              <p className="count">0</p>
              <p className="description">You currently have 0 pending</p>
            </div>
            
            <div className="issue-stat-card in-progress">
              <h3>In-progress issues</h3>
              <p className="count">0</p>
              <p className="description">You currently have 0 in-progress issues</p>
            </div>
            
            <div className="issue-stat-card resolved">
              <h3>Resolved issues</h3>
              <p className="count">1</p>
              <p className="description">You currently have 1 resolved issue</p>
            </div>
          </div>
          
          <div className="issues-table-container">
            <div className="table-header">
              <h3>My Issues</h3>
              <div className="table-actions">
                <div className="search-box">
                  <input type="text" placeholder="Search for issues" />
                  <button className="search-button">🔍</button>
                </div>
                <button className="filter-button">Filter</button>
              </div>
            </div>
            
            <table className="issues-table">
              <thead>
                <tr>
                  <th>Issue ID</th>
                  <th>Status</th>
                  <th>Student ID</th>
                  <th>Category</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Resolved</td>
                  <td>25UL0000PS</td>
                  <td>Missing Mark</td>
                  <td>01/01/2025</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistraDashboard;