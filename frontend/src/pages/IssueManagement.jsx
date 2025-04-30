import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './NavBar';
import Sidebar from './Sidebar';
import API from '../api.js';
import './IssueManagement.css';

const IssueManagement = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [issueStatus, setIssueStatus] = useState('all'); // Unified filter state
  const [showLecturersDropdown, setShowLecturersDropdown] = useState(false);
  const [activeIssueId, setActiveIssueId] = useState(null);
  const [showActionsDropdown, setShowActionsDropdown] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [editingIssue, setEditingIssue] = useState({ lecturer: '', status: '' });
  const [pendingCount, setPendingCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Authentication and data fetching
  useEffect(() => {
    const checkAuth = () => {
      const accessToken = localStorage.getItem('accessToken');
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
        setLecturers(response.data);
      } catch (err) {
        console.error('Error fetching lecturers:', err);
      }
    };

    const fetchIssues = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        const response = await API.get('api/registrar_issue_management/');
        const issuesData = Array.isArray(response.data) ? response.data : [];
        setIssues(issuesData);
        applyFilter(issueStatus, issuesData);

        updateCounts(issuesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching issues:', err);
        if (err.response && err.response.status === 401) {
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const refreshResponse = await API.post('/api/refresh_token/', { refresh: refreshToken });
              const newAccessToken = refreshResponse.data.access;
              localStorage.setItem('accessToken', newAccessToken);
              API.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
              const retryResponse = await API.get('api/registrar_issue_management/');
              const retryData = Array.isArray(retryResponse.data) ? retryResponse.data : [];
              setIssues(retryData);
              applyFilter(issueStatus, retryData);
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
      fetchLecturers();
    }
  }, [navigate]);

  // Update issue counts
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

  // Search functionality
  const performSearch = async () => {
    if (!searchTerm.trim()) {
      applyFilter(issueStatus, issues);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const accessToken = localStorage.getItem('accessToken');
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      const response = await API.get(`api/registrar_issue_management/filter_results/?status=${searchTerm}`);
      const searchResults = Array.isArray(response.data) ? response.data : [];
      applyFilter(issueStatus, searchResults);
      setIsSearching(false);
    } catch (err) {
      console.error('Error searching issues:', err);
      const filtered = issues.filter(issue =>
        (issue.id?.toString().includes(searchTerm) ||
         issue.student?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         issue.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         issue.issue_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         issue.year_of_study?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      applyFilter(issueStatus, filtered);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      performSearch();
    }, 500);
    return () => clearTimeout(delaySearch);
  }, [searchTerm, issues, issueStatus]);

  // Filter logic
  const applyFilter = (filter, data) => {
    let filtered = [...data];
    if (filter !== 'all') {
      filtered = filtered.filter(issue => issue.status === filter);
    }
    setFilteredIssues(filtered);
  };

  const handleFilterClick = (status) => {
    setIssueStatus(status);
    setSearchTerm('');
    setShowFilterDropdown(false);
    applyFilter(status, issues);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performSearch();
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    applyFilter(issueStatus, issues);
  };

  // Modal and issue actions
  const handleViewDetails = (issueId, editMode = true) => {
    const issue = issues.find(issue => issue.id === issueId);
    if (issue) {
      setSelectedIssue(issue);
      setEditingIssue({
        lecturer: issue.lecturer?.id || '',
        status: issue.status || 'pending'
      });
      setShowModal(true);
      setShowActionsDropdown(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedIssue(null);
    setEditingIssue({ lecturer: '', status: '' });
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

      const escalationData = { status: 'in_progress', lecturer: lecturer.id };
      const accessToken = localStorage.getItem('accessToken');
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      await API.patch(`api/registrar_issue_management/${issue.id}/`, escalationData);

      setIssues(prevIssues =>
        prevIssues.map(i =>
          i.id === issue.id ? { ...i, status: 'in_progress', lecturer } : i
        )
      );

      setFilteredIssues(prevFiltered => {
        if (issueStatus === 'pending') {
          return prevFiltered.filter(i => i.id !== issue.id);
        } else if (issueStatus === 'in_progress' || issueStatus === 'all') {
          return prevFiltered.map(i =>
            i.id === issue.id ? { ...i, status: 'in_progress', lecturer } : i
          );
        }
        return prevFiltered;
      });

      updateCounts(issues.map(i =>
        i.id === issue.id ? { ...i, status: 'in_progress', lecturer } : i
      ));

      setShowLecturersDropdown(false);
      setActiveIssueId(null);
      alert(`Issue #${issue.id} escalated to ${lecturer.username}`);
    } catch (error) {
      console.error('Error escalating issue:', error);
      alert('Failed to escalate issue.');
      setShowLecturersDropdown(false);
    }
  };

  const handleRejectIssue = async (issueId) => {
    try {
      const issue = issues.find((i) => i.id === issueId);
      if (!issue) return;

      const rejectionData = { status: 'rejected', lecturer: null };
      const accessToken = localStorage.getItem('accessToken');
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      await API.patch(`api/registrar_issue_management/${issue.id}/`, rejectionData);

      setIssues(prevIssues =>
        prevIssues.map(i =>
          i.id === issue.id ? { ...i, status: 'rejected', lecturer: null } : i
        )
      );

      setFilteredIssues(prevFiltered => {
        if (issueStatus !== 'rejected' && issueStatus !== 'all') {
          return prevFiltered.filter(i => i.id !== issue.id);
        }
        return prevFiltered.map(i =>
          i.id === issue.id ? { ...i, status: 'rejected', lecturer: null } : i
        );
      });

      updateCounts(issues.map(i =>
        i.id === issue.id ? { ...i, status: 'rejected', lecturer: null } : i
      ));

      alert(`Issue #${issue.id} rejected`);
      setShowActionsDropdown(null);
    } catch (error) {
      console.error('Error rejecting issue:', error);
      alert('Failed to reject issue.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingIssue({ ...editingIssue, [name]: value });
  };

  const handleUpdateIssue = async () => {
    try {
      if (!selectedIssue) return;
      const accessToken = localStorage.getItem('accessToken');
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      const previousStatus = selectedIssue.status;
      const selectedLecturer = lecturers.find(l => l.id.toString() === editingIssue.lecturer.toString());

      const updateData = {
        lecturer: editingIssue.lecturer || null,
        status: editingIssue.status
      };

      await API.patch(`api/registrar_issue_management/${selectedIssue.id}/`, updateData);

      setIssues(prevIssues =>
        prevIssues.map(i =>
          i.id === selectedIssue.id ? {
            ...i,
            status: editingIssue.status,
            lecturer: selectedLecturer || null
          } : i
        )
      );

      setFilteredIssues(prevFiltered => {
        if (issueStatus !== 'all' && previousStatus === issueStatus && editingIssue.status !== issueStatus) {
          return prevFiltered.filter(i => i.id !== selectedIssue.id);
        } else if (issueStatus === 'all' || editingIssue.status === issueStatus) {
          return prevFiltered.map(i =>
            i.id === selectedIssue.id ? {
              ...i,
              status: editingIssue.status,
              lecturer: selectedLecturer || null
            } : i
          );
        }
        return prevFiltered;
      });

      updateCounts(issues.map(i =>
        i.id === selectedIssue.id ? {
          ...i,
          status: editingIssue.status,
          lecturer: selectedLecturer || null
        } : i
      ));

      closeModal();
      alert(`Issue #${selectedIssue.id} updated successfully`);
    } catch (error) {
      console.error('Error updating issue:', error);
      alert('Failed to update issue.');
    }
  };

  // Dropdown handling
  const toggleActionsDropdown = (issueId) => {
    setShowActionsDropdown(showActionsDropdown === issueId ? null : issueId);
    setShowLecturersDropdown(false);
    setActiveIssueId(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowActionsDropdown(null);
        setShowLecturersDropdown(false);
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Date formatting
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

  // Filter Dropdown Component
  const FilterDropdown = () => (
    <div className="filter-dropdown" ref={dropdownRef}>
      <button
        className="filter-button"
        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
      >
        <span>
          Filter: {issueStatus === 'all' ? 'All' :
            issueStatus === 'pending' ? 'Pending' :
              issueStatus === 'in_progress' ? 'In Progress' :
                issueStatus === 'resolved' ? 'Resolved' : 'Rejected'}
        </span>
        <span className="filter-icon">▼</span>
      </button>
      {showFilterDropdown && (
        <div className="filter-dropdown-content">
          {['all', 'pending', 'in_progress', 'resolved', 'rejected'].map(status => (
            <button
              key={status}
              className={`filter-option ${issueStatus === status ? 'active' : ''}`}
              onClick={() => handleFilterClick(status)}
            >
              {status === 'all' ? 'All Issues' :
                status === 'pending' ? 'Pending' :
                  status === 'in_progress' ? 'In Progress' :
                    status === 'resolved' ? 'Resolved' : 'Rejected'}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Dashboard Card Component
  const DashboardCard = ({ title, count, description, status }) => (
    <div
      className={`dashboard-card ${issueStatus === status ? 'active-card' : ''}`}
      onClick={() => handleFilterClick(status)}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-header">
        <h3>{title}</h3>
        <span className="card-count">{count}</span>
      </div>
      <p className="card-description">{description}</p>
    </div>
  );

  if (loading && !isSearching) {
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
          <h1 className="issues-title">Registrar Issue Management <span className="subtitle">(Click an issue to view/edit)</span></h1>
          <div className="dashboard-cards">
            <DashboardCard
              title="Pending Issues"
              count={pendingCount}
              description={`You have ${pendingCount} pending issue${pendingCount !== 1 ? 's' : ''}`}
              status="pending"
            />
            <DashboardCard
              title="In-progress Issues"
              count={inProgressCount}
              description={`You have ${inProgressCount} in-progress issue${inProgressCount !== 1 ? 's' : ''}`}
              status="in_progress"
            />
            <DashboardCard
              title="Resolved Issues"
              count={resolvedCount}
              description={`You have ${resolvedCount} resolved issue${resolvedCount !== 1 ? 's' : ''}`}
              status="resolved"
            />
            <DashboardCard
              title="Rejected Issues"
              count={rejectedCount}
              description={`You have ${rejectedCount} rejected issue${rejectedCount !== 1 ? 's' : ''}`}
              status="rejected"
            />
          </div>
          <div className="issues-controls">
            <form onSubmit={handleSearchSubmit} className="search-filter-container">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search by ID, student, issue type..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                {searchTerm && (
                  <button type="button" className="clear-search" onClick={handleClearSearch}>×</button>
                )}
              </div>
              <button type="submit" className="filter-btn">{isSearching ? 'Searching...' : 'Search'}</button>
            </form>
            <FilterDropdown />
          </div>
          <div className="responsive-table-wrapper">
            <table className="issues-table">
              <thead>
                <tr>
                  <th>Issue ID</th>
                  <th>Student</th>
                  <th>Issue Type</th>
                  <th>Lecturer</th>
                  <th>Year of Study</th>
                  <th>Created</th>
                  <th>Updated</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.length > 0 ? filteredIssues.map(issue => (
                  <tr key={issue.id} className={`issue-row status-row-${issue.status}`}>
                    <td>{issue.id}</td>
                    <td>{issue.student?.username || 'N/A'}</td>
                    <td>{issue.issue_type || issue.category || 'N/A'}</td>
                    <td>{issue.lecturer?.username || 'Not Assigned'}</td>
                    <td>{issue.year_of_study?.replace('_', ' ') || 'N/A'}</td>
                    <td>{formatDate(issue.created_at || issue.date)}</td>
                    <td>{formatDate(issue.updated_at || issue.date)}</td>
                    <td>
                      <span className={`status-pill status-${issue.status}`}>
                        {issue.status === 'pending' ? 'Pending' :
                          issue.status === 'in_progress' ? 'In-progress' :
                            issue.status === 'resolved' ? 'Resolved' :
                              issue.status === 'rejected' ? 'Rejected' : issue.status}
                      </span>
                    </td>
                    <td className="action-column" ref={dropdownRef}>
                      <div className="dropdown-container">
                        <button className="action-dropdown-btn" onClick={() => toggleActionsDropdown(issue.id)}>:</button>
                        {showActionsDropdown === issue.id && (
                          <div className="actions-dropdown">
                            <button className="dropdown-item view-details-btn" onClick={() => handleViewDetails(issue.id)}>View/Edit</button>
                            {issue.status === 'pending' && (
                              <>
                                <button className="dropdown-item" onClick={() => handleEscalateIssue(issue.id)}>Escalate</button>
                                <button className="dropdown-item reject-btn" onClick={() => handleRejectIssue(issue.id)}>Reject</button>
                              </>
                            )}
                          </div>
                        )}
                        {showLecturersDropdown && activeIssueId === issue.id && (
                          <div className="lecturers-dropdown">
                            <div className="dropdown-header">Select Lecturer:</div>
                            {lecturers.length > 0 ? lecturers.map(lecturer => (
                              <button
                                key={lecturer.id}
                                className="dropdown-item lecturer-item"
                                onClick={() => handleLecturerSelect(lecturer.id)}
                              >
                                {lecturer.username}
                              </button>
                            )) : <div className="no-lecturers">No lecturers available</div>}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="9" className="no-issues-message">
                      {searchTerm ? 'No issues match your search' : `No ${issueStatus === 'all' ? '' : issueStatus} issues found`}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {showModal && selectedIssue && (
            <div className="issue-details-modal">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Issue Details - #{selectedIssue.id}</h2>
                  <button className="close-modal-btn" onClick={closeModal}>×</button>
                </div>
                <div className="modal-body">
                  <div className="issue-detail-row">
                    <span className="detail-label">Student:</span>
                    <span className="detail-value">{selectedIssue.student?.username || 'N/A'}</span>
                  </div>
                  <div className="issue-detail-row">
                    <span className="detail-label">Issue Type:</span>
                    <span className="detail-value">{selectedIssue.issue_type || selectedIssue.category || 'N/A'}</span>
                  </div>
                  <div className="issue-detail-row">
                    <span className="detail-label">Year of Study:</span>
                    <span className="detail-value">{selectedIssue.year_of_study?.replace('_', ' ') || 'N/A'}</span>
                  </div>
                  <div className="issue-detail-row">
                    <span className="detail-label">Created:</span>
                    <span className="detail-value">{formatDate(selectedIssue.created_at || selectedIssue.date)}</span>
                  </div>
                  <div className="issue-detail-row">
                    <span className="detail-label">Last Updated:</span>
                    <span className="detail-value">{formatDate(selectedIssue.updated_at || selectedIssue.date)}</span>
                  </div>
                  <div className="issue-detail-row">
                    <span className="detail-label">Assigned To:</span>
                    <div className="detail-input">
                      <select
                        name="lecturer"
                        value={editingIssue.lecturer}
                        onChange={handleInputChange}
                        className="form-select"
                      >
                        <option value="">Select Lecturer</option>
                        {lecturers.map(lecturer => (
                          <option key={lecturer.id} value={lecturer.id}>{lecturer.username}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="issue-detail-row">
                    <span className="detail-label">Status:</span>
                    <div className="detail-input">
                      <select
                        name="status"
                        value={editingIssue.status}
                        onChange={handleInputChange}
                        className="form-select"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                  <div className="issue-detail-row">
                    <span className="detail-label">Description:</span>
                    <div className="detail-value description-box">
                      {selectedIssue.description || selectedIssue.issue_description || 'No description provided'}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="cancel-btn" onClick={closeModal}>Cancel</button>
                  <button className="save-btn" onClick={handleUpdateIssue}>Save Changes</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IssueManagement;