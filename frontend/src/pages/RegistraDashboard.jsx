import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegistraDashboard.css';
import NavBar from './NavBar';
import Sidebar from './Sidebar';
import API from '../api.js';

const RegistraDashboard = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredIssues, setFilteredIssues] = useState([]);
  
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
        const pending = response.data.filter(issue => issue.status === 'Pending').length;
        const inProgress = response.data.filter(issue => issue.status === 'In Progress').length;
        const resolved = response.data.filter(issue => issue.status === 'Resolved').length;
        
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
              const pending = retryResponse.data.filter(issue => issue.status === 'Pending').length;
              const inProgress = retryResponse.data.filter(issue => issue.status === 'In Progress').length;
              const resolved = retryResponse.data.filter(issue => issue.status === 'Resolved').length;
              
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
    }
  }, [navigate]);

  // Handle search functionality
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredIssues(issues);
    } else {
      const filtered = issues.filter(issue => 
        issue.id.toString().includes(searchTerm) ||
        issue.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.studentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredIssues(filtered);
    }
  }, [searchTerm, issues]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div className="app-container" style={{ width: '1000px' }}>
        <NavBar />
        <div className="content-container">
          <Sidebar />
          <main className="main-content">
            <div className="loading-message">Loading issues...</div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container" style={{ width: '1000px' }}>
        <NavBar />
        <div className="content-container">
          <Sidebar />
          <main className="main-content">
            <div className="error-message">{error}</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container" style={{ width: '1000px' }}>
      <NavBar />
      <div className="content-container">
        <Sidebar />
        <main className="main-content">
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

          <div className="issues-section">
            <div className="issues-header">
              <h2>My issues</h2>
              <div className="search-container">
                <input 
                  type="text" 
                  placeholder="search for issues" 
                  className="search-input" 
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <span className="search-icon"></span>
              </div>
              <button className="filter-button">
                <span>Filter</span>
                <span className="filter-icon">▼</span>
              </button>
            </div>

            <div className="issues-table">
              {filteredIssues.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Issue ID</th>
                      <th>Status</th>
                      <th>Student No</th>
                      <th>Category</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIssues.map(issue => (
                      <tr key={issue.id}>
                        <td>{issue.id}</td>
                        <td>{issue.status}</td>
                        <td>{issue.studentNo}</td>
                        <td>{issue.category}</td>
                        <td>{issue.date}</td>
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
        </main>
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

export default RegistraDashboard;