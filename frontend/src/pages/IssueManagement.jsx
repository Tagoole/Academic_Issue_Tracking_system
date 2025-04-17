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
        issue.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.studentNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.category?.toLowerCase().includes(searchTerm.toLowerCase()))
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

  const handleViewDetails = () => {
    navigate('/view-details');
  };

  const handleEscalateIssue = (issueId) => {
    setActiveIssueId(issueId);
    setShowLecturersDropdown(true);
    setShowActionsDropdown(null); 
  };

  const handleLecturerSelect = (lecturerId) => {
    const issue = issues.find((i) => i.id === activeIssueId);
    const lecturer = lecturers.find((l) => l.id === lecturerId);

    if (!issue || !lecturer) return;

    // Data to send to the backend (for escalation)
    const escalationData = {
      issue_id: issue.id,
      lecturer_id: lecturer.id,
      status: 'in_progress',
    };

    // Send POST request to escalate the issue
    API.post(`api/escalate-issue/`, escalationData)
      .then((response) => {
        console.log('Issue escalated successfully:', response.data);
        setIssues((prevIssues) =>
          prevIssues.map((i) =>
            i.id === issue.id ? { ...i, status: 'in_progress' } : i
          )
        );
        setShowLecturersDropdown(false);
      })
      .catch((error) => {
        console.error('Error escalating issue:', error);
        setShowLecturersDropdown(false);
      });
  };

  const toggleActionsDropdown = (issueId) => {
    if (showActionsDropdown === issueId) {
      setShowActionsDropdown(null);
    } else {
      setShowActionsDropdown(issueId);
      setShowLecturersDropdown(false);
    }
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

            <div className="issues-table">
              {filteredIssues.length > 0 ? (
                <table className="issues-table">
                  <thead>
                    <tr>
                      <th>ISSUE ID</th>
                      <th>STUDENT NAME</th>
                      <th>CATEGORY</th>
                      <th>SUBMISSION DATE</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIssues.map((issue) => (
                      <tr key={issue.id} className="issue-row">
                        <td>{issue.id}</td>
                        <td>{issue.student_name || issue.studentNo}</td>
                        <td>{issue.category}</td>
                        <td>{issue.submission_date || issue.date}</td>
                        <td className="actions-cell" ref={dropdownRef}>
                          <div className="actions-dropdown-container">
                            <button
                              className="actions-dropdown-toggle"
                              onClick={() => toggleActionsDropdown(issue.id)}
                            >
                              Actions <i className="dropdown-arrow"></i>
                            </button>

                            {showActionsDropdown === issue.id && (
                              <div className="actions-dropdown-menu">
                                <button className="dropdown-item" onClick={handleViewDetails}>
                                  <i className="view-icon"></i> View details
                                </button>
                                <button
                                  className="dropdown-item"
                                  onClick={() => handleEscalateIssue(issue.id)}
                                >
                                  <i className="escalate-icon"></i> Escalate issue
                                </button>
                                <button className="dropdown-item">
                                  <i className="edit-icon"></i> Edit issue
                                </button>
                                <button className="dropdown-item danger">
                                  <i className="delete-icon"></i> Delete issue
                                </button>
                              </div>
                            )}

                            {showLecturersDropdown && activeIssueId === issue.id && (
                              <div className="lecturers-dropdown">
                                <div className="dropdown-header">
                                  <h4>Select a Lecturer</h4>
                                  <button
                                    className="close-dropdown"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowLecturersDropdown(false);
                                    }}
                                  >
                                    ×
                                  </button>
                                </div>
                                <ul className="lecturers-list">
                                  {lecturers.map((lecturer) => (
                                    <li
                                      key={lecturer.id}
                                      onClick={() => handleLecturerSelect(lecturer.id)}
                                    >
                                      {lecturer.name}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-issues-message">
                  {searchTerm ? 'No issues match your search' : 'No issues found'}
                </div>
              )}
            </div>
          </div>
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