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
  const [activeTab, setActiveTab] = useState('pending');

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
        // Reset to show all issues, but apply active tab filter
        applyFilter(activeTab, issues);
      } else {
        handleSearch();
      }
    }, 500); // 500ms delay

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, activeTab, issues]);

  // Function to handle filtering
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
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    applyFilter(tab, issues);
  };

  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      applyFilter(activeTab, issues);
      return;
    }

    try {
      setIsSearching(true);
      // Use the filter_results endpoint for server-side filtering
      const response = await API.get(`api/registrar_issue_management/filter_results/?status=${searchTerm}`);
      
      if (response.data && Array.isArray(response.data)) {
        // Apply active filter to search results
        applyFilter(activeTab, response.data);
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
        applyFilter(activeTab, filtered);
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
      applyFilter(activeTab, filtered);
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

  // Statistics Card Component
  const StatCard = ({ title, count, description, onClick, active }) => {
    return (
      <div 
        className={`stat-card ${active ? 'active-card' : ''}`} 
        onClick={onClick}
        style={{ cursor: 'pointer' }}
      >
        <h3>{title}</h3>
        <p className="stat-number">{count}</p>
        <p>{description}</p>
      </div>
    );
  };

  // Tab Navigation Component
  const TabNavigation = () => {
    const tabs = [
      { id: 'all', label: 'All' },
      { id: 'pending', label: 'Pending' },
      { id: 'in_progress', label: 'In-progress' },
      { id: 'resolved', label: 'Resolved' }
    ];
    
    return (
      <div className="issue-tabs">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>
    );
  };

  // Search and Filter Bar Component
  const SearchFilterBar = () => (
    <div className="search-filter-row">
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
      <button className="new-issue-btn">+ New Issue</button>
    </div>
  );

  // Issue Table Component
  const IssueTable = () => (
    <div className="table-container">
      {isSearching ? (
        <div className="loading-message">Searching issues...</div>
      ) : (
        <div className="issues-table">
          <div className="table-header">
            <div className="header-cell issue-id-header">ID</div>
            <div className="header-cell issue-header">Issue</div>
            <div className="header-cell status-header">Status</div>
            <div className="header-cell category-header">Issue Type</div>
            <div className="header-cell date-created-header">Created</div>
            <div className="header-cell date-updated-header">Updated</div>
            <div className="header-cell actions-header">Actions</div>
          </div>
          
          {filteredIssues.length > 0 ? (
            filteredIssues.map((issue, index) => (
              <div className={`table-row status-row-${issue.status}`} key={issue.id || index}>
                <div className="cell issue-id-cell">#{issue.id || 'N/A'}</div>
                <div className="cell issue-cell">{issue.description || issue.issue_description || 'N/A'}</div>
                <div className="cell status-cell">
                  <span className={`status-badge ${issue.status}`}>
                    {issue.status === 'pending' ? 'Pending' :
                     issue.status === 'in_progress' ? 'In-progress' :
                     issue.status === 'resolved' ? 'Resolved' : issue.status}
                  </span>
                </div>
                <div className="cell category-cell">{issue.category || issue.issue_type || 'N/A'}</div>
                <div className="cell date-created-cell">{formatDate(issue.date || issue.created_at)}</div>
                <div className="cell date-updated-cell">{formatDate(issue.updated_at || issue.date)}</div>
                <div className="cell actions-cell">
                  <button
                    className="view-details-btn"
                    onClick={() => openIssueDetails(issue)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="table-row">
              <div className="cell no-issues-message" style={{ gridColumn: '1 / span 7' }}>
                {searchTerm || activeTab !== 'all' ? 'No issues match your criteria' : 'No issues found'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Stats Overview Component
  const StatsOverview = () => {
    return (
      <div className="stats-cards">
        <StatCard
          title="Pending Issues"
          count={pendingCount}
          description={`You currently have ${pendingCount} pending issue${pendingCount !== 1 ? 's' : ''}`}
          onClick={() => handleTabClick('pending')}
          active={activeTab === 'pending'}
        />
        <StatCard
          title="In-progress Issues"
          count={inProgressCount}
          description={`You currently have ${inProgressCount} in-progress issue${inProgressCount !== 1 ? 's' : ''}`}
          onClick={() => handleTabClick('in_progress')}
          active={activeTab === 'in_progress'}
        />
        <StatCard
          title="Resolved Issues"
          count={resolvedCount}
          description={`You currently have ${resolvedCount} resolved issue${resolvedCount !== 1 ? 's' : ''}`}
          onClick={() => handleTabClick('resolved')}
          active={activeTab === 'resolved'}
        />
      </div>
    );
  };

  if (loading && !isSearching) {
    return (
      <div className="app-container">
        <NavBar />
        <div className="content-wrapper">
          <Sidebar />
          <div className="dashboard-content">
            <div className="loading-message">Loading issues...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !isSearching) {
    return (
      <div className="app-container">
        <NavBar />
        <div className="content-wrapper">
          <Sidebar />
          <div className="dashboard-content">
            <div className="error-message">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <NavBar />
      <div className="content-wrapper">
        <Sidebar />
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1>Registrar Dashboard</h1>
          </div>
          
          <StatsOverview />
          
          <div className="issues-section">
            <SearchFilterBar />
            <TabNavigation />
            <IssueTable />
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
    </div>
  );
};

export default RegistrarDashboard;