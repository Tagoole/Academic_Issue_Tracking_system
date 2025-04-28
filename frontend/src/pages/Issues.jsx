import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import SideBar from './Sidebar1';
import './Issues.css';
import API from '../api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Issues = () => {
  const [activeTab, setActiveTab] = useState('Pending');
  const [issueData, setIssueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated when component mounts
    const checkAuth = () => {
      const accessToken = localStorage.getItem('accessToken');
      // If no access token is available, redirect to login
      if (!accessToken) {
        toast.error("Authentication required. Please sign in.");
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

        // Show success toast when data is loaded
        toast.success("Issues loaded successfully");
      } catch (err) {
        console.error('Error fetching student issues:', err);

        // Check if error is due to unauthorized access (401)
        if (err.response && err.response.status === 401) {
          // Try refreshing the token
          try {
            toast.info("Refreshing your session...");
            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
              const refreshResponse = await API.post('/api/refresh_token/', {
                refresh: refreshToken,
              });

              // Store the new access token
              const newAccessToken = refreshResponse.data.access;
              localStorage.setItem('accessToken', newAccessToken);

              // Retry the original request with new token
              API.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
              const retryResponse = await API.get('/api/student_issues/');
              setIssueData(retryResponse.data);
              setLoading(false);
              toast.success("Session refreshed, issues loaded successfully");
            } else {
              // No refresh token available, redirect to login
              toast.error("Session expired. Please sign in again.");
              navigate('/signin');
            }
          } catch (refreshErr) {
            console.error('Error refreshing token:', refreshErr);
            setError('Your session has expired. Please log in again.');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            toast.error("Authentication failed. Please sign in again.");
            navigate('/signin');
          }
        } else {
          setError('Failed to load issues. Please try again later.');
          toast.error("Failed to load issues. Please try again later.");
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
    navigate('/new-issue');
  };

  const handleViewDetailsClick = (issueId) => {
    navigate(`/view-details/${issueId}`);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    toast.info(`Showing ${tab} issues`);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return 'N/A';
    
    // Calculate time difference
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      // For older dates, show the full date
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  return (
    <div
      className="issues-container"
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '1000px',
      }}
    >
      {/* Add the ToastContainer here */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <SideBar />
      <div className="dashboard-content">
        <NavBar />
        <div className="issues-panel">
          <h1 className="issues-title">Issues</h1>
          
          <div className="issues-tabs">
            {['Pending', 'In-progress', 'Resolved', 'Rejected'].map((tab) => (
              <button
                key={tab}
                className={`issues-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </button>
            ))}
            <button className="new-issue-btn" onClick={handleNewIssueClick}>
              + New Issue
            </button>
          </div>

          <div className="search-filter-container">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search"
                className="search-input"
                style={{ color: 'black' }}
              />
            </div>
            <button className="filter-btn">
              Filter
            </button>
          </div>

          {loading ? (
            <div className="loading-message">Loading issues...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <table className="issues-table">
              <thead>
                <tr>
                  <th>Issue</th>
                  <th>Status</th>
                  <th>Category</th>
                  <th>Created</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.length > 0 ? (
                  filteredIssues.map((issue) => (
                    <tr key={issue.id}>
                      <td>{issue.issue}</td>
                      <td>
                        <span className={`status-pill status-${issue.status}`}>
                          {issue.status === 'pending' ? 'Pending' : 
                           issue.status === 'in_progress' ? 'In-progress' : 
                           issue.status === 'resolved' ? 'Resolved' : 
                           issue.status === 'rejected' ? 'Rejected' : issue.status}
                        </span>
                      </td>
                      <td>{issue.issue_type || issue.category}</td>
                      <td>{formatDate(issue.created_at || issue.date)}</td>
                      <td>{formatDate(issue.updated_at)}</td>
                      <td>
                        <button
                          className="view-details-btn"
                          onClick={() => handleViewDetailsClick(issue.id)}
                        >
                          View details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-issues-message">
                      No {activeTab.toLowerCase()} issues found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Issues;