import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../api'; // Import the API instance from api.js
import emailIcon from '../assets/mailbulk.png';
import helpIcon from '../assets/help-icon.png';
import './verification.css';

const EmailVerification = () => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [resendStatus, setResendStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from different sources when component mounts
  useEffect(() => {
    // First priority: Check if email was passed via location state (from signup page)
    if (location.state && location.state.email) {
      setEmail(location.state.email);
      // Save to localStorage for persistence
      localStorage.setItem('userEmail', location.state.email);
    } 
    // Second priority: Check localStorage
    else if (localStorage.getItem('userEmail')) {
      setEmail(localStorage.getItem('userEmail'));
    } 
    // Third priority: Check URL params
    else {
      const urlParams = new URLSearchParams(window.location.search);
      const emailParam = urlParams.get('email');
      if (emailParam) {
        setEmail(emailParam);
        // Save to localStorage for persistence
        localStorage.setItem('userEmail', emailParam);
      } else {
        // If no email is found, show error
        setError('No email address found. Please sign up first.');
      }
    }
  }, [location]);
  
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
    if (value && index < 4) {
      inputRefs[index + 1].current.focus();
    }
  };
  
  // Handle key press for backspace to go to previous input
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };
  
  // Parse and extract error message from various response formats
  const extractErrorMessage = (error) => {
    if (!error) return 'An unknown error occurred';
    
    if (error.response) {
      // Handle different error response formats
      const responseData = error.response.data;
      
      // If the error is a simple string
      if (typeof responseData === 'string') {
        return responseData;
      }
      
      // If error is in 'error' field
      if (responseData.error) {
        return responseData.error;
      }
      
      // If error is in 'Error' field
      if (responseData.Error) {
        return responseData.Error;
      }
      
      // If error response contains multiple field errors
      if (typeof responseData === 'object' && Object.keys(responseData).length > 0) {
        // Join all error messages
        const errorMessages = Object.values(responseData)
          .flat()
          .filter(val => val)
          .join('. ');
          
        if (errorMessages) return errorMessages;
      }
      
      return `Server error: ${error.response.status}`;
    } else if (error.request) {
      return 'No response from server. Please check your connection.';
    } else {
      return error.message || 'Error submitting request. Please try again.';
    }
  };
  
  // Handle form submission - verify email with backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation check
    if (!email) {
      setError('Email address is missing. Please go back to signup.');
      return;
    }
    
    if (!isCodeComplete) {
      setError('Please enter the complete 5-digit verification code.');
      return;
    }
    
    // Combine the digits into a single code
    const code = verificationCode.join('');
    setIsLoading(true);
    
    try {
      const response = await API.post('/api/verify_email/', {
        email: email,
        code: code
      });
      
      // Handle successful verification
      console.log('Verification successful:', response.data);
      // Show success message before redirecting
      setResendStatus(response.data.Message || 'Email verified successfully!');
      setError(''); // Clear any existing errors
      
      // Redirect to sign-in page or dashboard after short delay
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
      
    } catch (error) {
      // Handle verification error
      console.error('Verification error:', error);
      setError(extractErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resending the verification code
  const handleResendCode = async () => {
    if (!email) {
      setError('Email address is missing. Please go back to signup.');
      return;
    }
    
    setIsLoading(true);
    setResendStatus('Sending verification code...');
    
    try {
      // Call the backend API to resend verification code
      const response = await API.post("/api/resend_verify_code/", {
        email: email
      });
      
      // Show success message
      setResendStatus(response.data.Message || 'Verification code resent! Please check your email.');
      setError(''); // Clear any previous errors
      
      // Disable the button temporarily and start countdown
      setResendDisabled(true);
      setCountdown(30); // 30 second cooldown
      
    } catch (error) {
      console.error('Error resending code:', error);
      setError(extractErrorMessage(error));
      setResendStatus(''); // Clear any success message
    } finally {
      setIsLoading(false);
    }
  };

  // Handle countdown timer for resend button
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false);
      setResendStatus('');
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, resendDisabled]);
  
  // Focus the first input field on component mount
  useEffect(() => {
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
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
        
        {email ? (
          <>
            <p className="verification-instruction">
              Enter the verification code we sent to you on
            </p>
            <p className="verification-email">{email}</p>
          </>
        ) : (
          <p className="verification-instruction error-message">
            Email address not found. Please return to signup.
          </p>
        )}
        
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
                disabled={!email || isLoading}
              />
            ))}
          </div>
          
          {error && <p className="error-message">{error}</p>}
          {resendStatus && <p className="success-message">{resendStatus}</p>}
          
          <button
            type="submit"
            className="next-button"
            disabled={!isCodeComplete || !email || isLoading}
          >
            {isLoading ? 'Verifying...' : 'Next'}
          </button>

          <button
            type="button"
            className="resend-button"
            onClick={handleResendCode}
            disabled={resendDisabled || !email || isLoading}
          >
            {isLoading && !resendDisabled ? 'Sending...' : 
             resendDisabled ? `Resend Code (${countdown}s)` : 
             'Resend Code'}
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