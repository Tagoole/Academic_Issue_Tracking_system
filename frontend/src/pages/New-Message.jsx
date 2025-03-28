import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import NavBar from './NavBar';
import HorizontalSideBar from './HorizontalSideBar';
import uploadIcon from '../assets/box.png';
import './New-Message.css';

const NewMessage = () => {
  const navigate = useNavigate(); 

  const handleNewChatClick = () => {
    navigate('/new-chat'); 
  };

  return (
    <div className="messaging-container">
      <NavBar />
      <HorizontalSideBar />
      <div className="messaging-content">
        <div className="messages-sidebar">
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Search for anything..." 
              className="search-input" 
            />
          </div>
          <div className="start-chat-section">
            <div className="uploadicon">
              <img src={uploadIcon} alt="Upload Icon" className="upload-icon-image" />
            </div>
            <p>Click on the button below to start a new chat.</p>
            <button 
              className="new-chat-button" 
              onClick={handleNewChatClick} 
            >
              New Chat
            </button>
          </div>
        </div>
        <div className="chat-area">
          <div className="chat-placeholder">
            <p>Select a chat for it to appear here by clicking on it</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewMessage;