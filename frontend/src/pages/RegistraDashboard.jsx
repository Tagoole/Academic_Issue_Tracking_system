import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegistraDashboard.css';
import NavBar from './NavBar';
import Sidebar from './Sidebar';
import API from '../api.js';

const RegistrarDashboard = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // New state for filtering

  // Fetch issues when component mounts
  useEffect(() => {
    const checkAuth = () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        navigate('/signin');
        return false;
      }
      return true;
    };

    const fetchIssues = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        const response = await API.get('api/registrar_issue_management/');
        console.log("API Response:", response.data);

        // Ensure data is processed properly
        const issuesData = Array.isArray(response.data) ? response.data : [];
        setIssues(issuesData);
        setFilteredIssues(issuesData);

        // Count different issue types
        updateCounts(issuesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching registrar issues:', err);
        if (err.response && err.response.status === 401) {
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const refreshResponse = await API.post('/api/refresh_token/', {
                refresh: refreshToken,
              });
              const newAccessToken = refreshResponse.data.access;
              localStorage.setItem('accessToken', newAccessToken);
              API.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
              const retryResponse = await API.get('api/registrar_issue_management/');

              const retryData = Array.isArray(retryResponse.data) ? retryResponse.data : [];
              setIssues(retryData);
              setFilteredIssues(retryData);
              updateCounts(retryData);
              setLoading(false);
            } else {
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

    if (checkAuth()) {
      fetchIssues();
    }
  }, [navigate]);

  // Function to update counts
  const updateCounts = (data) => {
    const pending = data.filter(issue => issue.status === 'pending').length;
    const inProgress = data.filter(issue => issue.status === 'in_progress').length;
    const resolved = data.filter(issue => issue.status === 'resolved').length;

    setPendingCount(pending);
    setInProgressCount(inProgress);
    setResolvedCount(resolved);
  };

  // Handle search functionality
  useEffect(() => {
    // Debounce search requests by using a timer
    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim() === '') {
        // Reset to show all issues, but apply any active filter
        applyFilter(activeFilter, issues);
      } else {
        handleSearch();
      }
    }, 500); // 500ms delay

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, activeFilter, issues]);

  // New function to handle filtering
  const applyFilter = (filter, dataToFilter) => {
    let filtered = [...dataToFilter];
    
    // Apply status filter if not "all"
    if (filter !== 'all') {
      filtered = filtered.filter(issue => issue.status === filter);
    }
    
    // Also apply any search term if present
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(issue =>
        issue.id?.toString().includes(searchTerm) ||
        issue.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.studentNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.issue_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.issue_description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredIssues(filtered);
    // Don't update counts here to keep the cards showing total counts
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    applyFilter(filter, issues);
  };

  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      applyFilter(activeFilter, issues);
      return;
    }

    try {
      setIsSearching(true);
      // Use the filter_results endpoint for server-side filtering
      const response = await API.get(`api/registrar_issue_management/filter_results/?status=${searchTerm}`);
      
      if (response.data && Array.isArray(response.data)) {
        // Apply active filter to search results
        applyFilter(activeFilter, response.data);
      } else {
        // Fallback to client-side filtering
        const filtered = issues.filter(issue =>
          issue.id?.toString().includes(searchTerm) ||
          issue.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.studentNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.issue_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.issue_description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        applyFilter(activeFilter, filtered);
      }
    } catch (err) {
      console.error('Error searching issues:', err);
      // Fallback to client-side filtering
      const filtered = issues.filter(issue =>
        issue.id?.toString().includes(searchTerm) ||
        issue.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.studentNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.issue_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.issue_description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      applyFilter(activeFilter, filtered);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Open issue details modal
  const openIssueDetails = (issue) => {
    setSelectedIssue(issue);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedIssue(null);
  };

  // Filter dropdown component
  const FilterDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="filter-dropdown">
        <button 
          className="filter-button" 
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>Filter: {activeFilter === 'all' ? 'All' : 
                     activeFilter === 'pending' ? 'Pending' : 
                     activeFilter === 'in_progress' ? 'In Progress' : 
                     activeFilter === 'resolved' ? 'Resolved' : 'All'}</span>
          <span className="filter-icon">▼</span>
        </button>
        
        {isOpen && (
          <div className="filter-dropdown-content">
            <button 
              className={`filter-option ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => {
                handleFilterClick('all');
                setIsOpen(false);
              }}
            >
              All Issues
            </button>
            <button 
              className={`filter-option ${activeFilter === 'pending' ? 'active' : ''}`}
              onClick={() => {
                handleFilterClick('pending');
                setIsOpen(false);
              }}
            >
              Pending
            </button>
            <button 
              className={`filter-option ${activeFilter === 'in_progress' ? 'active' : ''}`}
              onClick={() => {
                handleFilterClick('in_progress');
                setIsOpen(false);
              }}
            >
              In Progress
            </button>
            <button 
              className={`filter-option ${activeFilter === 'resolved' ? 'active' : ''}`}
              onClick={() => {
                handleFilterClick('resolved');
                setIsOpen(false);
              }}
            >
              Resolved
            </button>
          </div>
        )}
      </div>
    );
  };

  if (loading && !isSearching) {
    return (
      <div className="app-container">
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

  if (error && !isSearching) {
    return (
      <div className="app-container">
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
    <div className="app-container">
      <NavBar />
      <div className="content-container">
        <Sidebar />
        <main className="main-content">
          <div className="main-content-wrapper">
            <div className="dashboard-header">
              <h1>Registrar Dashboard</h1>
            </div>
            <div className="dashboard-content">
              <div className="dashboard-cards-container">
                <div className="dashboard-cards">
                  <DashboardCard
                    title="Pending issues"
                    count={pendingCount}
                    description={`You currently have ${pendingCount} pending issue${pendingCount !== 1 ? 's' : ''}`}
                    onClick={() => handleFilterClick('pending')}
                    active={activeFilter === 'pending'}
                  />
                  <DashboardCard
                    title="In-progress issues"
                    count={inProgressCount}
                    description={`You currently have ${inProgressCount} in-progress issue${inProgressCount !== 1 ? 's' : ''}`}
                    onClick={() => handleFilterClick('in_progress')}
                    active={activeFilter === 'in_progress'}
                  />
                  <DashboardCard
                    title="Resolved issues"
                    count={resolvedCount}
                    description={`You currently have ${resolvedCount} resolved issue${resolvedCount !== 1 ? 's' : ''}`}
                    onClick={() => handleFilterClick('resolved')}
                    active={activeFilter === 'resolved'}
                  />
                </div>
              </div>
              <div className="issues-container">
                <div className="issues-section">
                  <div className="issues-header">
                    <h2>My issues</h2>
                    <div className="issues-controls">
                      <form onSubmit={handleSearchSubmit} className="search-container">
                        <input
                          type="text"
                          placeholder="Search for issues (status, student, type)"
                          className="search-input"
                          value={searchTerm}
                          onChange={handleSearchChange}
                        />
                        <button type="submit" className="search-button">
                          <span className="search-icon">🔍</span>
                        </button>
                      </form>
                      <FilterDropdown />
                    </div>
                  </div>
                  {/* Table Container */}
                  <div className="table-container">
                    {isSearching ? (
                      <div className="loading-message">Searching issues...</div>
                    ) : (
                      <table className="issues-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Issue</th>
                            <th>Status</th>
                            <th>Issue Type</th>
                            <th>Created</th>
                            <th>Updated</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredIssues.length > 0 ? (
                            filteredIssues.map((issue, index) => (
                              <tr key={issue.id || index} className={`status-row-${issue.status}`}>
                                <td>#{issue.id || 'N/A'}</td>
                                <td>{issue.description || issue.issue_description || 'N/A'}</td>
                                <td>
                                  <span className={`status-tag status-${issue.status}`}>
                                    {issue.status === 'pending' ? 'Pending' :
                                     issue.status === 'in_progress' ? 'In-progress' :
                                     issue.status === 'resolved' ? 'Resolved' : issue.status}
                                  </span>
                                </td>
                                <td>{issue.category || issue.issue_type || 'N/A'}</td>
                                <td>{formatDate(issue.date || issue.created_at)}</td>
                                <td>{formatDate(issue.updated_at || issue.date)}</td>
                                <td>
                                  <button
                                    className="view-details-btn"
                                    onClick={() => openIssueDetails(issue)}
                                  >
                                    View Details
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="7" className="no-issues-message">
                                {searchTerm || activeFilter !== 'all' ? 'No issues match your criteria' : 'No issues found'}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>
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
                      <div className="issue-detail-item">
                        <strong>ID:</strong> #{selectedIssue.id || 'N/A'}
                      </div>
                      {Object.entries(selectedIssue).map(([key, value]) => {
                        if (key === 'id') return null;
                        return (
                          <div key={key} className="issue-detail-item">
                            <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong>{' '}
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </div>
                        );
                      })}
                    </div>
                    <div className="issue-modal-footer">
                      <button className="modal-close-btn" onClick={closeModal}>Close</button>
                    </div>
                  </div>
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
const DashboardCard = ({ title, count, description, onClick, active }) => {
  return (
    <div 
      className={`dashboard-card ${active ? 'active-card' : ''}`} 
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <h3>{title}</h3>
      <div className="card-count">{count}</div>
      <p>{description}</p>
    </div>
  );
};

export default RegistrarDashboard;