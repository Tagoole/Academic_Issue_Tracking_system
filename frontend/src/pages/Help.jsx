import React from 'react';
import makerereLogo from '../assets/makererelogo.png';
import './Help.css'; 
import NavBar from './Navbar';
import backgroundImage from '../assets/pexels-olia-danilevich-5088017.jpg'; // Background image

const Help = () => {
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
        backgroundImage: `url(${backgroundImage})`, // Fixed template literal syntax
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100%', // Ensure it spans the full width
        position: 'absolute', // Position absolute to cover the entire viewport
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
          background: 'rgba(0, 0, 0, 0.4)', // Increased opacity for better visibility
          backdropFilter: 'blur(10px)', // Enhanced blur effect
          WebkitBackdropFilter: 'blur(10px)', // For Safari support
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.18)', // More visible border
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)', // Enhanced shadow
          padding: '25px 20px', // Improved padding
          zIndex: 10, // Ensure sidebar is above background
        }}
      >
        <div className="university-logo-sidebar">
          <img src={makerereLogo} alt="University Logo" className="logo-sidebar" />
        </div>

        {/* Back to Dashboard Button */}
        <a href="/dashboard" className="menu-item back-to-dashboard">
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
          background: 'rgba(255, 255, 255, 0.15)', // More transparent to enhance glassmorphism
          backdropFilter: 'blur(15px)', // Increased blur for more glassmorphism effect
          WebkitBackdropFilter: 'blur(15px)', // For Safari support
          borderRadius: '15px',
          border: '1px solid rgba(255, 255, 255, 0.2)', // More visible border
          boxShadow: '0 8px 32px 0 rgba(5, 5, 5, 0.37)', // Enhanced shadow
          padding: '30px', // Increased padding for better spacing
          marginTop: '20px', // Add some space from the top
          maxWidth: '800px', // Limit width for better readability
          width: '100%', // Take full width up to max-width
          zIndex: 5, // Ensure content is above background
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
                background: 'rgba(255, 255, 255, 0.6)', // Semi-transparent input
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
                background: 'rgba(255, 255, 255, 0.6)', // Semi-transparent input
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