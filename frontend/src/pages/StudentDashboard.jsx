import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import NavBar from './NavBar';
import SideBar from './Sidebar1';
import './StudentDashboard.css'; 
import API from '../api';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('Pending');
  const [issueData, setIssueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    // Check if user is authenticated when component mounts
    const checkAuth = () => {
      const accessToken = localStorage.getItem('accessToken');
      // If no access token is available, redirect to login
      if (!accessToken) {
        navigate('/signin');
        return false;
      }
      return true;
    };
    
    // Fetch student issues when component mounts
    const fetchStudentIssues = async () => {
      try {
        setLoading(true);
        
        // Get access token
        const accessToken = localStorage.getItem('accessToken');
        
        // Set authorization header with access token
        API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        
        const response = await API.get('/api/student_issues/');
        console.log("API Response:", response.data); // Debug log
        setIssueData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching student issues:', err);
        
        // Check if error is due to unauthorized access (401)
        if (err.response && err.response.status === 401) {
          // Try refreshing the token
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            
            if (refreshToken) {
              const refreshResponse = await API.post('/api/refresh_token/', {
                refresh: refreshToken
              });
              
              // Store the new access token
              const newAccessToken = refreshResponse.data.access;
              localStorage.setItem('accessToken', newAccessToken);
              
              // Retry the original request with new token
              API.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
              const retryResponse = await API.get('/api/student_issues/');
              setIssueData(retryResponse.data);
              setLoading(false);
            } else {
              // No refresh token available, redirect to login
              navigate('/signin');
            }
          } catch (refreshErr) {
            console.error('Error refreshing token:', refreshErr);
            setError('Your session has expired. Please log in again.');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/signin');
          }
        } else {
          setError('Failed to load issues. Please try again later.');
          setLoading(false);
        }
      }
    };

    // Only fetch data if authentication check passes
    if (checkAuth()) {
      fetchStudentIssues();
    }
  }, [navigate]);

  // Map UI status labels to backend status values
  const getStatusMapping = (uiStatus) => {
    const statusMap = {
      'Pending': 'pending',
      'In-progress': 'in_progress',
      'Resolved': 'resolved',
      'Rejected': 'rejected'
    };
    return statusMap[uiStatus] || uiStatus.toLowerCase();
  };

  const filteredIssues = issueData.filter(issue => {
    const backendStatus = getStatusMapping(activeTab);
    return issue.status === backendStatus;
  });

  const handleNewIssueClick = () => {
    navigate('/new-issue'); // Navigate to the new issue page
  };

  const openIssueDetails = (issue) => {
    setSelectedIssue(issue);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedIssue(null);
  };

  // New function to handle issue deletion
  const handleDeleteIssue = async (issueId) => {
    if (window.confirm('Are you sure you want to delete this issue? This action cannot be undone.')) {
      try {
        // Get access token
        const accessToken = localStorage.getItem('accessToken');
        
        // Set authorization header with access token
        API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        
        // Send delete request to API
        await API.delete(`/api/student_issues/${issueId}/`);
        
        // Update the state by removing the deleted issue
        setIssueData(prevIssues => prevIssues.filter(issue => issue.id !== issueId));
        
        // Show success message
        alert('Issue deleted successfully');
      } catch (err) {
        console.error('Error deleting issue:', err);
        alert('Failed to delete issue. Please try again.');
      }
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to determine if a string is a URL
  const isValidURL = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Helper function to check if a URL is an image
  const isImageURL = (url) => {
    if (!url || typeof url !== 'string') return false;
    
    // Check if the URL ends with common image extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    return imageExtensions.some(ext => url.toLowerCase().endsWith(ext)) || 
           url.toLowerCase().includes('/image/') ||
           url.toLowerCase().includes('media/images/');
  };

  // Format issue detail value for display
  const formatValue = (key, value) => {
    if (value === null || value === undefined) return 'N/A';
    
    // Handle image URLs
    if ((key === 'image' || key.includes('image') || key.includes('photo') || key.includes('picture')) && 
        isValidURL(value)) {
      return (
        <div className="detail-image-container">
          <img 
            src={value} 
            alt={`Issue ${key}`} 
            className="detail-image" 
            onClick={() => window.open(value, '_blank')}
          />
          <div className="image-caption">Click to view full size</div>
        </div>
      );
    }
    
    // Handle any URL that appears to be an image
    if (typeof value === 'string' && isImageURL(value)) {
      return (
        <div className="detail-image-container">
          <img 
            src={value} 
            alt="Issue attachment" 
            className="detail-image" 
            onClick={() => window.open(value, '_blank')}
          />
          <div className="image-caption">Click to view full size</div>
        </div>
      );
    }
    
    // Handle other URLs
    if (typeof value === 'string' && isValidURL(value)) {
      return (
        <a href={value} target="_blank" rel="noopener noreferrer">
          {value}
        </a>
      );
    }
    
    // Handle dates
    if (key.includes('_at') || key.includes('date')) {
      return formatDate(value);
    }
    
    // Handle objects
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    
    // Handle boolean values
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    // Default: return as string
    return String(value);
  };

  return (
    <div className="student-main-container" style={{
      minHeight: '100vh',
      width: '100%' // Changed from fixed 1205px to be responsive
    }}>
      <SideBar />
      <div className="student-content-wrapper">
        <NavBar />
        
        {/* Dashboard Panels */}
        <div className="stats-card-group">
          <div className="stat-card">
            <div className="stat-card-heading">Resolved Issues</div>
            <div className="stat-card-value">{issueData.filter(issue => issue.status === 'resolved').length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-heading">Pending Issues</div>
            <div className="stat-card-value">{issueData.filter(issue => issue.status === 'pending').length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-heading">In-progress Issues</div>
            <div className="stat-card-value">{issueData.filter(issue => issue.status === 'in_progress').length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-heading">Rejected Issues</div>
            <div className="stat-card-value">{issueData.filter(issue => issue.status === 'rejected').length}</div>
          </div>
        </div>
        
        <div className="query-controls">
          <input type="text" placeholder="Search for issues..." className="query-input" />
          <button className="query-filter-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 16v-4.414L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
          </button>
          
          {/* Advanced holographic button with multiple effects */}
          <div className="holo-button-wrapper">
            <div className="holo-button-effects">
              <div className="holo-button-border">
                <button 
                  className="create-issue-btn holo-effect-btn holo-3d-effect" 
                  onClick={handleNewIssueClick}
                >
                  + New Issue
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Issues Container */}
        <div className="issues-view-container">
          <div className="issues-view-header">
            <div className="status-filter-wrapper">
              {['Pending', 'In-progress', 'Resolved', 'Rejected'].map(tab => (
                <button
                  key={tab}
                  className={`status-filter-btn ${activeTab === tab ? 'selected-status' : 'unselected-status'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Table Container */}
        <div className="data-grid-wrapper">
          {loading ? (
            <div className="loader-text">Loading issues...</div>
          ) : error ? (
            <div className="error-notification">{error}</div>
          ) : (
            <table className="data-grid">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Status</th>
                  <th>Issue Type</th>
                  <th>Created</th>
                  <th>Updated</th>
                  <th>Is Commented</th>
                  <th>Comment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.length > 0 ? (
                  filteredIssues.map((issue, index) => (
                    <tr key={issue.id || index}>
                      <td>#{issue.id || 'N/A'}</td>
                      <td>
                        <span className={`status-indicator status-color-${issue.status}`}>
                          {issue.status === 'pending' ? 'Pending' : 
                           issue.status === 'in_progress' ? 'In-progress' : 
                           issue.status === 'resolved' ? 'Resolved' : 
                           issue.status === 'rejected' ? 'Rejected' : issue.status}
                        </span>
                      </td>
                      <td>{issue.issue_type || issue.category}</td>
                      <td>{formatDate(issue.created_at || issue.date)}</td>
                      <td>{formatDate(issue.updated_at)}</td>
                      <td>{issue.is_commented ? '✓' : '✗'}</td>
                      <td>{issue.comment || 'No comment'}</td>
                      <td>
                        <div className="row-actions-group">
                          <button className="details-action-btn" onClick={() => openIssueDetails(issue)}>
                            Details
                          </button>
                          <button 
                            className="remove-action-btn" 
                            onClick={() => handleDeleteIssue(issue.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="empty-state-message">No {activeTab.toLowerCase()} issues found</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Issue Details Modal */}
      {showModal && selectedIssue && (
        <div className="modal-backdrop">
          <div className="modal-window">
            <div className="modal-title-bar">
              <h2>Issue Details</h2>
              <button className="modal-close-icon" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <strong>ID:</strong> #{selectedIssue.id || 'N/A'}
              </div>
              
              {/* Display issue image prominently if it exists */}
              {selectedIssue.image && (
                <div className="detail-row issue-image-row">
                  <strong>Image:</strong>
                  <div className="detail-image-container">
                    <img 
                      src={selectedIssue.image} 
                      alt="Issue attachment" 
                      className="detail-image" 
                      onClick={() => window.open(selectedIssue.image, '_blank')}
                    />
                    <div className="image-caption">Click to view full size</div>
                  </div>
                </div>
              )}
              
              {/* Display all other issue details */}
              {Object.entries(selectedIssue).map(([key, value]) => {
                // Skip ID and image as we've already displayed them separately
                if (key === 'id' || key === 'image') return null;
                
                const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                
                return (
                  <div key={key} className="detail-row">
                    <strong>{formattedKey}:</strong> 
                    <div className="detail-value">
                      {formatValue(key, value)}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="modal-actions">
              <button className="modal-dismiss-btn" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;