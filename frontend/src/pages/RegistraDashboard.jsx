import React from 'react';
import Navbar from './NavBar';
import Sidebar from './Sidebar';
import { Search, Filter } from 'lucide-react';

const RegistrarDashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar />
      
      <div className="main-content-wrapper">
        {/* Navbar */}
        <Navbar />
        
        {/* Main Content */}
        <div className="main-content">
          {/* Dashboard Cards */}
          <div className="dashboard-cards">
            {/* Total Issues Card */}
            <div className="card">
              <h2 className="card-title">Total issues</h2>
              <p className="card-value">0</p>
              <p className="card-description">You currently have 0 issues</p>
            </div>
            
            {/* Pending Issues Card */}
            <div className="card">
              <h2 className="card-title">Pending issues</h2>
              <p className="card-value">0</p>
              <p className="card-description">You currently have 0 pending</p>
            </div>
            
            {/* In-progress Issues Card */}
            <div className="card">
              <h2 className="card-title">In-progress issues</h2>
              <p className="card-value">0</p>
              <p className="card-description">You currently have 0 in-progress issues</p>
            </div>
            
            {/* Resolved Issues Card */}
            <div className="card">
              <h2 className="card-title">Resolved issues</h2>
              <p className="card-value">1</p>
              <p className="card-description">You currently have 1 resolved issue</p>
            </div>
          </div>
          
          {/* My Issues Section */}
          <div className="issues-container">
            <h2 className="issues-title">My Issues</h2>
            
            {/* Search Bar */}
            <div className="search-filter-container">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search for issues"
                  className="search-input"
                />
                <Search className="search-icon" />
              </div>
              
              <button className="filter-button">
                <Filter className="filter-icon" />
                Filter
              </button>
            </div>
            
            {/* Issues Table */}
            <div className="table-container">
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
                    <td>25UA0000PS</td>
                    <td>Missing Mark</td>
                    <td>01/01/2025</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrarDashboard;