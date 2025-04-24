import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './congs.css'; 

const CONGS = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(3); 
  
  // Get email and message from location state
  const email = location.state?.email || localStorage.getItem('userEmail') || '';
  const message = location.state?.message || 'Email verified successfully!';
  
  // Redirect after timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/signin');
    }, 3000); // 3 seconds
    
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Clean up
    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
    };
  }, [navigate]);
  
  return (
    <div className="congs-container">
      <div className="congs-card">
        <div className="success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        
        <h1 className="congs-title">Congratulations!</h1>
        
        {email && (
          <p className="congs-email">{email}</p>
        )}
        
        <p className="congs-message">{message}</p>
        
        <p className="redirect-message">
          Redirecting to sign in in {countdown} seconds...
        </p>
        
        <button 
          className="signin-now-button"
          onClick={() => navigate('/signin')}
        >
          Sign In Now
        </button>
      </div>
    </div>
  );
};

export default CONGS;