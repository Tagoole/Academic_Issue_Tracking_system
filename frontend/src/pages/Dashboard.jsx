import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import libraryImage from '../assets/student.png'; 
import dashboardIcon from '../assets/knowledge.png'; 
import './Dashboard.css';




const DashboardSetup = () => {
  const navigate = useNavigate();
  const handleStartSetup = () => {
    navigate('/ProfileSetup');
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