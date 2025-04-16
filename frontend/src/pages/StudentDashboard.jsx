import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import NavBar from './NavBar';
import SideBar from './Sidebar1';
import './StudentDashboard.css'; 
import backgroundimage from '../assets/pexels-olia-danilevich-5088017.jpg'; 
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
      'Resolved': 'resolved'
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

  return (
    <div className="dashboard-container" style={{
      backgroundImage: `url(${backgroundimage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh',
      width: '100%' // Changed from fixed 1205px to be responsive
    }}>
      <SideBar />
      <div className="dashboard-wrapper">
        <NavBar />
        
        {/* Dashboard Panels */}
        <div className="dashboard-panels">
          <div className="panel">
            <div className="panel-title">Resolved Issues</div>
            <div className="panel-count">{issueData.filter(issue => issue.status === 'resolved').length}</div>
          </div>
          <div className="panel">
            <div className="panel-title">Pending Issues</div>
            <div className="panel-count">{issueData.filter(issue => issue.status === 'pending').length}</div>
          </div>
          <div className="panel">
            <div className="panel-title">In-progress Issues</div>
            <div className="panel-count">{issueData.filter(issue => issue.status === 'in_progress').length}</div>
          </div>
        </div>
        
        {/* Search Input */}
        <div className="search-container">
          <input type="text" placeholder="Search for issues..." className="search-input" />
          <button className="filter-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 16v-4.414L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="new-issue-button" onClick={handleNewIssueClick}>+ New Issue</button>
        </div>
        
        {/* Issues Container */}
        <div className="issues-container">
          <div className="issues-header">
            <div className="tab-container">
              {['Pending', 'In-progress', 'Resolved'].map(tab => (
                <button
                  key={tab}
                  className={`tab-button ${activeTab === tab ? 'active' : 'inactive'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Table Container */}
        <div className="table-container">
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
                  <th>Issue Type</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.length > 0 ? (
                  filteredIssues.map((issue, index) => (
                    <tr key={issue.id || index}>
                      <td>{issue.issue}</td>
                      <td>
                        <span className={`status-tag status-${issue.status}`}>
                          {issue.status === 'pending' ? 'Pending' : 
                           issue.status === 'in_progress' ? 'In-progress' : 
                           issue.status === 'resolved' ? 'Resolved' : issue.status}
                        </span>
                      </td>
                      <td>{issue.issue_type || issue.category}</td>
                      <td>{issue.date}</td>
                      <td>
                        <button className="view-details-btn" onClick={() => openIssueDetails(issue)}>
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-issues-message">No {activeTab.toLowerCase()} issues found</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Issue Details Modal */}
      {showModal && selectedIssue && (
        <div className="issue-modal-overlay">
          <div className="issue-modal">
            <div className="issue-modal-header">
              <h2>Issue Details</h2>
              <button className="close-modal-btn" onClick={closeModal}>×</button>
            </div>
            <div className="issue-modal-content">
              {Object.entries(selectedIssue).map(([key, value]) => (
                <div key={key} className="issue-detail-item">
                  <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> 
                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </div>
              ))}
            </div>
            <div className="issue-modal-footer">
              <button className="modal-close-btn" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;