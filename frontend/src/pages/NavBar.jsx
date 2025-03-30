import React, { useState } from 'react';
import './NavBar.css';
import profilePic from '../assets/profile.png';
import logo from '../assets/makererelogo.png';
import { useNavigate } from "react-router-dom";
import notification from '../assets/notification.png';
import mail from '../assets/mail.png';

const NavBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${searchQuery}`);
  };

  const handleMailClick = () => {
    navigate('/messages');
  };

  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img 
            src={profilePic} 
            alt="Profile" 
            style={{ width: '40px', height: '40px', borderRadius: '50%' }} 
          />
          <span style={{ fontWeight: 'bold' }}>{'{First Name}'}</span>
        </div>
      </div>

      <div style={{ flex: 1, maxWidth: '500px', margin: '0 20px' }}>
        <form onSubmit={handleSearchSubmit}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search for anything..."
              value={searchQuery}
              onChange={handleSearchChange}
              style={{
                width: '100%',
                padding: '10px 15px',
                borderRadius: '20px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
            />
          </div>
        </form>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div onClick={handleNotificationClick} style={{ cursor: 'pointer' }}>
          <img 
            src={notification} 
            alt="Notifications" 
            style={{ width: '24px', height: '24px' }} 
          />
        </div>
        <div onClick={handleMailClick} style={{ cursor: 'pointer' }}>
          <img 
            src={mail} 
            alt="Messages" 
            style={{ width: '24px', height: '24px' }} 
          />
        </div>
        <div style={{ fontWeight: 'bold', marginLeft: '10px' }}>
          Academic Issue Tracking System
        </div>
        <img 
          src={logo} 
          alt="Logo" 
          style={{ width: '40px', height: '40px', marginLeft: '10px' }} 
        />
      </div>
    </nav>
  );
};

export default NavBar;