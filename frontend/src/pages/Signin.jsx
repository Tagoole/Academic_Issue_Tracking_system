import React, { useState } from 'react';
import mail from '../assets/mail.png';
import hidden from '../assets/hidden.png';
import codeIcon from '../assets/code-icon.png'; // You'll need to add this image
import graduateImage from '../assets/congragulation.png'; // You'll need to add this image
import './signin.css';

const SignIn = () => {
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
    <div className="signin-container">
      <div className="top-navigation">
        <a href="/forgot-password" className="forgot-password-link">FORGOT PASSWORD</a>
        <img src={codeIcon} alt="Code Icon" className="code-icon" />
      </div>
      
      <div className="split-layout">
        <div className="left-section">
          <div className="header">
            <h1 className="green-text">WELCOME TO</h1>
            <h2 className="green-text">THE ACADEMIC TRACKING SYSTEM</h2>
            <h3 className="green-text">(ATIS)</h3>
          </div>

          <div className="content">
            <h4 className="sign-in-heading">Sign in</h4>
            <form className="sign-in-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <div className="input-container">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your Email here"
                    required
                  />
                  <img src={mail} alt="Mail Icon" className="icon" />
                </div>
              </div>

              <div className="form-group">
                <div className="input-container">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
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
              
              <a href="/forgot-password" className="forgot-password-text">Forgot the password?</a>

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
              Don't have an account? <a href="/signup" className="signup-link">Sign Up.</a>
            </p>
          </div>
        </div>

        <div className="right-section">
          <img src={graduateImage} alt="Graduate celebrating with confetti" className="graduate-image" />
        </div>
      </div>
    </div>
  );
};

export default SignIn;