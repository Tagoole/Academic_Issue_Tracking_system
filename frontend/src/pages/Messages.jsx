import React, { useState, useEffect } from 'react';
import './Messages.css';
import { useNavigate } from 'react-router-dom';

const Messages = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newContactUsername, setNewContactUsername] = useState('');
  const [drafts, setDrafts] = useState({});
  const [messages, setMessages] = useState({});
  const [unreadMessages, setUnreadMessages] = useState({});
  const [notification, setNotification] = useState(null); // State for notification
  const navigate = useNavigate();

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedContacts = localStorage.getItem('chatContacts');
    const storedMessages = localStorage.getItem('chatMessages');
    const storedDrafts = localStorage.getItem('messageDrafts');
    const storedUnread = localStorage.getItem('unreadMessages');

    if (storedContacts) setContacts(JSON.parse(storedContacts));
    if (storedMessages) setMessages(JSON.parse(storedMessages));
    if (storedDrafts) setDrafts(JSON.parse(storedDrafts));
    if (storedUnread) setUnreadMessages(JSON.parse(storedUnread));
  }, []);

  // Save data to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatContacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('messageDrafts', JSON.stringify(drafts));
  }, [drafts]);

  useEffect(() => {
    localStorage.setItem('unreadMessages', JSON.stringify(unreadMessages));
  }, [unreadMessages]);

  // When selecting a contact, load their draft message if any
  useEffect(() => {
    if (selectedContact) {
      // Mark messages as read when selecting the contact
      setUnreadMessages(prev => ({
        ...prev,
        [selectedContact.id]: 0
      }));
      
      // Load draft if exists
      if (drafts[selectedContact.id]) {
        setMessageInput(drafts[selectedContact.id]);
      } else {
        setMessageInput('');
      }
    }
  }, [selectedContact]);

  // Save draft when typing
  const handleMessageChange = (e) => {
    const value = e.target.value;
    setMessageInput(value);
    
    if (selectedContact) {
      setDrafts(prev => ({
        ...prev,
        [selectedContact.id]: value
      }));
    }
  };

  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!messageInput.trim() || !selectedContact) return;
    
    const newMessage = {
      id: Date.now().toString(),
      senderId: 'currentUser', // In a real app, get this from auth context/state
      text: messageInput,
      timestamp: new Date().toISOString()
    };
    
    // Add message to conversation
    setMessages(prev => {
      const contactMessages = prev[selectedContact.id] || [];
      return {
        ...prev,
        [selectedContact.id]: [...contactMessages, newMessage]
      };
    });
    
    // Update last message in contacts list
    setContacts(prev => 
      prev.map(contact => {
        if (contact.id === selectedContact.id) {
          return {
            ...contact,
            lastMessage: messageInput,
            timestamp: new Date().toISOString()
          };
        }
        return contact;
      })
    );
    
    // Clear message input and draft
    setMessageInput('');
    setDrafts(prev => {
      const newDrafts = {...prev};
      delete newDrafts[selectedContact.id];
      return newDrafts;
    });
    
    // Show "Message Sent" notification
    setNotification('Message Sent');
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);

    // Simulate receiving a response after 2 seconds
    setTimeout(() => {
      simulateReceivedMessage(selectedContact.id, `Reply from ${selectedContact.name}`);
    }, 2000);
  };

  // Function to simulate receiving a message
  const simulateReceivedMessage = (contactId, text) => {
    const newMessage = {
      id: Date.now().toString(),
      senderId: contactId,
      text: text,
      timestamp: new Date().toISOString()
    };
    
    // Add message to conversation
    setMessages(prev => {
      const contactMessages = prev[contactId] || [];
      return {
        ...prev,
        [contactId]: [...contactMessages, newMessage]
      };
    });
    
    // Update last message in contacts list
    setContacts(prev => 
      prev.map(contact => {
        if (contact.id === contactId) {
          return {
            ...contact,
            lastMessage: text,
            timestamp: new Date().toISOString()
          };
        }
        return contact;
      })
    );
    
    // Increment unread messages count if it's not the selected contact
    if (!selectedContact || selectedContact.id !== contactId) {
      setUnreadMessages(prev => ({
        ...prev,
        [contactId]: (prev[contactId] || 0) + 1
      }));
    }
  };

  // Create a new chat
  const handleCreateNewChat = () => {
    if (!newContactUsername.trim()) return;
    
    // In a real app, you would validate the username exists in your system
    const newContact = {
      id: Date.now().toString(),
      name: newContactUsername,
      username: newContactUsername.toLowerCase(),
      lastMessage: "",
      timestamp: new Date().toISOString()
    };
    
    setContacts(prev => [newContact, ...prev]);
    setSelectedContact(newContact);
    setShowNewChatModal(false);
    setNewContactUsername('');
  };

  // Filter contacts by search term
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort contacts by most recent message
  const sortedContacts = [...filteredContacts].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  // Get total unread message count for navbar indicator
  const totalUnreadCount = Object.values(unreadMessages).reduce((sum, count) => sum + count, 0);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="messages-page">
      {/* Left sidebar with contacts */}
      <div className="contacts-sidebar">
        <div className="sidebar-header">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search contacts"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="search-icon"> 
            </div>
          </div>
          <button className="new-chat-btn" onClick={() => setShowNewChatModal(true)}>
            NEW CHAT
          </button>
        </div>

        <div className="contacts-list">
          {contacts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"></div>
              <p>No chats yet</p>
              <p>Start a new conversation</p>
            </div>
          ) : (
            sortedContacts.map(contact => (
              <div
                key={contact.id}
                className={`contact-item ${selectedContact?.id === contact.id ? 'selected' : ''}`}
                onClick={() => setSelectedContact(contact)}
              >
                <div className="contact-avatar">
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div className="contact-info">
                  <div className="contact-name">{contact.name}</div>
                  <div className="contact-last-message">
                    {contact.lastMessage || "No messages yet"}
                  </div>
                </div>
                <div className="contact-meta">
                  {contact.timestamp && (
                    <div className="contact-time">
                      {new Date(contact.timestamp).toLocaleDateString()}
                    </div>
                  )}
                  {unreadMessages[contact.id] > 0 && (
                    <div className="unread-badge">{unreadMessages[contact.id]}</div>
                  )}
                  {drafts[contact.id] && (
                    <div className="draft-indicator">Draft</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right side chat area */}
      <div className="chat-area">
        {selectedContact ? (
          <>
            <div className="chat-header">
              <div className="chat-contact-info">
                <div className="contact-avatar large">
                  {selectedContact.name.charAt(0).toUpperCase()}
                </div>
                <div className="contact-name">{selectedContact.name}</div>
              </div>
            </div>

            <div className="messages-container">
              {messages[selectedContact.id]?.length > 0 ? (
                messages[selectedContact.id].map(message => (
                  <div
                    key={message.id}
                    className={`message ${message.senderId === 'currentUser' ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">{message.text}</div>
                    <div className="message-time">{formatTime(message.timestamp)}</div>
                  </div>
                ))
              ) : (
                <div className="empty-chat-state">
                  <p>No messages yet</p>
                  <p>Send a message to start the conversation</p>
                </div>
              )}
            </div>

            {notification && (
              <div className="notification">
                {notification}
              </div>
            )}

            <form className="message-input-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Type a message..."
                value={messageInput}
                onChange={handleMessageChange}
                className="message-input"
              />
              <button 
                type="submit" 
                className="send-button"
                disabled={!messageInput.trim()}
              >
                
                
                
              
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <div className="empty-state">
              <div className="empty-icon large">💬</div>
              <h2>Select a chat or start a new conversation</h2>
              <button 
                className="new-chat-btn large"
                onClick={() => setShowNewChatModal(true)}
              >
                START NEW CHAT
              </button>
            </div>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Start a New Chat</h2>
            <div className="modal-form">
              <input
                type="text"
                placeholder="Enter username"
                value={newContactUsername}
                onChange={(e) => setNewContactUsername(e.target.value)}
              />
              <div className="modal-buttons">
                <button 
                  className="cancel-button"
                  onClick={() => {
                    setShowNewChatModal(false);
                    setNewContactUsername('');
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="start-chat-button"
                  onClick={handleCreateNewChat}
                  disabled={!newContactUsername.trim()}
                >
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
