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
    const removeTrail = createCursorTrail();
    
    // Create cursor trail effect
    createCursorTrail();
    
    return () => {
      clearTimeout(welcomeTimer);
      clearTimeout(buttonsTimer);
    };
  }, []);
  
  // Function to create floating particles
  const createParticles = () => {
    if (!particlesContainerRef.current) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      
      // Random position
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      
      // Random size
      const size = Math.random() * 5 + 1;
      
      // Random opacity
      const opacity = Math.random() * 0.5 + 0.1;
      
      // Set styles
      particle.style.left = `${posX}%`;
      particle.style.top = `${posY}%`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.opacity = opacity;
      
      // Add animation
      const duration = Math.random() * 20 + 10;
      particle.style.animation = `floatParticle ${duration}s infinite linear`;
      
      // Create unique keyframe animation for each particle
      const keyframes = `
        @keyframes floatParticle {
          0% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
          }
          50% {
            transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
          }
          75% {
            transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
          }
          100% {
            transform: translate(0, 0);
          }
        }
      `;
      
      const style = document.createElement('style');
      style.innerHTML = keyframes;
      document.head.appendChild(style);
      
      particlesContainerRef.current.appendChild(particle);
    }
  };
  
  // Function to create cursor trail effect
  const createCursorTrail = () => {
    const maxTrails = 20;
    const trails = [];
    
    document.addEventListener('mousemove', (e) => {
      const trail = document.createElement('div');
      trail.classList.add('cursor-trail');
      trail.style.left = `${e.clientX}px`;
      trail.style.top = `${e.clientY}px`;
      
      document.body.appendChild(trail);
      trails.push(trail);
      
      // Animate and remove
      setTimeout(() => {
        trail.style.width = '0';
        trail.style.height = '0';
        trail.style.opacity = '0';
        trail.style.transition = 'all 0.5s ease-out';
        
        setTimeout(() => {
          trail.remove();
          trails.shift();
        }, 500);
      }, 10);
      
      // Limit the number of trails
      if (trails.length > maxTrails) {
        const oldTrail = trails.shift();
        oldTrail.remove();
      }
    });
  };

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