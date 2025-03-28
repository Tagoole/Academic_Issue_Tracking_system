import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Messages.css';
import icon from '../assets/box.png';
import Navbar from './NavBar';
import Sidebar from './SideBar';

const Messages = () => {
  const navigate = useNavigate(); 

  const handleNewChatClick = () => {
    navigate('/new-chat'); 
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="messages-view">
          <div className="messages-empty-state">
            <h2>MESSAGES</h2>
            <p>There are no new messages. You will be notified if any</p>
            <div className="icon-container">
              
              <img src={icon} alt="No messages icon" className="icon" />
            </div>
            <button 
              className="new-chat-button" 
              onClick={handleNewChatClick} 
            >
              NEW CHAT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;