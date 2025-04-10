import React, { useState } from 'react';
import './registrationtoken.css';
import token_image from '../assets/token.png';


function Registrationtoken() {
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const handleGenerateToken = () => {
    if (email) {
      setMessage(`The registration token has been created and sent to the Email "${email}"`);
      setShowMessage(true);
      
      // Hide message after 5 seconds
      setTimeout(() => {
        setShowMessage(false);
      }, 5000);
    } else {
      setMessage('Please enter an email address');
      setShowMessage(true);
      
      // Hide error message after 3 seconds
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    }
  };

  return (
    <div className="page-container">
      <div className="container">
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="user-id">User ID:</label>
            <input 
              type="text" 
              id="user-id" 
              placeholder="Enter ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Enter the email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div 
            className="generate-btn"
            onClick={handleGenerateToken}
          >
            Generate Registration Token
          </div>
          
          {showMessage && (
            <div className={`message ${!email ? 'error' : 'success'}`}>
              {message}
            </div>
          )}
        </div>
        <div className="image-section">
          <div className="image-bubble">
            <div className="token-image">
                
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registrationtoken;