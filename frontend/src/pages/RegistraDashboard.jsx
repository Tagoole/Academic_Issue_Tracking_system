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
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [selectedIssue, setSelectedIssue] = useState(null); // State for selected issue

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

        setIssues(response.data);
        setFilteredIssues(response.data);

        const pending = response.data.filter(issue => issue.status === 'pending').length;
        const inProgress = response.data.filter(issue => issue.status === 'in_progress').length; // Fixed typo: 'in_rogress' to 'in_progress'
        const resolved = response.data.filter(issue => issue.status === 'resolved').length;

        setPendingCount(pending);
        setInProgressCount(inProgress);
        setResolvedCount(resolved);
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

              setIssues(retryResponse.data);
              setFilteredIssues(retryResponse.data);

              const pending = retryResponse.data.filter(issue => issue.status === 'pending').length;
              const inProgress = retryResponse.data.filter(issue => issue.status === 'in_progress').length;
              const resolved = retryResponse.data.filter(issue => issue.status === 'resolved').length;

              setPendingCount(pending);
              setInProgressCount(inProgress);
              setResolvedCount(resolved);
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

  useEffect(() => {
    const applyFilters = () => {
      let filtered = issues;

      // Filter by status
      if (statusFilter !== 'all') {
        filtered = filtered.filter((issue) => issue.status.toLowerCase() === statusFilter.toLowerCase());
      }

      // Filter by category
      if (categoryFilter !== 'all') {
        filtered = filtered.filter((issue) => issue.category.toLowerCase() === categoryFilter.toLowerCase());
      }

      // Search by Issue ID, Student Number, or Category
      if (searchTerm.trim() !== '') {
        filtered = filtered.filter(
          (issue) =>
            issue.id.toString().includes(searchTerm) ||
            issue.studentNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            issue.category?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredIssues(filtered);
    };

    applyFilters();
  }, [statusFilter, categoryFilter, searchTerm, issues]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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
              </div>
              <div className="issues-container">
                <div className="issues-section">
                  <div className="issues-header">
                    <h2>My issues</h2>
                    <div className="issues-controls">
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
                  </div>
                  <div className="filter-controls">
                    <div className="select-wrapper">
                      <select
                        className="status-filter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                      <span className="dropdown-arrow"></span>
                    </div>
                    <div className="select-wrapper">
                      <select
                        className="category-filter"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                      >
                        <option value="all">All Categories</option>
                        <option value="Missing Marks">Missing Marks</option>
                        <option value="Wrong Marks">Wrong Marks</option>
                        <option value="Other">Other</option>
                      </select>
                      <span className="dropdown-arrow"></span>
                    </div>
                    <div className="search-bar">
                      <input
                        type="text"
                        placeholder="Search by Issue ID, Student No, or Category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  {/* New Table Container */}
                  <div className="table-container">
                    {loading ? (
                      <div className="loading-message">Loading issues...</div>
                    ) : error ? (
                      <div className="error-message">{error}</div>
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
                              <tr key={issue.id || index}>
                                <td>#{issue.id || 'N/A'}</td>
                                <td>{issue.description || 'N/A'}</td>
                                <td>
                                  <span className={`status-tag status-${issue.status}`}>
                                    {issue.status === 'pending' ? 'Pending' :
                                     issue.status === 'in_progress' ? 'In Progress' :
                                     issue.status === 'resolved' ? 'Resolved' : issue.status}
                                  </span>
                                </td>
                                <td>{issue.category || 'N/A'}</td>
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
                                {searchTerm ? 'No issues match your search' : 'No issues found'}
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
                            <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong>
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