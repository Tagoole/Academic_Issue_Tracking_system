import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import emailIcon from '../assets/mailbulk.png'; // You'll need to add this icon
import helpIcon from '../assets/help-icon.png'; // You'll need to add this icon
import './verification.css';

const EmailVerification = () => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
  const [email, setEmail] = useState('user@example.com'); // Replace with the actual email
  const [error, setError] = useState('');
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  
  // Check if all digits are entered to enable the Next button
  const isCodeComplete = verificationCode.every(digit => digit !== '');
  
  // Handle input change for each digit
  const handleDigitChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;
    
    // Update the verification code array
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    
    // Clear any previous errors
    if (error) setError('');
    
    // Auto-focus next input if current input is filled
    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };
  
  // Handle key press for backspace to go to previous input
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Combine the digits into a single code
    const code = verificationCode.join('');
    
    // Simulate verification check
    if (code === '1234') { // Replace with actual verification logic
      console.log('Verification successful');
      // Redirect to next page or perform necessary action
    } else {
      setError('Invalid verification code. Please try again.');
    }
  };
  
  // Focus the first input field on component mount
  useEffect(() => {
    inputRefs[0].current.focus();
  }, []);
  
  return (
    <div className="verification-container">
      <header className="verification-header">
        <h1 className="header-title">AITS</h1>
        <button className="help-button">
          <img src={helpIcon} alt="Help" className="help-icon" />
          Help?
        </button>
      </header>
      
      <div className="verification-card">
        <div className="icon-container">
          <img src={emailIcon} alt="Email Verification" className="email-icon" />
        </div>
        
        <h2 className="verification-title">Email Verification</h2>
        
        <p className="verification-instruction">
          Enter the verification code we sent to you on
        </p>
        <p className="verification-email">{email}</p>
        
        <form onSubmit={handleSubmit} className="verification-form">
          <div className="code-inputs">
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="code-input"
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>
          
          {error && <p className="error-message">{error}</p>}
          
          <button 
            type="submit" 
            className="next-button"
            disabled={!isCodeComplete}
          >
            Next
          </button>
        </form>
        
        <Link to="/signin" className="signin-link">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default EmailVerification;