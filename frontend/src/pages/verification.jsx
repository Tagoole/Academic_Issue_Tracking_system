import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api'; // Import API instance
import emailIcon from '../assets/mailbulk.png';
import helpIcon from '../assets/help-icon.png';
import './verification.css';

const EmailVerification = () => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [resendStatus, setResendStatus] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      const emailParam = urlParams.get('email');
      if (emailParam) {
        setEmail(emailParam);
      }
    }
  }, []);

  const isCodeComplete = verificationCode.every(digit => digit !== '');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = verificationCode.join('');

    try {
      const response = await API.post('/verify_email/', { email, code });
      
      console.log('Verification successful:', response.data);
      setResendStatus('Email verified successfully!');

      setTimeout(() => {
        navigate('/signin');
      }, 2000);
      
    } catch (error) {
      console.error('Verification error:', error);
      
      if (error.response) {
        setError(error.response.data.error || 'Verification failed. Please try again.');
      } else if (error.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('Error submitting verification code. Please try again.');
      }
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await API.post('/resend_verification_code/', { email });

      setResendStatus('Verification code resent! Please check your email.');
      setResendDisabled(true);
      setCountdown(30);

      if (error) setError('');
      
    } catch (error) {
      console.error('Error resending code:', error);
      
      if (error.response) {
        setError(error.response.data.Error || 'Failed to resend code. Please try again.');
      } else if (error.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('Error submitting request. Please try again.');
      }
    }
  };

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
          {resendStatus && <p className="success-message">{resendStatus}</p>}
          
          <button
            type="submit"
            className="next-button"
            disabled={!isCodeComplete}
          >
            Next
          </button>

          <button
            type="button"
            className="resend-button"
            onClick={handleResendCode}
            disabled={resendDisabled}
          >
            {resendDisabled 
              ? `Resend Code (${countdown}s)` 
              : 'Resend Code'}
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
