import React, { useState } from 'react';
import './verification.css'; 

const EmailVerification = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState('user@example.com'); 

  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Verification Code:', verificationCode);
  };

  return (
    <div className="container">
      <h2>Email Verification</h2>
      <p>Enter the verification code we sent to you on</p>
      <p>{email}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={verificationCode}
          onChange={handleVerificationCodeChange}
          placeholder="Verification Code"
          className="input"
        />
        <button type="submit" className="button">Next</button>
      </form>
      <button className="sign-in-button">Sign In</button>
    </div>
  );
};

export default EmailVerification;
