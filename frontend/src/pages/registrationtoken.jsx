import React from 'react';
import './registrationtoken.css';

function Registrationtoken() {
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
      <div className="image-section">
        <div className="image-bubble">
          Some random picture
          <div className="placeholder-image">
            <img src="/api/placeholder/150/150" alt="Random placeholder" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registrationtoken;