import React, { useState, useEffect, useRef } from 'react';
import './Messages.css';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const Messages = () => {
  // State variables
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messageInput, setMessageInput] = useState('');
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
  const [students, setStudents] = useState([]);
  const [newContactUsername, setNewContactUsername] = useState('');
  const [refreshKey, setRefreshKey] = useState(0); // To force re-renders
  const [currentUsername, setCurrentUsername] = useState(''); // Store current user's username
  const [localSearchResults, setLocalSearchResults] = useState([]); // For local search results

  // Refs
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Authentication check when component mounts
  useEffect(() => {
    const checkAuth = () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        navigate('/signin');
        return false;
      }
      return true;
    };

    if (checkAuth()) {
      // Get current username from localStorage
      const userName = localStorage.getItem('userName');
      if (userName) {
        setCurrentUsername(userName);
      }
      
      fetchData();
      const interval = setInterval(fetchUnreadCounts, 30000); // Check for unread messages every 30 seconds
      return () => clearInterval(interval);
    }
  }, [navigate, refreshKey]); // Added refreshKey to dependencies to trigger refetch on refresh

  // Fetch all necessary data
  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchConversations(),
        fetchLecturers(),
        fetchRegistrars(),
        fetchStudents(),
        loadDataFromStorage()
      ]);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching initial data:', err);
      handleApiError(err);
      setLoading(false);
    }
  };

  // Fetch students from API
  const fetchStudents = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      const response = await API.get('/api/get_students/');
      
      // Get current username to filter out current user
      const userName = localStorage.getItem('userName');
      
      // Filter out current user from students list
      const filteredStudents = response.data ? response.data.filter(student => 
        student.username !== userName
      ) : [];
      
      setStudents(filteredStudents);
    } catch (err) {
      console.error('Error fetching students:', err);
      handleApiError(err);
      setStudents([]); // Set empty array on error
    }
  };

  // Fetch lecturers from API
  const fetchLecturers = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      const response = await API.get('/api/get_lecturers/');
      
      // Get current username to filter out current user
      const userName = localStorage.getItem('userName');
      
      // Filter out current user from lecturers list
      const filteredLecturers = response.data ? response.data.filter(lecturer => 
        lecturer.username !== userName
      ) : [];
      
      setLecturers(filteredLecturers);
    } catch (err) {
      console.error('Error fetching lecturers:', err);
      handleApiError(err);
      setLecturers([]); // Set empty array on error
    }
  };

  // Fetch registrars from API
  const fetchRegistrars = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      const response = await API.get('/api/get_registrars/');
      
      // Get current username to filter out current user
      const userName = localStorage.getItem('userName');
      
      // Filter out current user from registrars list
      const filteredRegistrars = response.data ? response.data.filter(registrar => 
        registrar.username !== userName
      ) : [];
      
      setRegistrars(filteredRegistrars);
    } catch (err) {
      console.error('Error fetching registrars:', err);
      handleApiError(err);
      setRegistrars([]); // Set empty array on error
    }
  };

  // Fetch unread message counts
  const fetchUnreadCounts = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      const response = await API.get('/api/messages/unread_count/');
      if (response.data.unread_count > 0) {
        // Only refresh conversations if there are new messages
        fetchConversations();
      }
    } catch (err) {
      console.error('Error fetching unread counts:', err);
      handleApiError(err);
    }
  };

  // Fetch conversations list
  const fetchConversations = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      const response = await API.get('/api/conversations/');
      const conversationsData = response.data || [];
      
      // Process conversations into contacts format with better error handling
      const processedContacts = conversationsData.map(conversation => {
        // Make sure we have a valid other_user object
        const otherUser = conversation.other_user || {};
        
        return {
          id: conversation.id,
          name: otherUser.name || otherUser.username || 'Unknown User',
          username: otherUser.username || '',
          lastMessage: conversation.last_message?.content || "",
          timestamp: conversation.last_message?.timestamp || conversation.created_at || new Date().toISOString(),
          userId: otherUser.id || null, // Make sure userId is never undefined
          unreadCount: conversation.unread_count || 0
        };
      });
      
      // Filter out contacts with no userId (invalid data)
      const validContacts = processedContacts.filter(contact => contact.userId !== null);
      
      setContacts(validContacts);
      
      // Update unread messages state
      const unreadCounts = {};
      validContacts.forEach(contact => {
        if (contact.unreadCount > 0) {
          unreadCounts[contact.id] = contact.unreadCount;
        }
      });
      setUnreadMessages(unreadCounts);
      
      setConversations(conversationsData);
      
      // If a conversation was selected, update it with fresh data
      if (selectedContact) {
        const updatedContact = validContacts.find(c => c.id === selectedContact.id);
        if (updatedContact) {
          setSelectedContact(updatedContact);
        }
      }

    } catch (err) {
      console.error('Error fetching conversations:', err);
      handleApiError(err);
    }
  };

  // Fetch messages for a specific conversation
  const fetchMessages = async (conversationId) => {
    if (!conversationId) return;
    
    try {
      const accessToken = localStorage.getItem('accessToken');
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      const response = await API.get(`/api/conversations/${conversationId}/messages/`);
      const messagesData = response.data || [];
      
      // Get current user id for message direction
      const currentUserId = localStorage.getItem('userId');
      
      // Process messages
      const processedMessages = messagesData.map(message => ({
        id: message.id,
        senderId: message.sender?.id || '',
        text: message.content || '',
        timestamp: message.timestamp || new Date().toISOString(),
        isCurrentUser: message.sender?.id === currentUserId
      }));
      
      // Update messages state
      setMessages(prev => ({
        ...prev,
        [conversationId]: processedMessages
      }));
      
      // Scroll to bottom of messages
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      
    } catch (err) {
      console.error(`Error fetching messages for conversation ${conversationId}:`, err);
      handleApiError(err);
      // Initialize with empty array on error
      setMessages(prev => ({
        ...prev,
        [conversationId]: []
      }));
    }
  };

  // Mark messages as read
  const markMessagesAsRead = async (conversationId) => {
    if (!conversationId) return;
    
    try {
      const accessToken = localStorage.getItem('accessToken');
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      await API.post(`/api/conversations/${conversationId}/mark_read/`);
      
      // Update local unread count
      setUnreadMessages(prev => {
        const updated = { ...prev };
        delete updated[conversationId];
        return updated;
      });
      
    } catch (err) {
      console.error(`Error marking messages as read for conversation ${conversationId}:`, err);
      handleApiError(err);
    }
  };

  // Load drafts from localStorage
  const loadDataFromStorage = () => {
    try {
      const storedDrafts = localStorage.getItem('messageDrafts');
      if (storedDrafts) {
        const parsedDrafts = JSON.parse(storedDrafts);
        setDrafts(parsedDrafts || {});
      }
    } catch (err) {
      console.error('Error loading drafts:', err);
      setDrafts({});
    }
  };

  // Handle API errors including token refresh
  const handleApiError = async (err) => {
    // Check if error is unauthorized
    if (err.response && err.response.status === 401) {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          // Try to refresh token
          const refreshResponse = await API.post('/api/refresh_token/', {
            refresh: refreshToken
          });
          
          // Store the new access token
          const newAccessToken = refreshResponse.data.access;
          localStorage.setItem('accessToken', newAccessToken);
          
          // Retry fetching data
          fetchData();
        } else {
          // No refresh token, redirect to login
          clearStorage();
          navigate('/signin');
        }
      } catch (refreshErr) {
        console.error('Error refreshing token:', refreshErr);
        clearStorage();
        navigate('/signin');
      }
    } else if (err.response) {
      // Handle other API errors
      setError(`Error: ${err.response.data?.error || err.response.statusText || 'Unknown error'}`);
      
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    } else {
      // Network or other errors
      setError('Network error. Please check your connection and try again.');
      
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    }
  };
  
  // Clear local storage on logout
  const clearStorage = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
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
  }, [selectedContact, drafts, unreadMessages]);

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

  const handleSendMessage = async (e) => {
    e.preventDefault(); // This prevents default form submission behavior
    
    if (!messageInput.trim() || !selectedContact) return;
    
    try {
      // Get access token
      const accessToken = localStorage.getItem('accessToken');
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      // Data to send
      let messageData = { content: messageInput.trim() };
      
      // Store the current contact ID for refreshing later
      const currentContactId = selectedContact.id;
      
      // If we have a userId, use receiver_id approach
      if (selectedContact.userId) {
        messageData.receiver_id = selectedContact.userId;
      } else {
        // Fallback to conversation_id approach
        messageData.conversation_id = selectedContact.id;
      }
      
      // Clear input and draft immediately (before API call)
      setMessageInput('');
      setDrafts(prev => {
        const newDrafts = {...prev};
        delete newDrafts[currentContactId];
        return newDrafts;
      });
      
      // Send message to API
      await API.post('/api/messages/', messageData);
      
      // Show notification
      setNotification('Message Sent');
      setTimeout(() => {
        setNotification(null);
      }, 2000);
      
      // Increment the refresh key to force a complete re-render of the component
      setRefreshKey(prevKey => prevKey + 1);
      
      // After a brief delay to allow component to re-render, fetch fresh messages
      setTimeout(() => {
        // If the selected contact is still the same after refresh
        if (selectedContact && selectedContact.id === currentContactId) {
          // Refresh messages for this specific conversation
          fetchMessages(currentContactId);
        }
      }, 100);
      
    } catch (err) {
      console.error('Error sending message:', err);
      
      // Silently refresh everything on error without showing error to user
      setRefreshKey(prevKey => prevKey + 1);
    }
  };

  // NEW FUNCTION: Search locally among available users
  const searchLocalUsers = (query) => {
    if (!query.trim()) {
      setLocalSearchResults([]);
      return;
    }
    
    // Normalize query for case-insensitive search
    const normalizedQuery = query.trim().toLowerCase();
    
    // Combine all users into one array
    const allUsers = [
      ...lecturers.map(user => ({...user, type: 'Lecturer'})),
      ...registrars.map(user => ({...user, type: 'Registrar'})),
      ...students.map(user => ({...user, type: 'Student'}))
    ];
    
    // Filter users that match query in name or username
    const matchedUsers = allUsers.filter(user => {
      const name = (user.name || '').toLowerCase();
      const username = (user.username || '').toLowerCase();
      return name.includes(normalizedQuery) || username.includes(normalizedQuery);
    });
    
    setLocalSearchResults(matchedUsers);
  };

  // Search for users with debounce
  const searchUsers = async (query) => {
    if (!query.trim() || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    
    // First, search locally for immediate feedback
    searchLocalUsers(query);
    
    try {
      setSearchLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      const response = await API.get(`/api/users/search/?query=${encodeURIComponent(query.trim())}`);
      
      // Filter out current user from search results
      const userName = localStorage.getItem('userName');
      const filteredResults = response.data ? response.data.filter(user => 
        user.username !== userName
      ) : [];
      
      setSearchResults(filteredResults);
      setSearchLoading(false);
    } catch (err) {
      console.error('Error searching users:', err);
      handleApiError(err);
      setSearchResults([]);
      setSearchLoading(false);
    }
  };

  // Start a chat with a user, handling both new and existing conversations
  const startChatWithUser = async (user) => {
    if (!user || !user.id) {
      setError('Invalid user data');
      return;
    }

    try {
      setLoading(true); // Show loading while processing
      const accessToken = localStorage.getItem('accessToken');
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      // First try to find if conversation already exists with this user
      let existingContact = contacts.find(c => c.userId === user.id);
      
      if (existingContact) {
        // Conversation exists, just select it
        setSelectedContact(existingContact);
      } else {
        // Create new conversation
        const response = await API.post('/api/conversations/', {
          user_id: user.id
        });
        
        if (!response.data || !response.data.id) {
          throw new Error('Invalid response from server');
        }
        
        // Create a temporary contact with the data we have
        const tempContact = {
          id: response.data.id,
          name: user.name || user.username || 'User',
          username: user.username || '',
          lastMessage: "",
          timestamp: new Date().toISOString(),
          userId: user.id,
          unreadCount: 0
        };
        
        // Set selected contact immediately so UI responds quickly
        setSelectedContact(tempContact);
        
        // Then refresh conversations to get the full data
        await fetchConversations();
      }

      // Close modal if open
      setShowNewChatModal(false);
      setNewContactUsername('');
      setLocalSearchResults([]); 
      setLoading(false);
      
    } catch (err) {
      console.error('Error starting chat:', err);
      handleApiError(err);
      setLoading(false);
    }
  };

  // Create new chat from modal
  const handleCreateNewChat = async () => {
    if (!newContactUsername.trim()) return;
    
    try {
      setLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      // Check if we have local results to use
      if (localSearchResults.length > 0) {
        // Use the first local result
        await startChatWithUser(localSearchResults[0]);
      } else {
        // Search for user by username
        const response = await API.get(`/api/users/search/?query=${encodeURIComponent(newContactUsername.trim())}`);
        
        if (response.data && response.data.length > 0) {
          const user = response.data[0];
          await startChatWithUser(user);
        } else {
          setError('User not found');
        }
      }
      setLoading(false);
    } catch (err) {
      console.error('Error creating new chat:', err);
      handleApiError(err);
      setLoading(false);
    }
    
    // Reset input and close modal
    setNewContactUsername('');
    setLocalSearchResults([]);
    setShowNewChatModal(false);
  };

  // Open new chat modal and reset search state
  const openNewChatModal = () => {
    setShowNewChatModal(true);
    setNewContactUsername('');
    setLocalSearchResults([]);
    setSearchResults([]);
  };

  // Get total unread message count
  const totalUnreadCount = Object.values(unreadMessages).reduce((sum, count) => sum + count, 0);

  // Format timestamps for display
  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  // Loading state
  if (loading && !selectedContact) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-message">Loading conversations...</div>
      </div>
    );
  }

  return (
    <div className="messages-page" key={refreshKey}>
      {/* Left sidebar with user categories */}
      <div className="contacts-sidebar">
        <div className="sidebar-header">
          <button 
            className="new-chat-btn"
            onClick={openNewChatModal}
          >
            NEW CHAT {totalUnreadCount > 0 && <span className="total-unread">({totalUnreadCount})</span>}
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
                  className="user-item chat-link"
                  onClick={() => startChatWithUser(lecturer)}
                >
                  <div className="user-avatar">
                    {(lecturer.name || lecturer.username || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="user-name">{lecturer.name || lecturer.username || 'Unknown'}</div>
                </div>
              ))
            ) : (
              <div className="empty-user-list">No lecturers available</div>
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
                  className="user-item chat-link"
                  onClick={() => startChatWithUser(registrar)}
                >
                  <div className="user-avatar">
                    {(registrar.name || registrar.username || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="user-name">{registrar.name || registrar.username || 'Unknown'}</div>
                </div>
              ))
            ) : (
              <div className="empty-user-list">No registrars available</div>
            )}
          </div>
        </div>

        {/* Display Students Section */}
        <div className="user-category-section">
          <h3>Students</h3>
          <div className="user-list">
            {students.length > 0 ? (
              students.map(student => (
                <div 
                  key={student.id}
                  className="user-item chat-link"
                  onClick={() => startChatWithUser(student)}
                >
                  <div className="user-avatar">
                    {(student.name || student.username || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="user-name">{student.name || student.username || 'Unknown'}</div>
                </div>
              ))
            ) : (
              <div className="empty-user-list">No students available</div>
            )}
          </div>
        </div>
      </div>

      {/* Right side chat area */}
      <div className="chat-area">
        {selectedContact ? (
          <>
            <div className="chat-header">
              <div className="chat-contact-info">
                <div className="contact-avatar large">
                  {(selectedContact.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="contact-details">
                  <div className="contact-name">{selectedContact.name || selectedContact.username || 'Unknown'}</div>
                  {selectedContact.username && selectedContact.name && (
                    <div className="contact-username">@{selectedContact.username}</div>
                  )}
                </div>
              </div>
              <div className="chat-actions">
                <button className="refresh-chat" onClick={() => fetchMessages(selectedContact.id)}>
                  <span className="refresh-icon">↻</span>
                </button>
              </div>
            </div>

            <div className="messages-container">
              {loading ? (
                <div className="loading-messages">
                  <div className="loading-spinner small"></div>
                  <p>Loading messages...</p>
                </div>
              ) : messages[selectedContact.id]?.length > 0 ? (
                <>
                  {messages[selectedContact.id].map(message => (
                    <div
                      key={message.id}
                      className={`message ${message.isCurrentUser ? 'sent' : 'received'}`}
                    >
                      <div className={`message-content ${message.isCurrentUser ? 'sent-bubble' : 'received-bubble'}`}>
                        {message.text}
                      </div>
                      <div className="message-time">{formatTime(message.timestamp)}</div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} /> {/* Scroll anchor */}
                </>
              ) : (
                <div className="empty-chat-state">
                  <div className="empty-chat-icon">💬</div>
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
                autoFocus
              />
              <button 
                type="submit" 
                className="send-button"
                disabled={!messageInput.trim()}
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <div className="empty-state large">
              <div className="empty-icon large">💬</div>
              <h2>Welcome to Messages</h2>
              <p>Select a user to start chatting</p>
              <button 
                className="new-chat-btn large"
                onClick={openNewChatModal}
              >
                START NEW CHAT
              </button>
            </div>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="modal-overlay" onClick={() => setShowNewChatModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Start a New Chat</h2>
              <button 
                className="close-modal"
                onClick={() => {
                  setShowNewChatModal(false);
                  setNewContactUsername('');
                  setLocalSearchResults([]);
                }}
              >×</button>
            </div>

            <div className="modal-body">
              <div className="modal-search">
                <input
                  type="text"
                  placeholder="Search by username or name"
                  value={newContactUsername}
                  onChange={(e) => {
                    setNewContactUsername(e.target.value);
                    searchLocalUsers(e.target.value); // Search locally first
                    if (e.target.value.trim().length >= 2) {
                      searchUsers(e.target.value); // Then fetch from API
                    } else {
                      setSearchResults([]);
                    }
                  }}
                  autoFocus
                />
                {searchLoading && <div className="search-spinner"></div>}
              </div>

              {/* Combined search results inside modal */}
              {newContactUsername.trim() && (
                <div className="modal-search-results">
                  {searchLoading && localSearchResults.length === 0 ? (
                    <div className="loading-results">Searching...</div>
                  ) : (localSearchResults.length > 0 || searchResults.length > 0) ? (
                    <div className="results-list">
                      {/* Local search results first for immediate feedback */}
                      {localSearchResults.map(user => (
                        <div 
                          key={`local-${user.id}`}
                          className="search-result-item"
                          onClick={() => startChatWithUser(user)}
                        >
                          <div className="result-avatar">
                            {(user.name || user.username || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div className="result-info">
                            <div className="result-name">{user.name || user.username}</div>
                            {user.name && user.username && (
                              <div className="result-username">@{user.username}</div>
                            )}
                            {user.type && (
                              <div className="result-type">{user.type}</div>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {/* API search results that don't duplicate local results */}
                      {searchResults
                        .filter(apiUser => 
                          !localSearchResults.some(localUser => localUser.id === apiUser.id)
                        )
                        .map(user => (
                          <div 
                            key={`api-${user.id}`}
                            className="search-result-item"
                            onClick={() => startChatWithUser(user)}
                          >
                            <div className="result-avatar">
                              {(user.name || user.username || 'U').charAt(0).toUpperCase()}
                              </div>
                            <div className="result-info">
                              <div className="result-name">{user.name || user.username}</div>
                              {user.name && user.username && (
                                <div className="result-username">@{user.username}</div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="no-results">No users found</div>
                  )}
                </div>
              )}

              <div className="modal-buttons">
                <button 
                  className="cancel-button"
                  onClick={() => {
                    setShowNewChatModal(false);
                    setNewContactUsername('');
                    setLocalSearchResults([]);
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="start-chat-button"
                  onClick={handleCreateNewChat}
                  disabled={!newContactUsername.trim() || (localSearchResults.length === 0 && searchResults.length === 0) || searchLoading}
                >
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error notification */}
      {error && (
        <div className="error-notification">
          {error}
        </div>
      )}
    </div>
  );
};

export default Messages;