import React, { useState, useEffect } from 'react';
import makerereLogo from '../assets/makererelogo.png';
import './Help.css'; 
import NavBar from './NavBar';
import backgroundImage from '../assets/pexels-olia-danilevich-5088017.jpg'; 

const Help = () => {
  /* --- State for user role --- */
  const [userRole, setUserRole] = useState('');

  /* --- Effect to get user role from localStorage or API --- */
  useEffect(() => {
    // Get the user role from localStorage or you could fetch it from an API
    const role = localStorage.getItem('userRole');
    if (role) {
      setUserRole(role);
    } else {
      // If for some reason the role isn't in localStorage, you may want to redirect to login
      // or fetch it from an API endpoint
      console.warn('User role not found in localStorage');
    }
  }, []);

  /* --- Function to determine dashboard URL based on role --- */
  const getDashboardUrl = () => {
    switch (userRole.toLowerCase()) {
      case 'lecturer':
        return '/lecturerdashboard';
      case 'student':
        return '/studentdashboard';
      case 'registrar':
        return '/registradashboard';
      default:
        // Default fallback if role is unknown
        return '/dashboard';
    }
  };

  const handleEmailCopy = () => {
    navigator.clipboard.writeText('jjulianahmuhindo@gmail.com');
    alert('Email copied to clipboard');
  };

  const handlePhoneCopy = (phoneNumber) => {
    navigator.clipboard.writeText(phoneNumber);
    alert('Phone number copied to clipboard');
  };

  return (
    <div
      className="settings-container"
      style={{
        backgroundImage: `url(${backgroundImage})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100%', 
        position: 'absolute', 
        top: 0,
        left: 0,
      }}
    >
      {/* NavBar */}
      <NavBar />

      {/* Sidebar */}
      <div
        className="settings-sidebar"
        style={{
          background: 'rgba(0, 0, 0, 0.4)', 
          backdropFilter: 'blur(10px)', 
          WebkitBackdropFilter: 'blur(10px)', 
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.18)', 
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)', 
          padding: '25px 20px', 
          zIndex: 10, 
        }}
      >
        <div className="university-logo-sidebar">
          <img src={makerereLogo} alt="University Logo" className="logo-sidebar" />
        </div>

        {/* Back to Dashboard Button - Now using dynamic URL based on role */}
        <a href={getDashboardUrl()} className="menu-item back-to-dashboard">
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

        <a href="/preferences" className="menu-item">
          Preferences
          <svg viewBox="0 0 24 24" className="arrow-icon">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </a>

        <a href="/help" className="menu-item active">
          Support/Help
          <svg viewBox="0 0 24 24" className="arrow-icon">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </a>

        <a href="/delete-account" className="delete-account">
          Delete Account
          <svg viewBox="0 0 24 24" className="arrow-icon">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </a>
      </div>

      {/* Main Content */}
      <div
        className="main-content"
        style={{
          background: 'rgba(255, 255, 255, 0.15)', 
          backdropFilter: 'blur(15px)', 
          WebkitBackdropFilter: 'blur(15px)', 
          borderRadius: '15px',
          border: '1px solid rgba(255, 255, 255, 0.2)', 
          boxShadow: '0 8px 32px 0 rgba(5, 5, 5, 0.37)', 
          padding: '30px', 
          marginTop: '20px', 
          maxWidth: '800px', 
          width: '100%', 
          zIndex: 5, 
        }}
      >
        <div className="support-help-title">Support/Help</div>

        <div className="support-description">
          Kindly reach us via Email or Phone for any help.
        </div>

        <div className="contact-section">
          <div className="contact-type">Email</div>
          <div className="contact-input-container">
            <input
              type="text"
              placeholder="Send us an email on;"
              value="jjulianahmuhindo@gmail.com"
              readOnly
              onClick={handleEmailCopy}
              style={{ 
                background: 'rgba(255, 255, 255, 0.6)', // Semi-transparent input
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            />
          </div>
        </div>

        <div className="contact-section">
          <div className="contact-type">Phone</div>
          <div className="contact-input-container">
            <input
              type="text"
              placeholder="Give us a call on;"
              value="MTN; +256 764671815"
              readOnly
              onClick={() => handlePhoneCopy('+256 764671815')}
              style={{ 
                background: 'rgba(255, 255, 255, 0.6)', 
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            />
          </div>
          <div className="contact-input-container">
            <input
              type="text"
              value="AIRTEL; +256 704671815"
              readOnly
              onClick={() => handlePhoneCopy('+256 704671815')}
              style={{ 
                background: 'rgba(255, 255, 255, 0.6)', 
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;