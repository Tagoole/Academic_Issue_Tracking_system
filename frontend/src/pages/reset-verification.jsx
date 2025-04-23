//import section
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../api';
import emailIcon from '../assets/mailbulk.png';
import helpIcon from '../assets/help-icon.png';
import './reset-verification.css';


const ResetVerification = () => {
  // State variables and hooks
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
  //email initialization effect
  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
      localStorage.setItem('userEmail', location.state.email);
    } else if (localStorage.getItem('userEmail')) {
      setEmail(localStorage.getItem('userEmail'));
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      const emailParam = urlParams.get('email');
      if (emailParam) {
        setEmail(emailParam);
        localStorage.setItem('userEmail', emailParam);
      } else {
        setError('No email address found. Please sign up first.');
      }
    }
  }, [location]);
  //helper function to check if the verification code is complete
  const isCodeComplete = verificationCode.every(digit => digit !== '');
  //input handler function
  const handleDigitChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    
    if (error) setError('');
    
    if (value && index < 4) {
      inputRefs[index + 1].current.focus();
    }
  };
  
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };
  //error handling function
  const extractErrorMessage = (error) => {
    if (!error) return 'An unknown error occurred';
    
    if (error.response) {
      const responseData = error.response.data;
      if (typeof responseData === 'string') {
        return responseData;
      }
      if (responseData.error) {
        return responseData.error;
      }
      if (responseData.Error) {
        return responseData.Error;
      }
      if (typeof responseData === 'object' && Object.keys(responseData).length > 0) {
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
  //form submission handler function
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email address is missing. Please go back to signup.');
      return;
    }
    
    if (!isCodeComplete) {
      setError('Please enter the complete 5-digit verification code.');
      return;
    }
    
    const code = verificationCode.join('');
    setIsLoading(true);
    
    try {
      const response = await API.post('/api/verify_password_reset_code/', {
        email: email,
        code: code
      });
      
      console.log('Verification successful:', response.data);
      setResendStatus(response.data.Message || 'Email verified successfully!');
      setError('');
      
      // Navigate to new-password page with verification code as query parameter
      navigate(`/new-password?code=${code}`);
      
    } catch (error) {
      console.error('Verification error:', error);
      setError(extractErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };
//resend code handler
  const handleResendCode = async () => {
    if (!email) {
      setError('Email address is missing. Please go back to signup.');
      return;
    }
    
    setIsLoading(true);
    setResendStatus('Sending verification code...');
    
    try {
      const response = await API.post("/api/resend_password_reset_code/", {
        email: email
      });
      
      setResendStatus(response.data.Message || 'Verification code resent! Please check your email.');
      setError('');
      setResendDisabled(true);
      setCountdown(30);
      
    } catch (error) {
      console.error('Error resending code:', error);
      setError(extractErrorMessage(error));
      setResendStatus('');
    } finally {
      setIsLoading(false);
    }
  };
//countdown effect
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
  //initial focus effect
  useEffect(() => {
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  }, []);
  //component rendering
  return (
    <div className="verification-container">
    // Header section
      <header className="verification-header">
        <h1 className="header-title">AITS</h1>
        <button className="help-button">
          <img src={helpIcon} alt="Help" className="help-icon" />
          Help?
        </button>
      </header>
      // main verification card
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

export default ResetVerification;