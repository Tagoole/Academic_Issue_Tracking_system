import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './landingpage.css';
import makererelogo from '../assets/makererelogo.png';
import landingimage from '../assets/landingimage.png';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const particlesContainerRef = useRef(null);
  
  useEffect(() => {
    // Trigger welcome message animation after a short delay
    const welcomeTimer = setTimeout(() => {
      setShowWelcome(true);
    }, 800);
    
    // Show buttons with delay
    const buttonsTimer = setTimeout(() => {
      setShowButtons(true);
    }, 1500);
    
    // Create particles
    createParticles();
    
    // Create cursor trail effect
    createCursorTrail();
    
    return () => {
      clearTimeout(welcomeTimer);
      clearTimeout(buttonsTimer);
    };
  }, []);
  


  const navigateToSignup = () => {
    navigate('/signup');
  };
  
  const navigateToSignin = () => {
    navigate('/signin');
  };
  
  return (
    <div className="landing-container">
      {/* Particles */}
      <div className="particles" ref={particlesContainerRef}></div>
      
      {/* Background image */}
      <div className="background-image" style={{ backgroundImage: `url(${landingimage})` }}></div>
      
      {/* AITS Logo at top right */}
      <div className="aits-header">AITS</div>
      
      {/* Main content */}
      <div className="content-container">
        {/* Logo centered */}
        <div className="logo-container">
          <img src={makererelogo} alt="Makerere University Logo" className="main-logo" />
        </div>
        
        {/* Welcome text with animation */}
        <div className={`welcome-text ${showWelcome ? 'show' : ''}`}>
          WELCOME TO THE ACADEMIC ISSUE TRACKING SYSTEM
        </div>
        
        {/* Button container */}
        <div className={`button-container ${showButtons ? 'show-buttons' : ''}`}>
          <div className="separator"></div>
          <button className="signup-btn" onClick={navigateToSignup}>Sign Up</button>
          <button className="signin-btn" onClick={navigateToSignin}>Sign In</button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;