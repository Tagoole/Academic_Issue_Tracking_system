import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegistraDashboard.css';
import NavBar from './NavBar';
import Sidebar from './Sidebar';
import API from '../api.js';
import { toast } from 'react-toastify';

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
  const [rejectedCount, setRejectedCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const checkAuth = () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        toast.error("Session expired. Please log in again.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
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
        const response = await API.get('/api/registrar_issue_management/');
        console.log("API Response:", response.data);

        const issuesData = Array.isArray(response.data) ? response.data : [];
        setIssues(issuesData);
        setFilteredIssues(issuesData);

        updateCounts(issuesData);
        setLoading(false);

        // Show success toast for data loading
        toast.success("Issues loaded successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } catch (err) {
        console.error('Error fetching registrar issues:', err);
        if (err.response && err.response.status === 401) {
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              toast.info("Refreshing your session...", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });

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

              // Show success toast for session refresh
              toast.success("Session refreshed successfully", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
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

  const updateCounts = (data) => {
    const pending = data.filter(issue => issue.status === 'pending').length;
    const inProgress = data.filter(issue => issue.status === 'in_progress').length;
    const resolved = data.filter(issue => issue.status === 'resolved').length;
    const rejected = data.filter(issue => issue.status === 'rejected').length;

    setPendingCount(pending);
    setInProgressCount(inProgress);
    setResolvedCount(resolved);
    setRejectedCount(rejected);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim() === '') {
        applyFilter(activeFilter, issues);
      } else {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, activeFilter, issues]);

  const applyFilter = (filter, dataToFilter) => {
    let filtered = [...dataToFilter];
    
    if (filter !== 'all') {
      filtered = filtered.filter(issue => issue.status === filter);
    }
    
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

    // Show info toast when a filter is applied (not for "all")
    if (filter !== 'all') {
      toast.info(`Showing ${filter.replace('_', '-')} issues`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
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
      toast.info("Searching issues...", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      const response = await API.get(`api/registrar_issue_management/filter_results/?status=${searchTerm}`);
      
      if (response.data && Array.isArray(response.data)) {
        applyFilter(activeFilter, response.data);
        toast.success(`Search completed. Found ${response.data.length} issues.`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
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
        toast.success(`Search completed. Found ${filtered.length} issues.`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (err) {
      console.error('Error searching issues:', err);
      toast.warning("Search using server failed. Showing local results.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const openIssueDetails = (issue) => {
    setSelectedIssue(issue);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedIssue(null);
  };

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

  const TabNavigation = () => {
    const tabs = [
      { id: 'all', label: 'All' },
      { id: 'pending', label: 'Pending' },
      { id: 'in_progress', label: 'In-progress' },
      { id: 'resolved', label: 'Resolved' },
      { id: 'rejected', label: 'Rejected' }
    ];
    
    return (
      <div className="issue-tabs">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`tab ${activeFilter === tab.id ? 'active' : ''}`}
            onClick={() => handleFilterClick(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>
    );
  };

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
                     activeFilter === 'resolved' ? 'Resolved' : 
                     activeFilter === 'rejected' ? 'Rejected' : 'All'}</span>
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
            <button 
              className={`filter-option ${activeFilter === 'rejected' ? 'active' : ''}`}
              onClick={() => {
                handleFilterClick('rejected');
                setIsOpen(false);
              }}
            >
              Rejected
            </button>
          </div>
        )}
      </div>
    );
  };

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
          <span className="search-icon"></span>
        </button>
      </form>
      <div className="filter-controls">
        <FilterDropdown />
      </div>
    </div>
  );

  const IssueTable = () => (
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
                       issue.status === 'resolved' ? 'Resolved' :
                       issue.status === 'rejected' ? 'Rejected' : issue.status}
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
  );

  const StatsOverview = () => {
    return (
      <div className="stats-cards">
        <StatCard
          title="Pending Issues"
          count={pendingCount}
          description={`You currently have ${pendingCount} pending issue${pendingCount !== 1 ? 's' : ''}`}
          onClick={() => handleFilterClick('pending')}
          active={activeFilter === 'pending'}
        />
        <StatCard
          title="In-progress Issues"
          count={inProgressCount}
          description={`You currently have ${inProgressCount} in-progress issue${inProgressCount !== 1 ? 's' : ''}`}
          onClick={() => handleFilterClick('in_progress')}
          active={activeFilter === 'in_progress'}
        />
        <StatCard
          title="Resolved Issues"
          count={resolvedCount}
          description={`You currently have ${resolvedCount} resolved issue${resolvedCount !== 1 ? 's' : ''}`}
          onClick={() => handleFilterClick('resolved')}
          active={activeFilter === 'resolved'}
        />
        <StatCard
          title="Rejected Issues"
          count={rejectedCount}
          description={`You currently have ${rejectedCount} rejected issue${rejectedCount !== 1 ? 's' : ''}`}
          onClick={() => handleFilterClick('rejected')}
          active={activeFilter === 'rejected'}
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