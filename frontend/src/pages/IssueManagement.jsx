import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './NavBar';
import Sidebar from './Sidebar';
import './IssueManagement.css';
import API from '../api.js';

const IssueManagement = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [issueStatus, setIssueStatus] = useState('pending');
  const [showLecturersDropdown, setShowLecturersDropdown] = useState(false);
  const [activeIssueId, setActiveIssueId] = useState(null);
  const [showActionsDropdown, setShowActionsDropdown] = useState(null);
  const dropdownRef = useRef(null);
  
  // Added state for issue details modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  
  // Counters for different issue statuses
  const [pendingCount, setPendingCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);

  // Fetch issues when component mounts
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

    const fetchLecturers = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        
        const response = await API.get('api/get_lecturers/');
        console.log("Lecturers Response:", response.data);
        setLecturers(response.data);
      } catch (err) {
        console.error('Error fetching lecturers:', err);
      }
    };

    const fetchIssues = async () => {
      try {
        setLoading(true);
        
        // Get access token
        const accessToken = localStorage.getItem('accessToken');
        
        // Set authorization header with access token
        API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        
        const response = await API.get('api/registrar_issue_management/');
        console.log("API Response:", response.data); // Debug log
        
        setIssues(response.data);
        setFilteredIssues(response.data);
        
        // Calculate counts for each status
        const pending = response.data.filter(issue => issue.status === 'pending').length;
        const inProgress = response.data.filter(issue => issue.status === 'in_progress').length;
        const resolved = response.data.filter(issue => issue.status === 'resolved').length;
        
        setPendingCount(pending);
        setInProgressCount(inProgress);
        setResolvedCount(resolved);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching registrar issues:', err);
        
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
              const retryResponse = await API.get('api/registrar_issue_management/');
              
              setIssues(retryResponse.data);
              setFilteredIssues(retryResponse.data);
              
              // Calculate counts for each status
              const pending = retryResponse.data.filter(issue => issue.status === 'pending').length;
              const inProgress = retryResponse.data.filter(issue => issue.status === 'in_progress').length;
              const resolved = retryResponse.data.filter(issue => issue.status === 'resolved').length;
              
              setPendingCount(pending);
              setInProgressCount(inProgress);
              setResolvedCount(resolved);
              
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
      fetchIssues();
      fetchLecturers();
    }
  }, [navigate]);

  // Handle search functionality
  useEffect(() => {
    if (searchTerm.trim() === '') {
      // Filter by current status
      const statusFiltered = issues.filter(issue => 
        issue.status.toLowerCase() === issueStatus.toLowerCase()
      );
      setFilteredIssues(statusFiltered);
    } else {
      const filtered = issues.filter(issue => 
        issue.status.toLowerCase() === issueStatus.toLowerCase() &&
        (issue.id.toString().includes(searchTerm) ||
        (issue.student?.username && issue.student.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (issue.description && issue.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (issue.issue_type && issue.issue_type.toLowerCase().includes(searchTerm.toLowerCase())))
      );
      setFilteredIssues(filtered);
    }
  }, [searchTerm, issues, issueStatus]);

  const handleStatusChange = (status) => {
    setIssueStatus(status.toLowerCase());
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Modified handleViewDetails to display issue details in a modal
  const handleViewDetails = (issueId) => {
    const issue = issues.find(issue => issue.id === issueId);
    if (issue) {
      setSelectedIssue(issue);
      setShowDetailsModal(true);
      setShowActionsDropdown(null); // Close the actions dropdown
    }
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedIssue(null);
  };

  const handleEscalateIssue = (issueId) => {
    setActiveIssueId(issueId);
    setShowLecturersDropdown(true);
    setShowActionsDropdown(null); 
  };

  const handleLecturerSelect = async (lecturerId) => {
    try {
      const issue = issues.find((i) => i.id === activeIssueId);
      const lecturer = lecturers.find((l) => l.id === lecturerId);
  
      if (!issue || !lecturer) return;
  
      // Data to send to the backend (for escalation)
      const escalationData = {
        issue_id: issue.id,
        lecturer_id: lecturer.id,
        status: 'in_progress',
      };
  
      // Get access token for authorization
      const accessToken = localStorage.getItem('accessToken');
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  
      // Send POST request to escalate the issue
      const response = await API.put(`api/issues/${issue.id}/`, escalationData);
      console.log('Issue escalated successfully:', response.data);
      
      // Update the issue in state to reflect the change
      setIssues((prevIssues) =>
        prevIssues.map((i) =>
          i.id === issue.id ? { ...i, status: 'in_progress', lecturer: lecturer } : i
        )
      );
      
      // Close the dropdowns
      setShowLecturersDropdown(false);
      setActiveIssueId(null);
      
      // Update status counts
      setInProgressCount(prev => prev + 1);
      setPendingCount(prev => prev - 1);
      
      // Show success message or notification to user (you can add this functionality)
      alert(`Issue #${issue.id} has been escalated to ${lecturer.username}`);
      
    } catch (error) {
      console.error('Error escalating issue:', error);
      alert('Failed to escalate issue. Please try again.');
      setShowLecturersDropdown(false);
    }
  };

  const toggleActionsDropdown = (issueId) => {
    if (showActionsDropdown === issueId) {
      setShowActionsDropdown(null);
    } else {
      setShowActionsDropdown(issueId);
      setShowLecturersDropdown(false);
      setActiveIssueId(null);
    }
  };

  // Format date to a user-friendly format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowActionsDropdown(null);
        setShowLecturersDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Render table rows
  const renderIssueRows = () => {
    if (filteredIssues.length === 0) {
      return (
        <tr>
          <td colSpan="9" className="no-issues">
            {searchTerm ? 'No issues match your search' : 'No issues found'}
          </td>
        </tr>
      );
    }

    return filteredIssues.map((issue) => (
      <tr key={issue.id} className="issue-row">
        <td>{issue.id}</td>
        <td>{issue.student?.username || 'N/A'}</td>
        <td>{issue.issue_type || 'N/A'}</td>
        <td>{issue.lecturer?.username || 'Not Assigned'}</td>
        <td>{issue.year_of_study?.replace('_', ' ') || 'N/A'}</td>
        <td>{formatDate(issue.created_at)}</td>
        <td>{formatDate(issue.updated_at)}</td>
        <td>
          <span className={`status-badge ${issue.status}`}>
            {issue.status.replace('_', ' ')}
          </span>
        </td>
        <td className="action-column" ref={dropdownRef}>
          <div className="dropdown-container">
            <button 
              className="action-dropdown-btn"
              onClick={() => toggleActionsDropdown(issue.id)}
            >
              :
            </button>
            
            {showActionsDropdown === issue.id && (
              <div className="actions-dropdown">
                <button 
                  className="dropdown-item"
                  onClick={() => handleViewDetails(issue.id)}
                >
                  View Details
                </button>
                
                {issue.status === 'pending' && (  // Only show escalate option for pending issues
                  <button 
                    className="dropdown-item"
                    onClick={() => handleEscalateIssue(issue.id)}
                  >
                    Escalate Issue
                  </button>
                )}
              </div>
            )}
            
            {showLecturersDropdown && activeIssueId === issue.id && (
              <div className="lecturers-dropdown">
                <div className="dropdown-header">Select Lecturer:</div>
                {lecturers.length > 0 ? (
                  lecturers.map((lecturer) => (
                    <button
                      key={lecturer.id}
                      className="dropdown-item lecturer-item"
                      onClick={() => handleLecturerSelect(lecturer.id)}
                    >
                      {lecturer.username}
                    </button>
                  ))
                ) : (
                  <div className="no-lecturers">No lecturers available</div>
                )}
              </div>
            )}
          </div>
        </td>
      </tr>
    ));
  };

  // Loading state
  if (loading) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="content-wrapper">
          <Sidebar />
          <div className="issue-content">
            <div className="loading-message">Loading issues...</div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="content-wrapper">
          <Sidebar />
          <div className="issue-content">
            <div className="error-message">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <div className="content-wrapper">
        <Sidebar />
        <div className="issue-content">
          <div className="dashboard-cards">
            <DashboardCard
              title="Pending issues"
              count={pendingCount}
              description={`You currently have ${pendingCount} pending issue${pendingCount !== 1 ? 's' : ''}`}
            />
            <DashboardCard
              title="In-progress issues"
              count={inProgressCount}
              description={`You currently have ${inProgressCount} in-progress issue${inProgressCount !== 1 ? 's' : ''}`}
            />
            <DashboardCard
              title="Resolved issues"
              count={resolvedCount}
              description={`You currently have ${resolvedCount} resolved issue${resolvedCount !== 1 ? 's' : ''}`}
            />
          </div>

          <div className="issues-container">
            <h2 className="issues-title">
              Issues <span className="subtitle">(Kindly click on the issue to open it.)</span>
            </h2>

            <div className="status-tabs">
              <button
                className={`status-tab ${issueStatus === 'pending' ? 'active' : ''}`}
                onClick={() => handleStatusChange('pending')}
              >
                Pending
              </button>
              <button
                className={`status-tab ${issueStatus === 'in_progress' ? 'active' : ''}`}
                onClick={() => handleStatusChange('in_progress')}
              >
                In-progress
              </button>
              <button
                className={`status-tab ${issueStatus === 'resolved' ? 'active' : ''}`}
                onClick={() => handleStatusChange('resolved')}
              >
                Resolved
              </button>
            </div>

            <div className="issues-list-header">
              <div className="search-filter-container">
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Search for issues..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                  />
                  <span className="search-icon"></span>
                </div>
                <button className="filter-button">
                  <span>Filter</span>
                  <span className="filter-icon">▼</span>
                </button>
              </div>
            </div>

            {/* Table Display Section */}
            <div className="issues-data-container">
              {filteredIssues.length > 0 ? (
                <div className="responsive-table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>ISSUE ID</th>
                        <th>STUDENT</th>
                        <th>ISSUE TYPE</th>
                        <th>LECTURER</th>
                        <th>YEAR OF STUDY</th>
                        <th>SUBMITTED</th>
                        <th>LAST UPDATED</th>
                        <th>STATUS</th>
                        <th>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {renderIssueRows()}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="no-issues-message">
                  {searchTerm ? 'No issues match your search' : 'No issues found'}
                </div>
              )}
            </div>
          </div>
          
          {/* Issue Details Modal */}
          {showDetailsModal && selectedIssue && (
            <div className="issue-details-modal">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Issue Details - #{selectedIssue.id}</h2>
                  <button className="close-modal-btn" onClick={closeDetailsModal}>×</button>
                </div>
                <div className="modal-body">
                  <div className="issue-detail-row">
                    <span className="detail-label">Status:</span>
                    <span className={`status-badge ${selectedIssue.status}`}>
                      {selectedIssue.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="issue-detail-row">
                    <span className="detail-label">Student:</span>
                    <span>{selectedIssue.student?.username || 'N/A'}</span>
                  </div>
                  <div className="issue-detail-row">
                    <span className="detail-label">Issue Type:</span>
                    <span>{selectedIssue.issue_type || 'N/A'}</span>
                  </div>
                  <div className="issue-detail-row">
                    <span className="detail-label">Year of Study:</span>
                    <span>{selectedIssue.year_of_study?.replace('_', ' ') || 'N/A'}</span>
                  </div>
                  <div className="issue-detail-row">
                    <span className="detail-label">Assigned To:</span>
                    <span>{selectedIssue.lecturer?.username || 'Not Assigned'}</span>
                  </div>
                  <div className="issue-detail-row">
                    <span className="detail-label">Created:</span>
                    <span>{formatDate(selectedIssue.created_at)}</span>
                  </div>
                  <div className="issue-detail-row">
                    <span className="detail-label">Last Updated:</span>
                    <span>{formatDate(selectedIssue.updated_at)}</span>
                  </div>
                  <div className="issue-detail-description">
                    <h3>Description:</h3>
                    <p>{selectedIssue.description || 'No description provided.'}</p>
                  </div>
                  
                  {/* Display comments if available */}
                  {selectedIssue.comments && selectedIssue.comments.length > 0 && (
                    <div className="issue-comments">
                      <h3>Comments:</h3>
                      {selectedIssue.comments.map((comment, index) => (
                        <div key={index} className="comment-item">
                          <div className="comment-header">
                            <span className="comment-author">{comment.author || 'Unknown'}</span>
                            <span className="comment-date">{formatDate(comment.created_at)}</span>
                          </div>
                          <p className="comment-text">{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button className="btn close-btn" onClick={closeDetailsModal}>Close</button>
                  {selectedIssue.status === 'pending' && (
                    <button 
                      className="btn escalate-btn"
                      onClick={() => {
                        closeDetailsModal();
                        handleEscalateIssue(selectedIssue.id);
                      }}
                    >
                      Escalate Issue
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Dashboard Card Component
const DashboardCard = ({ title, count, description }) => {
  return (
    <div className="dashboard-card">
      <h3>{title}</h3>
      <div className="card-count">{count}</div>
      <p>{description}</p>
    </div>
  );
};

export default IssueManagement;