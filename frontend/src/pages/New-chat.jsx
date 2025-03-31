import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './New-chat.css';
import Navbar from './Navbar'; 

const Newchat = () => {
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const contacts = [
    { id: 1, name: 'Nalwoga Ritah', avatar: '/avatar1.jpg' },
    { id: 2, name: 'Richard M', avatar: '/avatar2.jpg' },
    { id: 3, name: 'Musisi Deo', avatar: '/avatar3.jpg' },
    { id: 4, name: 'Mary Jennifer', avatar: '/avatar4.jpg' },
    { id: 5, name: 'Paul Victor', avatar: '/avatar5.jpg' },
    { id: 6, name: 'Idhe Suhaila', avatar: '/avatar6.jpg' },
    { id: 7, name: 'Benson G', avatar: '/avatar7.jpg' },
    { id: 8, name: 'Adrian Mpilima', avatar: '/avatar8.jpg' },
    { id: 9, name: 'Shadrack H', avatar: '/avatar9.jpg' },
  ];

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleContactClick = (contactId) => {
    navigate(`/chat/${contactId}`); // Navigate to a chat page for the selected contact
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <Navbar />
      
      <div className="messaging-container">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-header">
            <div className="back-button" onClick={handleBackClick}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1>Messages</h1>
          </div>
          
          <div className="search-bar">
            <p>Search something here...</p>
            <div className="search-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          
          <div className="contacts-list">
            {contacts.map((contact) => (
              <div 
                key={contact.id} 
                className={`contact-item ${contact.id === 1 ? 'active' : ''}`}
                onClick={() => handleContactClick(contact.id)} // Navigate to the chat page for the selected contact
              >
                <div className="avatar">
                  <img src={contact.avatar} alt={contact.name} />
                </div>
                <div className="contact-name">{contact.name}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Main Chat Area */}
        <div className="chat-area">
          <div className="chat-header">
            <div className="chat-user">
              <div className="avatar">
                <img src="/avatar1.jpg" alt="Nalwoga Ritah" />
              </div>
              <div className="user-name">Nalwoga Ritah</div>
            </div>
          </div>
          
          <div className="chat-messages">
            {/* Messages would go here */}
          </div>
          
          <div className="message-input-container">
            <div className="message-input">
              <p>Type here...</p>
            </div>
            <div className="attachment-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C12 11.4477 12.4477 11 13 11C13.5523 11 14 11.4477 14 12V16C14 16.5523 13.5523 17 13 17C12.4477 17 12 16.5523 12 16V12Z" fill="black"/>
                <path d="M8 13C8.55228 13 9 13.4477 9 14V17C9 17.5523 8.55228 18 8 18C7.44772 18 7 17.5523 7 17V14C7 13.4477 7.44772 13 8 13Z" fill="black"/>
                <path d="M18 14C18 13.4477 17.5523 13 17 13C16.4477 13 16 13.4477 16 14V16C16 16.5523 16.4477 17 17 17C17.5523 17 18 16.5523 18 16V14Z" fill="black"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z" fill="black"/>
              </svg>
            </div>
            <div className="send-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L2 11L22 20V2Z" fill="#00CC2D" stroke="#00CC2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newchat;