import React from 'react';
import './DeleteAccount.css';

const DeleteAccount = ({ onCancel, onDelete }) => {
  return (
    <div className="page-container">
      <div className="delete-overlay">
        <h1 className="delete-title">Delete Account</h1>
        
        <p className="delete-message">
          This will permanently delete your account.
        </p>
        
        <div className="button-container">
          <button 
            className="action-button cancel-button" 
            onClick={onCancel}
          >
            CANCEL
          </button>
          
          <button 
            className="action-button delete-button" 
            onClick={onDelete}
          >
            DELETE
          </button>
        </div>
        
        <a href="#" className="help-link">Need Help?</a>
      </div>
    </div>
  );
};

export default DeleteAccount;
