import React, { useState, useEffect } from 'react';
import './Messages.css';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const Messages = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [messages, setMessages] = useState({});
  const [unreadMessages, setUnreadMessages] = useState({});
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [lecturers, setLecturers] = useState([]);
  const [registrars, setRegistrars] = useState([]);
  const navigate = useNavigate();

  // Authentication check when component mounts
  useEffect(() => {
    const checkAuth = () => {
      const accessToken = localStorage.getItem('accessToken');
      // If no access token is available, redirect to login
      if (!accessToken) {
        navigate('/signin');
        return false;
      }
      return true;
    };

    // Fetch data only if authentication check passes
    if (checkAuth()) {
      fetchConversations();
      fetchLecturers();
      fetchRegistrars();
      loadDataFromStorage();
    }
  }, [navigate]);

  // Fetch lecturers from API
  const fetchLecturers = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      const response = await API.get('/api/get_lecturers/');
      setLecturers(response.data);
    } catch (err) {
      console.error('Error fetching lecturers:', err);
      handleApiError(err);
    }
  };

  // Fetch registrars from API
  const fetchRegistrars = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      const response = await API.get('/api/get_registrars/');
      setRegistrars(response.data);
    } catch (err) {
      console.error('Error fetching registrars:', err);
      handleApiError(err);
    }
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      const response = await API.get('/api/conversations/');
      
      // Process conversations into contacts format
      const processedContacts = response.data.map(conversation => ({
        id: conversation.id,
        name: conversation.other_user.name || conversation.other_user.username,
        username: conversation.other_user.username,
        lastMessage: conversation.last_message?.content || "",
        timestamp: conversation.last_message?.timestamp || conversation.created_at,
        userId: conversation.other_user.id,
        unreadCount: conversation.unread_count || 0
      }));
      
      setContacts(processedContacts);
      
      // Update unread messages state
      const unreadCounts = {};
      processedContacts.forEach(contact => {
        if (contact.unreadCount > 0) {
          unreadCounts[contact.id] = contact.unreadCount;
        }
      });
      setUnreadMessages(unreadCounts);
      
      setConversations(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      handleApiError(err);
      setLoading(false);
    }
  };

  // Fetch messages for a specific conversation
  const fetchMessages = async (conversationId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      const response = await API.get(`/api/conversations/${conversationId}/messages/`);
      
      // Process messages
      const processedMessages = response.data.map(message => ({
        id: message.id,
        senderId: message.sender.id, // We'll compare this with current user's ID
        text: message.content,
        timestamp: message.timestamp
      }));
      
      // Update messages state
      setMessages(prev => ({
        ...prev,
        [conversationId]: processedMessages
      }));
      
      // Mark messages as read if this is the selected conversation
      if (selectedContact && selectedContact.id === conversationId) {
        markMessagesAsRead(conversationId);
      }
      
    } catch (err) {
      console.error(`Error fetching messages for conversation ${conversationId}:`, err);
      handleApiError(err);
    }
  };

  // Mark messages as read
  const markMessagesAsRead = async (conversationId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      await API.post(`/api/conversations/${conversationId}/mark_read/`);
      
      // Update local unread count
      setUnreadMessages(prev => ({
        ...prev,
        [conversationId]: 0
      }));
      
    } catch (err) {
      console.error(`Error marking messages as read for conversation ${conversationId}:`, err);
      handleApiError(err);
    }
  };

  // Load drafts from localStorage
  const loadDataFromStorage = () => {
    try {
      const storedDrafts = localStorage.getItem('messageDrafts');
      if (storedDrafts) setDrafts(JSON.parse(storedDrafts));
    } catch (err) {
      console.error('Error loading drafts:', err);
    }
  };

  // Handle API errors including token refresh
  const handleApiError = async (err) => {
    if (err.response && err.response.status === 401) {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          const refreshResponse = await API.post('/api/refresh_token/', {
            refresh: refreshToken
          });
          
          // Store the new access token
          const newAccessToken = refreshResponse.data.access;
          localStorage.setItem('accessToken', newAccessToken);
          
          // Retry fetching data
          fetchConversations();
          fetchLecturers();
          fetchRegistrars();
        } else {
          navigate('/signin');
        }
      } catch (refreshErr) {
        console.error('Error refreshing token:', refreshErr);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/signin');
      }
    } else {
      setError('An error occurred. Please try again later.');
    }
  };

  // Save drafts to localStorage when they change
  useEffect(() => {
    localStorage.setItem('messageDrafts', JSON.stringify(drafts));
  }, [drafts]);

  // When selecting a contact, load their draft message if any and fetch messages
  useEffect(() => {
    if (selectedContact) {
      // Load draft if exists
      if (drafts[selectedContact.id]) {
        setMessageInput(drafts[selectedContact.id]);
      } else {
        setMessageInput('');
      }
      
      // Fetch messages for this conversation
      fetchMessages(selectedContact.id);
      
      // Mark messages as read
      if (unreadMessages[selectedContact.id] > 0) {
        markMessagesAsRead(selectedContact.id);
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
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageInput.trim() || !selectedContact) return;
    
    try {
      // Get access token
      const accessToken = localStorage.getItem('accessToken');
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      // Send message to API
      await API.post('/api/messages/', { 
        conversation_id: selectedContact.id,
        content: messageInput
      });
      
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
      
      // Refresh messages for this conversation
      fetchMessages(selectedContact.id);
      
      // Also refresh conversations list to get updated last message
      fetchConversations();
      
    } catch (err) {
      console.error('Error sending message:', err);
      handleApiError(err);
      setError('Failed to send message. Please try again.');
    }
  };

  // Search for users
  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      setSearchLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      const response = await API.get(`/api/users/search/?query=${encodeURIComponent(query)}`);
      setSearchResults(response.data);
      setSearchLoading(false);
    } catch (err) {
      console.error('Error searching users:', err);
      handleApiError(err);
      setSearchLoading(false);
    }
  };

  // Debounce search input
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      searchUsers(searchTerm);
    }, 500);
    
    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  // Start a chat with a user
  const startChatWithUser = async (user) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      // Check if conversation already exists
      const existingConversation = conversations.find(c => 
        c.other_user.id === user.id
      );
      
      if (existingConversation) {
        // Find corresponding contact
        const existingContact = contacts.find(c => c.id === existingConversation.id);
        if (existingContact) {
          setSelectedContact(existingContact);
        }
      } else {
        // Create new conversation
        const response = await API.post('/api/conversations/', {
          user_id: user.id
        });
        
        // Refresh conversations to include the new one
        await fetchConversations();
        
        // Select the new conversation
        const newConversation = response.data;
        const newContact = {
          id: newConversation.id,
          name: user.name || user.username,
          username: user.username,
          lastMessage: "",
          timestamp: newConversation.created_at,
          userId: user.id
        };
        
        setSelectedContact(newContact);
      }
      
      // Close modal if open
      setShowNewChatModal(false);
      
    } catch (err) {
      console.error('Error starting chat:', err);
      handleApiError(err);
    }
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

  // Get total unread message count
  const totalUnreadCount = Object.values(unreadMessages).reduce((sum, count) => sum + count, 0);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <div className="loading-message">Loading chats...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

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
          <button className="new-chat-btn">
            CHATS
          </button>
        </div>

        {/* Display Lecturers Section */}
        <div className="user-category-section">
          <h3>Lecturers</h3>
          <div className="user-list">
            {lecturers.length > 0 ? (
              lecturers.map(lecturer => (
                <div 
                  key={lecturer.id}
                  className="user-item"
                  onClick={() => startChatWithUser(lecturer)}
                >
                  <div className="user-name">{lecturer.name || lecturer.username}</div>
                </div>
              ))
            ) : (
              <div className="empty-user-list">Loading...</div>
            )}
          </div>
        </div>

        {/* Display Registrars Section */}
        <div className="user-category-section">
          <h3>Registrars</h3>
          <div className="user-list">
            {registrars.length > 0 ? (
              registrars.map(registrar => (
                <div 
                  key={registrar.id}
                  className="user-item"
                  onClick={() => startChatWithUser(registrar)}
                >
                  <div className="user-name">{registrar.name || registrar.username}</div>
                </div>
              ))
            ) : (
              <div className="empty-user-list">Loading...</div>
            )}
          </div>
        </div>

        {/* Search results if searching */}
        {searchTerm && searchResults.length > 0 && (
          <div className="search-results">
            <h3>Search Results</h3>
            {searchResults.map(user => (
              <div 
                key={user.id}
                className="user-item"
                onClick={() => startChatWithUser(user)}
              >
                <div className="user-name">{user.name || user.username}</div>
              </div>
            ))}
          </div>
        )}

        <div className="contacts-list">
          {contacts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"></div>
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
                messages[selectedContact.id].map(message => {
                  // Determine if message is from current user (you'll need to get current user ID)
                  const currentUserId = localStorage.getItem('userId');
                  const isCurrentUser = message.senderId === currentUserId;
                  
                  return (
                    <div
                      key={message.id}
                      className={`message ${isCurrentUser ? 'sent' : 'received'}`}
                    >
                      <div className="message-content">{message.text}</div>
                      <div className="message-time">{formatTime(message.timestamp)}</div>
                    </div>
                  );
                })
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