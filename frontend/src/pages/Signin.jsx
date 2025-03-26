import React, { useState } from 'react';
import mail from '../assets/mail.png';
import hidden from '../assets/hidden.png';
import './signin.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the sign-in logic here
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Agreed to terms:', agreeToTerms);
  };

  return (
    <div className="forgot-password-container">
      <div className="header">
        <h1 className="green-text">WELCOME TO</h1>
        <h2>THE ACADEMIC TRACKING SYSTEM</h2>
        <h3>ATIS</h3>
      </div>
      <div className="content">
        <form className="sign-in-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Enter your Email here</label>
            <div className="input-container">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <img src={mail} alt="Mail Icon" className="icon" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-container">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <img
                src={hidden}
                alt="Toggle Password"
                className="icon"
                onClick={() => setPasswordVisible(!passwordVisible)}
              />
            </div>
          </div>
          <div className="terms-group">
            <input
              type="checkbox"
              id="terms"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              required
            />
            <label htmlFor="terms">I have read and understood the terms and conditions of the ATIS.</label>
          </div>
          <button type="submit" className="submit-button">
            Sign In
          </button>
        </form>
        <p className="sign-up-link">
          Don't have an account? <a href="/signup">Sign Up</a>.
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;