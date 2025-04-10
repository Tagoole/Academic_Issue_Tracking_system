import React from 'react';
import './styles.css';

function RegistrationForm() {
  return (
    <div className="container">
      <div className="form-section">
        <div className="form-group">
          <label htmlFor="user-id">User ID:</label>
          <input type="text" id="user-id" placeholder="Enter ID" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" placeholder="Enter the email" />
        </div>
        <div className="generate-btn">
          Generate Registration Token
        </div>
      </div>
  
  );
}

