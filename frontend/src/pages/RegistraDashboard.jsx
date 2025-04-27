import React from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import './registradashboard-styles.css';

const RegistraDashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar />
      
      <div className="main-content">
        {/* Navbar */}
        <Navbar />
        
        {/* Main Content */}
        <div className="content-area">
          {/* Dashboard Cards */}
          <div className="grid grid-cols-2 gap-6 mb-6 dashboard-cards">
            {/* Total Issues Card */}
            <div className="stat-card">
              <h2 className="card-title">Total issues</h2>
              <p className="card-value">0</p>
              <p className="card-description">You currently have 0 issues</p>
            </div>
            
            {/* Additional cards... */}
          </div>
          
          {/* My Issues Section */}
          <div className="issues-section">
            {/* Rest of the component... */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default RegistraDashboard;