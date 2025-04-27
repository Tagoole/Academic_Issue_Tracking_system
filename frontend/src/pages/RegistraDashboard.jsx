import React from 'react';
import Navbar from './NavBar';
import Sidebar from './Sidebar';
import './RegistraDashboard.css';

const RegistraDashboard = () => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="dashboard-content">
  
        <div className="stats-cards">
            <div className="stat-card">
              <h3>Resolved Issues</h3>
              <p className="stat-number">0</p>
            </div>
            
            <div className="stat-card">
              <h3>Pending Issues</h3>
              <p className="stat-number">2</p>
            </div>
            
            <div className="stat-card">
              <h3>In-progress Issues</h3>
              <p className="stat-number">0</p>
            </div>
          </div>
          
          <div className="issues-section">
            <div className="search-filter-row">
              <input
                type="text"
                placeholder="Search for issues..."
                className="search-input"
              />
              <div className="filter-button">
                <button>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-funnel" viewBox="0 0 16 16">
                    <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5z"/>
                  </svg>
                </button>
              </div>
              <button className="new-issue-btn">+ New Issue</button>
            </div>
            
            <div className="issue-tabs">
              <div className="tab active">Pending</div>
              <div className="tab">In-progress</div>
              <div className="tab">Resolved</div>
            </div>
            
            <div className="issues-table">
              <div className="table-header">
                <div className="header-cell issue-header">Issue</div>
                <div className="header-cell status-header">Status</div>
                <div className="header-cell category-header">Category</div>
                <div className="header-cell date-header">Date</div>
                <div className="header-cell actions-header">Actions</div>
              </div>
              
              <div className="table-row">
                <div className="cell issue-cell">Wrong Marks</div>
                <div className="cell status-cell">
                  <span className="status-badge pending">Pending</span>
                </div>
                <div className="cell category-cell">Marks</div>
                <div className="cell date-cell">07/10/2025</div>
                <div className="cell actions-cell">
                  <button className="view-details-btn">View Details</button>
                </div>
              </div>
              
              <div className="table-row">
                <div className="cell issue-cell">Missing test</div>
                <div className="cell status-cell">
                  <span className="status-badge pending">Pending</span>
                </div>
                <div className="cell category-cell">Marks</div>
                <div className="cell date-cell">07/10/2025</div>
                <div className="cell actions-cell">
                  <button className="view-details-btn">View Details</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistraDashboard;