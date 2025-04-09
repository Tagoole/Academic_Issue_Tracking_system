import React from 'react';
import makerereLogo from '../assets/makererelogo.png';
import './Help.css'; 
import NavBar from './Navbar';
import backgroundimage from '../assets/pexels-olia-danilevich-5088017.jpg'; // Background image

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
        backgroundImage: "url(${backgroundimage})",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
    >
      {/* NavBar */}
      <NavBar />

      {/* Sidebar */}
      <div
        className="settings-sidebar"
        style={{
          background: 'rgba(0, 0, 0, 0.6)', // Black with 60% opacity for glassmorphism
          backdropFilter: 'blur(6px)', // Blur effect
          WebkitBackdropFilter: 'blur(6px)', // For Safari support
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.1)', // Subtle border
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)', // Enhanced shadow
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
          background: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white background
          backdropFilter: 'blur(12px)', // Blur effect
          WebkitBackdropFilter: 'blur(12px)', // For Safari support
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.18)', // Subtle border
          boxShadow: '0 8px 32px 0 rgba(5, 5, 5, 0.37)', // Enhanced shadow
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
            />
          </div>
          <div className="contact-input-container">
            <input
              type="text"
              value="AIRTEL; +256 704671815"
              readOnly
              onClick={() => handlePhoneCopy('+256 704671815')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
