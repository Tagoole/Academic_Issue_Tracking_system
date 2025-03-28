import React, { useState } from 'react';
import Navbar from './NavBar'; 
import './New-chat.css'; 

const contacts = [
  'Nimurungi Joy',
  'Kato Jeromy',
  'Rukindo John',
  'Mwebaze Keith',
  'Jemba Michelle',
  'Kirabo Rose',
  'Kimuli Jess',
  'Akol Jasper'
];

const Newchat = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = contacts.filter(contact => 
    contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <Navbar />
      <div className="main-content">
        <div className="sidebar">
          <input 
            type="text" 
            placeholder="Search" 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="contact-list">
            {filteredContacts.map((contact) => (
              <div 
                key={contact} 
                className={`contact-item ${selectedContact === contact ? 'selected' : ''}`}
                onClick={() => setSelectedContact(contact)}
              >
                <div className="contact-avatar"></div>
                <span>{contact}</span>
              </div>
            ))}
          </div>
          <button className="new-chat-btn">NEW CHAT</button>
        </div>
        <div className="chat-area">
          {selectedContact && (
            <div className="chat-header">
              <h2>{selectedContact}</h2>
            </div>
          )}
          <div className="chat-messages"></div>
          <div className="message-input-container">
            <input 
              type="text" 
              placeholder="Type here" 
              className="message-input"
            />
            <button className="send-btn">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newchat;
