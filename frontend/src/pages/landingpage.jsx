import React from 'react';
import './landingpage.css';
import { useNavigate } from 'react-router-dom';
import makererelogo from '../assets/makererelogo.png';
import landingimage from '../assets/landingimage.png';

const LandingPage = () => {
  const navigate = useNavigate();
  
  const navigateToSignup = () => {
    navigate('/signup');
  };
  
  const navigateToSignin = () => {
    navigate('/signin');
  };
  
  return (
    <div className="landingpage">
      {/* Using the landingimage as a background directly in JSX */}
      <div className="bg-image" style={{ backgroundImage: `url(${landingimage})` }}></div>
      
      {/* Logo at the top */}
      <div className="logo">
        <h1 className="logo-name">AITS</h1>
      </div>
      
      {/* Main content section */}
      <div className="content-container">
        <div className="overlay">
          <img 
            src={makererelogo} 
            alt="Makerere University Logo" 
            className="makerere-logo" 
          />
          <div className="welcome-text">
            WELCOME TO THE ACADEMIC ISSUE TRACKING SYSTEM
          </div>
          
          {/* Buttons now below the welcome text */}
          <div className="buttons">
            <button className="signup-button" onClick={navigateToSignup}>
              Sign Up
            </button>
            <div className="separator"></div>
            <button className="signin-button" onClick={navigateToSignin}>
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;