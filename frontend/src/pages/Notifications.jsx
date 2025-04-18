import React from 'react';
import './Notifications.css';
import Navbar from './NavBar';
import backgroundimage from "../assets/backgroundimage.jpg"; 


const Notifications = () => {
  return (
    <div
      className="page-container"
      style={{
        backgroundImage: `url(${backgroundimage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh', 
      }}
    >
      <Navbar />
      <div className="content-container">
        <div className="notification-card">
          <div className="notification-content">
            <h2 className="notification-title">NOTIFICATIONS</h2>
            <p className="notification-text">
              You have a new assigned issue from (Student name) and registration
              number. Click the assigned issues tab to view it
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