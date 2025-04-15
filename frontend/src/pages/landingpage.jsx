import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './landingpage.css';
import makererelogo from '../assets/makererelogo.png';
import landingimage from '../assets/landingimage.png';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [pageTransition, setPageTransition] = useState('');
  const particlesContainerRef = useRef(null);

  useEffect(() => {
    // Trigger welcome message animation after a short delay
    const welcomeTimer = setTimeout(() => {
      setShowWelcome(true);
    }, 800);

    // Show buttons after welcome text appears
    const buttonsTimer = setTimeout(() => {
      setShowButtons(true);
    }, 1800);

    // Create particles and cursor trail effects
    createParticles();
    const removeTrail = createCursorTrail();

    return () => {
      clearTimeout(welcomeTimer);
      clearTimeout(buttonsTimer);
      removeTrail();
    };
  }, []);

  // Create floating particles effect
  const createParticles = () => {
    if (!particlesContainerRef.current) return;
    
    const container = particlesContainerRef.current;
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      
      // Randomize particle properties
      const size = Math.random() * 10 + 5;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = Math.random() * 10 + 10;
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${posX}%`;
      particle.style.top = `${posY}%`;
      particle.style.animationDelay = `${delay}s`;
      particle.style.animationDuration = `${duration}s`;
      
      container.appendChild(particle);
    }
  };

  // Create cursor trail effect
  const createCursorTrail = () => {
    const cursorTrailContainer = document.createElement('div');
    cursorTrailContainer.classList.add('cursor-trail-container');
    document.body.appendChild(cursorTrailContainer);
    
    const trailElements = [];
    const TRAIL_COUNT = 10;
    
    // Create trail elements
    for (let i = 0; i < TRAIL_COUNT; i++) {
      const trail = document.createElement('div');
      trail.classList.add('cursor-trail');
      trail.style.opacity = 1 - (i / TRAIL_COUNT);
      trail.style.transform = 'scale(' + (1 - (i / TRAIL_COUNT) * 0.5) + ')';
      trail.style.animationDelay = `${i * 0.05}s`;
      cursorTrailContainer.appendChild(trail);
      trailElements.push(trail);
    }
    
    // Track mouse movement
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      trailElements.forEach((trail, index) => {
        setTimeout(() => {
          trail.style.left = `${clientX}px`;
          trail.style.top = `${clientY}px`;
        }, index * 30);
      });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    // Return cleanup function
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (cursorTrailContainer && cursorTrailContainer.parentNode) {
        cursorTrailContainer.parentNode.removeChild(cursorTrailContainer);
      }
    };
  };

  const navigateToSignup = () => {
    // Trigger the swing-right animation
    setPageTransition('page-transition-active');
    
    // Wait for animation to complete before navigating
    setTimeout(() => {
      navigate('/signup');
    }, 600); // Match this with the CSS animation duration
  };

  const navigateToSignin = () => {
    navigate('/signin');
  };

  return (
    <div className={`landing-container ${pageTransition}`}>
      {/* Particles container */}
      <div ref={particlesContainerRef} className="particles-container"></div>
      
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
          <button className="signup-btn" onClick={navigateToSignup}>
            <span>Sign Up</span>
            <div className="ripple"></div>
          </button>
          <button className="signin-btn" onClick={navigateToSignin}>
            <span>Sign In</span>
            <div className="ripple"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;