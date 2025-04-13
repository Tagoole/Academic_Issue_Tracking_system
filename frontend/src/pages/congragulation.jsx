import React from 'react';
import { useNavigate } from 'react-router-dom';
import './congragulation.css';
import congsImage from '../assets/congs.png'; 

const  Congragulation = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="success-container">
      <div className="header-section">
        <h1 className="title">CONGRATULATIONS!</h1>
        <h2 className="subtitle">Your dashboard is ready</h2>
      </div>
      
      <div className="image-container">
        <img src={congsImage} alt="Congratulations" className="congs-image" />
      </div>
      
      <div className="main-content">
        <p className="description">Track and manage your academic issues.</p>
        <div className="status-message">SUCCESS!</div>
      </div>
      
      <div className="navigation-buttons">
        <button 
          className="back-button" 
          onClick={handleBack}
        >
          Back
        </button>
        <button 
          className="dashboard-button" 
          onClick={handleGoToDashboard}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Congragulation; ;
