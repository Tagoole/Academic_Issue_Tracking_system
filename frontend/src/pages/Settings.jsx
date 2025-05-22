import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import makerereLogo from '../assets/makererelogo.png';
import settingsIcon from '../assets/settings.png';
import './Settings.css';
import NavBar from './NavBar';

function Settings() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('');

  // Determine user role on component mount
  useEffect(() => {
    // Get user role from localStorage or any other source where you store user information
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  // Function to handle dashboard navigation based on user role
  const handleDashboardNavigation = (e) => {
    e.preventDefault();
    
    // Navigate based on user role
    if (userRole) {
      switch(userRole.toLowerCase()) {
        case 'student':
          navigate('/studentDashboard');
          break;
        case 'lecturer':
          navigate('/lecturerdashboard');
          break;
        case 'registrar':
          navigate('/registrarDashboard');
          break;
        default:
          // Default fallback if role is not found or recognized
          navigate('/dashboard');
          break;
      }
    } else {
      // If userRole is not available yet, redirect to general dashboard
      navigate('/dashboard');
    }
  };

  return (
    <div
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
      }}
    >
      {/* NavBar Component with white glassmorphism */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <NavBar />
      </div>

      {/* Main content container */}
      <div className="settings-container">
        {/* Glassmorphism applied to sidebar - moved to left margin with more intense effect */}
        <div
          className="settings-sidebar"
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '0 10px 10px 0',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
            left: 0, // Ensure it's at the left margin
            width: '250px',
            position: 'fixed',
            height: '100vh',
            zIndex: 90,
            paddingTop: '80px', // Space for the navbar
          }}
        >
          <div className="university-logo-sidebar">
            <img src={makerereLogo} alt="University Logo" className="logo-sidebar" />
          </div>

          {/* Sidebar menu items */}
          <a href="#" className="menu-item" onClick={handleDashboardNavigation}>
            Back to Dashboard
            <svg viewBox="0 0 24 24" className="arrow-icon">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </a>

          <a href="/changepassword" className="menu-item">
            Change Password
            <svg viewBox="0 0 24 24" className="arrow-icon">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </a>

          <a href="/preferences" className="menu-item active">
            Preferences
            <svg viewBox="0 0 24 24" className="arrow-icon">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </a>

          <a href="/support" className="menu-item">
            Support/Help
            <svg viewBox="0 0 24 24" className="arrow-icon">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </a>

          <a href="/deleteaccount" className="menu-item delete-account">
            Delete Account
            <svg viewBox="0 0 24 24" className="arrow-icon">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </a>
        </div>

        {/* Glassmorphism applied to main content */}
        <div
          className="main-content"
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            boxShadow: '0 8px 32px 0 rgba(5, 5, 5, 0.37)',
            marginLeft: '250px',
            padding: '30px',
            flex: '1',
            paddingTop: '90px', // Increased to accommodate fixed navbar
          }}
        >
          <div className="settings-message">
            <h2>Your settings will be displayed here</h2>
            <p>Logged in as: {userRole || 'Unknown user'}</p>
            <img 
              src={settingsIcon} 
              alt="Settings Icon" 
              style={{ width: '50px', height: '50px', marginTop: '20px' }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;