import React, { useState } from 'react';
import profilePic from '../assets/profile.png'; 
import NavBar from './NavBar'; 
import HorizontalSidebar from './HorizontalSideBar'; 
import './New-chat.css';

const Newchat = () => {
  const [selectedContact, setSelectedContact] = useState('Dennu Jennifer');
  const contacts = [
    'Rinah N',
    'Ssentumbwe J',
    'Mark Musisi',
    'Dennu Jennifer',
    'Larrie Adrine',
    'Idhe Suhaila',
    'Nathan A',
    'Ampumuzza',
    'Igonga R',
  ];

  return (
    <div className="newchat-page">
      <NavBar />
      <HorizontalSidebar />
      <main className="main-content">
        <div className="content-header">
          <div className="back-button">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 12H5M12 19L5 12L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2>Messages</h2>
        </div>
        <div className="content-body">
          <div className="messages-sidebar">
            <div className="sidebar-search">
              <input type="text" placeholder="Search something here..." />
            </div>
            <div className="contacts-list">
              {contacts.map((name) => (
                <div 
                  className={`contact-item ${selectedContact === name ? 'selected' : ''}`} 
                  key={name}
                  onClick={() => setSelectedContact(name)}
                >
                  <img src={profilePic} alt={name} className="contact-avatar" />
                  <span className="contact-name">{name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="chat-area">
            <div className="chat-header">
              <img src={profilePic} alt={selectedContact} className="chat-header-avatar" />
              <span className="chat-header-name">{selectedContact}</span>
            </div>
            <div className="chat-content">
              {/* Placeholder for chat messages */}
              <div className="no-messages">No messages yet</div>
            </div>
            <div className="chat-input-container">
              <input type="text" placeholder="Type here..." className="chat-input" />
              <button className="attachment-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59723 21.9983 8.005 21.9983C6.41277 21.9983 4.88584 21.3658 3.76 20.24C2.63416 19.1142 2.00166 17.5872 2.00166 15.995C2.00166 14.4028 2.63416 12.8758 3.76 11.75L12.33 3.17997C13.0806 2.42808 14.0991 2.00515 15.16 2.00515C16.2209 2.00515 17.2394 2.42808 17.99 3.17997C18.7419 3.93062 19.1648 4.94916 19.1648 5.99997C19.1648 7.05079 18.7419 8.06933 17.99 8.81997L9.41 17.41C9.03472 17.7853 8.52573 17.9961 7.995 17.9961C7.46427 17.9961 6.95528 17.7853 6.58 17.41C6.20472 17.0347 5.99389 16.5257 5.99389 15.995C5.99389 15.4643 6.20472 14.9553 6.58 14.58L13.07 8.09998" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="send-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Newchat;