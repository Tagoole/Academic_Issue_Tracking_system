import React from 'react';
import './Notifications.css';
import Navbar from './Navbar';
import bakgroundImage from '../assets/backgroundimage.jpg';

const Notifications = () => {
  return (
    <div
      className="page-container"
      style={{
        backgroundImage: `url(${bakgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Navbar />
      <div className="content-container">
        <div className="notification-card">
          <div className="notification-content">
            <h2 className="notification-title">NOTIFICATIONS</h2>
            <p className="notification-text">
              You have a new assigned issue from (Student name) 
              and registration number. Click the assigned issues tab 
              to view it
            </p>
            <div className="notification-timestamp">
              01/01/2025
              <br />
              00:00 AM
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;