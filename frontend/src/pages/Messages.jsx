import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Messages.css';
import icon from '../assets/box.png';
import NavBar from './NavBar';
import backgroundimage from '../assets/pexels-olia-danilevich-5088017.jpg';


const Messages = () => {
  const navigate = useNavigate(); 

  const handleNewChatClick = () => {
    navigate('/new-chat'); 
  };

  return (
    <div
      className="app-container"
      style={{

        backgroundImage: `url(${backgroundimage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',

      }}
    >
      <NavBar />
      <div className="main-content">
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
