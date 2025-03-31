import React from 'react';
import makerereLogo from '../assets/makererelogo.png';
import './Help.css';

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
    <div className="settings-container">
      {/* Sidebar */}
      <div className="settings-sidebar">
        <div className="university-logo-sidebar">
          <img src={makerereLogo} alt="University Logo" className="logo-sidebar" />
        </div>

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
      <div className="main-content">
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

export default Help;
