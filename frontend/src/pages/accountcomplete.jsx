import React from 'react';
import './accountComplete.css';

const AccountSetupComplete = ({ onContinue }) => {
  return (
    <div className="account-setup-complete-container">
      <div className="glassmorphic-modal">
        <h1 className="completion-header">ACCOUNT SETUP </h1>
        <h2>COMPLETE!</h2>
        <p className="completion-subtext">
          Your account is all set with us and ready for use.
        </p>
        <button 
          className="continue-button" 
          onClick={onContinue}
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
};

export default AccountSetupComplete;
