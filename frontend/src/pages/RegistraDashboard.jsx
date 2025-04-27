import React, { useState } from 'react';
import Navbar from './NavBar';
import Sidebar from './Sidebar';
import './RegistraDashboard.css';

// Statistics Card Component
const StatCard = ({ title, value }) => (
  <div className="stat-card">
    <h3>{title}</h3>
    <p className="stat-number">{value}</p>
  </div>
);

// Search and Filter Bar Component
const SearchFilterBar = () => (
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
);

// Tab Navigation Component
const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = ["Pending", "In-progress", "Resolved"];
  
  return (
    <div className="issue-tabs">
      {tabs.map(tab => (
        <div 
          key={tab}
          className={`tab ${activeTab === tab ? 'active' : ''}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </div>
      ))}
    </div>
  );
};

// Issue Table Component
const IssueTable = ({ issues }) => (
  <div className="issues-table">
    <div className="table-header">
      <div className="header-cell issue-header">Issue</div>
      <div className="header-cell status-header">Status</div>
      <div className="header-cell category-header">Category</div>
      <div className="header-cell date-header">Date</div>
      <div className="header-cell actions-header">Actions</div>
    </div>
    
    {issues.map((issue, index) => (
      <div className="table-row" key={index}>
        <div className="cell issue-cell">{issue.title}</div>
        <div className="cell status-cell">
          <span className={`status-badge ${issue.status.toLowerCase()}`}>{issue.status}</span>
        </div>
        <div className="cell category-cell">{issue.category}</div>
        <div className="cell date-cell">{issue.date}</div>
        <div className="cell actions-cell">
          <button className="view-details-btn">View Details</button>
        </div>
      </div>
    ))}
  </div>
);

// Stats Overview Component
const StatsOverview = () => {
  const stats = [
    { title: "Resolved Issues", value: 0 },
    { title: "Pending Issues", value: 2 },
    { title: "In-progress Issues", value: 0 }
  ];
  
  return (
    <div className="stats-cards">
      {stats.map((stat, index) => (
        <StatCard key={index} title={stat.title} value={stat.value} />
      ))}
    </div>
  );
};

// Main Dashboard Component
const RegistraDashboard = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  
  const mockIssues = [
    {
      title: "Wrong Marks",
      status: "Pending",
      category: "Marks",
      date: "07/10/2025"
    },
    {
      title: "Missing test",
      status: "Pending",
      category: "Marks",
      date: "07/10/2025"
    }
  ];
  
  return (
    <div className="app-container">
      <Navbar />
      <div className="content-wrapper">
        <Sidebar />
        <div className="dashboard-content">

          <StatsOverview />
          
          <div className="issues-section">
            <SearchFilterBar />
            <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
            <IssueTable issues={mockIssues} />
          </div>
          
          <div className="dashboard-footer">
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistraDashboard;