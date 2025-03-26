import React from 'react';
import icon from '../assets/parcel-out 1.png';
import './New-Message.css';

const NewMessage = () => {
  return (
    <div className="messaging-container">
      <div className="sidebar">
        <div className="search-bar">
          <input type="text" placeholder="Search something here..." />
        </div>
        <div className="start-chat-section">
          <div className="upload-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
          </div>
          <p>Click on the button below to start a new chat.</p>
        </div>
        <button className="new-chat-button">
          <span>+</span>
        </button>
      </div>
      <div className="chat-area">
        <div className="chat-placeholder">
          <img src={icon} alt="Chat Placeholder Icon" className="chat-placeholder-icon" />
          <p>Select a chat for it to appear here by clicking on it</p>
        </div>
      </div>
    </div>
  );
};

export default NewMessage;