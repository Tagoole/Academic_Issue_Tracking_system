import React, { useState, useRef, useEffect } from 'react';
import profilePic from '../assets/profile.png';
import NavBar from './NavBar';
import Sidebar from './Sidebar';
import './New-chat.css';
import backgroundimage from '../assets/pexels-olia-danilevich-5088017.jpg';


const Newchat = () => {
  const [selectedContact, setSelectedContact] = useState('Dennu Jennifer');
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const chatContentRef = useRef(null);
  
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

  
  useEffect(() => {
    const initialMessages = {};
    contacts.forEach(contact => {
      initialMessages[contact] = [];
    });
    setMessages(initialMessages);
  }, []);

  
  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [messages, selectedContact]);

  const handleSendMessage = () => {
    if (newMessage.trim() || selectedFile) {
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const newMessageObj = {
        text: newMessage.trim(),
        time: currentTime,
        sender: 'me',
        file: selectedFile,
      };

      setMessages(prevMessages => ({
        ...prevMessages,
        [selectedContact]: [...(prevMessages[selectedContact] || []), newMessageObj]
      }));

      // Simulate reply after 1 second
      setTimeout(() => {
        const replyMessage = {
          text: `This is a reply from ${selectedContact}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sender: 'contact'
        };

        setMessages(prevMessages => ({
          ...prevMessages,
          [selectedContact]: [...(prevMessages[selectedContact] || []), replyMessage]
        }));
      }, 1000);

      setNewMessage('');
      setSelectedFile(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="newchat-page">
      <NavBar />
      <Sidebar />
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
                  <div className="contact-info">
                    <span className="contact-name">{name}</span>
                    <span className="contact-preview">
                      {messages[name] && messages[name].length > 0 
                        ? messages[name][messages[name].length - 1].text.substring(0, 25) + (messages[name][messages[name].length - 1].text.length > 25 ? '...' : '') 
                        : 'No messages yet'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="chat-area">
            <div className="chat-header">
              <img src={profilePic} alt={selectedContact} className="chat-header-avatar" />
              <span className="chat-header-name">{selectedContact}</span>
            </div>
            <div className="chat-content" ref={chatContentRef}>
              {messages[selectedContact] && messages[selectedContact].length > 0 ? (
                messages[selectedContact].map((msg, index) => (
                  <div 
                    className={`message ${msg.sender === 'me' ? 'sent' : 'received'}`} 
                    key={index}
                  >
                    {msg.file && (
                      <div className="message-file">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{msg.file.name}</span>
                      </div>
                    )}
                    <div className="message-content">
                      <div className="message-text">{msg.text}</div>
                      <div className="message-time">{msg.time}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-messages">No messages yet</div>
              )}
              {selectedFile && (
                <div className="selected-file-preview">
                  <span>{selectedFile.name}</span>
                  <button onClick={() => setSelectedFile(null)} className="remove-file">×</button>
                </div>
              )}
            </div>
            <div className="chat-input-container">
              <input 
                type="text" 
                placeholder="Type here..." 
                className="chat-input" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <button className="attachment-button" onClick={handleFileSelect}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59723 21.9983 8.005 21.9983C6.41277 21.9983 4.88584 21.3658 3.76 20.24C2.63416 19.1142 2.00166 17.5872 2.00166 15.995C2.00166 14.4028 2.63416 12.8758 3.76 11.75L12.33 3.17997C13.0806 2.42808 14.0991 2.00515 15.16 2.00515C16.2209 2.00515 17.2394 2.42808 17.99 3.17997C18.7419 3.93062 19.1648 4.94916 19.1648 5.99997C19.1648 7.05079 18.7419 8.06933 17.99 8.81997L9.41 17.41C9.03472 17.7853 8.52573 17.9961 7.995 17.9961C7.46427 17.9961 6.95528 17.7853 6.58 17.41C6.20472 17.0347 5.99389 16.5257 5.99389 15.995C5.99389 15.4643 6.20472 14.9553 6.58 14.58L13.07 8.09998" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="send-button" onClick={handleSendMessage}>
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