import React from 'react';
import libraryImage from '../assets/student.png'; // Import the library image (you'll need to add this)
import dashboardIcon from '../assets/knowledge.png'; // Import dashboard icon (you'll need to add this)
import './Dashboard.css';

const DashboardSetup = () => {
  const handleStartSetup = () => {
    // Handle the start setup logic here
    console.log('Start Setup clicked');
  };

  return (
    <div className="dashboard-setup-container">
      <div className="split-layout">
        <div className="left-section">
          <img src={libraryImage} alt="Library" className="library-image" />
        </div>
        
        <div className="right-section">
          <div className="setup-content">
            <h1 className="welcome-title">Welcome!</h1>
            <h2 className="setup-subtitle">This is your Dashboard setup</h2>
            
            <p className="setup-description">
              Help us customize your account and preferences to get started quickly.
            </p>
            
            <img src={dashboardIcon} alt="Dashboard" className="dashboard-icon" />
            
            <button onClick={handleStartSetup} className="setup-button">
              Start Setup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSetup;