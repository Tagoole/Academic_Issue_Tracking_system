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
  const [isSearching, setIsSearching] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [editingIssue, setEditingIssue] = useState({
    lecturer: '',
    status: ''
  });
  const [pendingCount, setPendingCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);

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
        setIssues(response.data);
        setFilteredIssues(response.data.filter(issue => issue.status === issueStatus));

        const pending = response.data.filter(issue => issue.status === 'pending').length;
        const inProgress = response.data.filter(issue => issue.status === 'in_progress').length;
        const resolved = response.data.filter(issue => issue.status === 'resolved').length;
        const rejected = response.data.filter(issue => issue.status === 'rejected').length;

        setPendingCount(pending);
        setInProgressCount(inProgress);
        setResolvedCount(resolved);
        setRejectedCount(rejected);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching registrar issues:', err);
        if (err.response && err.response.status === 401) {
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const refreshResponse = await API.post('/api/refresh_token/', { refresh: refreshToken });
              const newAccessToken = refreshResponse.data.access;
              localStorage.setItem('accessToken', newAccessToken);
              API.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
              const retryResponse = await API.get('api/registrar_issue_management/');
              setIssues(retryResponse.data);
              setFilteredIssues(retryResponse.data.filter(issue => issue.status === issueStatus));

              const pending = retryResponse.data.filter(issue => issue.status === 'pending').length;
              const inProgress = retryResponse.data.filter(issue => issue.status === 'in_progress').length;
              const resolved = retryResponse.data.filter(issue => issue.status === 'resolved').length;
              const rejected = retryResponse.data.filter(issue => issue.status === 'rejected').length;

              setPendingCount(pending);
              setInProgressCount(inProgress);
              setResolvedCount(resolved);
              setRejectedCount(rejected);
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
  }, [navigate, issueStatus]);

  const performSearch = async () => {
    if (!searchTerm.trim()) {
      setFilteredIssues(issues.filter(issue => issue.status === issueStatus));
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const accessToken = localStorage.getItem('accessToken');
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      const response = await API.get(`api/registrar_issue_management/filter_results/?status=${searchTerm}`);
      const statusFiltered = response.data.filter(issue => issue.status === issueStatus);
      setFilteredIssues(statusFiltered);
      setIsSearching(false);
    } catch (err) {
      console.error('Error searching issues:', err);
      setIsSearching(false);
      const filtered = issues.filter(issue =>
        issue.status === issueStatus &&
        (issue.id.toString().includes(searchTerm) ||
        (issue.student?.username && issue.student.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (issue.description && issue.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (issue.issue_type && issue.issue_type.toLowerCase().includes(searchTerm.toLowerCase())))
      );
      setFilteredIssues(filtered);
    }
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      performSearch();
    }, 500);
    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (status) => {
    setIssueStatus(status.toLowerCase());
    setSearchTerm('');
    setFilteredIssues(issues.filter(issue => issue.status.toLowerCase() === status.toLowerCase()));
  };

  const handleViewDetails = (issueId) => {
    const issue = issues.find(issue => issue.id === issueId);
    if (issue) {
      setSelectedIssue(issue);
      setEditingIssue({
        lecturer: issue.lecturer?.id || '',
        status: issue.status || 'pending'
      });
      setShowDetailsModal(true);
      setShowActionsDropdown(null);
    }
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
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

      const escalationData = {
        status: 'in_progress',
        lecturer: lecturer.id
      };

      const accessToken = localStorage.getItem('accessToken');
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      const response = await API.patch(`api/registrar_issue_management/${issue.id}/`, escalationData);

      setIssues((prevIssues) =>
        prevIssues.map((i) =>
          i.id === issue.id ? { ...i, status: 'in_progress', lecturer: lecturer } : i
        )
      );

      setShowLecturersDropdown(false);
      setActiveIssueId(null);
      setInProgressCount(prev => prev + 1);
      setPendingCount(prev => prev - 1);

      setFilteredIssues((prevFiltered) => {
        if (issueStatus === 'pending') {
          return prevFiltered.filter((i) => i.id !== issue.id);
        } else if (issueStatus === 'in_progress') {
          return prevFiltered.map((i) =>
            i.id === issue.id ? { ...i, status: 'in_progress', lecturer: lecturer } : i
          );
        }
        return prevFiltered;
      });

      alert(`Issue #${issue.id} has been escalated to ${lecturer.username}`);
    } catch (error) {
      console.error('Error escalating issue:', error);
      alert('Failed to escalate issue. Please try again.');
      setShowLecturersDropdown(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingIssue({
      ...editingIssue,
      [name]: value
    });
  };

  const handleUpdateIssue = async () => {
    try {
      if (!selectedIssue) return;
      const accessToken = localStorage.getItem('accessToken');
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      const previousStatus = selectedIssue.status;

      const updateData = {
        lecturer: editingIssue.lecturer,
        status: editingIssue.status
      };

      const response = await API.patch(`api/registrar_issue_management/${selectedIssue.id}/`, updateData);
      const selectedLecturer = lecturers.find(l => l.id.toString() === editingIssue.lecturer.toString());

      setIssues((prevIssues) =>
        prevIssues.map((i) =>
          i.id === selectedIssue.id ? {
            ...i,
            status: editingIssue.status,
            lecturer: selectedLecturer || i.lecturer
          } : i
        )
      );

      setFilteredIssues((prevFiltered) => {
        if (previousStatus === issueStatus && editingIssue.status !== issueStatus) {
          return prevFiltered.filter((i) => i.id !== selectedIssue.id);
        } else if (editingIssue.status === issueStatus) {
          return prevFiltered.map((i) =>
            i.id === selectedIssue.id ? {
              ...i,
              status: editingIssue.status,
              lecturer: selectedLecturer || i.lecturer
            } : i
          );
        }
        return prevFiltered;
      });

      if (previousStatus !== editingIssue.status) {
        if (previousStatus === 'pending') setPendingCount(prev => prev - 1);
        else if (previousStatus === 'in_progress') setInProgressCount(prev => prev - 1);
        else if (previousStatus === 'resolved') setResolvedCount(prev => prev - 1);
        else if (previousStatus === 'rejected') setRejectedCount(prev => prev - 1);

        if (editingIssue.status === 'pending') setPendingCount(prev => prev + 1);
        else if (editingIssue.status === 'in_progress') setInProgressCount(prev => prev + 1);
        else if (editingIssue.status === 'resolved') setResolvedCount(prev => prev + 1);
        else if (editingIssue.status === 'rejected') setRejectedCount(prev => prev + 1);
      }

      closeDetailsModal();
      alert(`Issue #${selectedIssue.id} has been updated successfully`);
    } catch (error) {
      console.error('Error updating issue:', error);
      alert('Failed to update issue. Please try again.');
    }
  };

  const handleRejectIssue = async (issueId) => {
    try {
      const issue = issues.find((i) => i.id === issueId);
      if (!issue) return;

      const rejectionData = {
        status: 'rejected',
        lecturer: null
      };

      const accessToken = localStorage.getItem('accessToken');
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      const response = await API.patch(`api/registrar_issue_management/${issue.id}/`, rejectionData);

      setIssues((prevIssues) =>
        prevIssues.map((i) =>
          i.id === issue.id ? { ...i, status: 'rejected', lecturer: null } : i
        )
      );

      setFilteredIssues((prevFiltered) => {
        if (issueStatus !== 'rejected') {
          return prevFiltered.filter((i) => i.id !== issue.id);
        } else {
          return [...prevFiltered, { ...issue, status: 'rejected', lecturer: null }];
        }
      });

      if (issue.status === 'pending') setPendingCount(prev => prev - 1);
      else if (issue.status === 'in_progress') setInProgressCount(prev => prev - 1);
      setRejectedCount(prev => prev + 1);

      alert(`Issue #${issue.id} has been rejected`);
      setShowActionsDropdown(null);
    } catch (error) {
      console.error('Error rejecting issue:', error);
      alert('Failed to reject issue. Please try again.');
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowActionsDropdown(null);
        setShowLecturersDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performSearch();
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setFilteredIssues(issues.filter(issue => issue.status === issueStatus));
  };

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
          <h1 className="issues-title">Issues <span className="subtitle">(Kindly click on the issue to open it.)</span></h1>
          <div className="dashboard-cards">
            <DashboardCard title="Pending Issues" count={pendingCount} description={`You currently have ${pendingCount} pending issue${pendingCount !== 1 ? 's' : ''}`} />
            <DashboardCard title="In-progress Issues" count={inProgressCount} description={`You currently have ${inProgressCount} in-progress issue${inProgressCount !== 1 ? 's' : ''}`} />
            <DashboardCard title="Resolved Issues" count={resolvedCount} description={`You currently have ${resolvedCount} resolved issue${resolvedCount !== 1 ? 's' : ''}`} />
            <DashboardCard title="Rejected Issues" count={rejectedCount} description={`You currently have ${rejectedCount} rejected issue${rejectedCount !== 1 ? 's' : ''}`} />
          </div>
          <div className="issues-tabs">
            <button className={`issues-tab ${issueStatus === 'pending' ? 'active' : ''}`} onClick={() => handleStatusChange('pending')}>Pending</button>
            <button className={`issues-tab ${issueStatus === 'in_progress' ? 'active' : ''}`} onClick={() => handleStatusChange('in_progress')}>In-progress</button>
            <button className={`issues-tab ${issueStatus === 'resolved' ? 'active' : ''}`} onClick={() => handleStatusChange('resolved')}>Resolved</button>
            <button className={`issues-tab ${issueStatus === 'rejected' ? 'active' : ''}`} onClick={() => handleStatusChange('rejected')}>Rejected</button>
          </div>
          <form onSubmit={handleSearchSubmit} className="search-filter-container">
            <div className="search-container">
              <input type="text" placeholder="Search by ID, student, issue type..." value={searchTerm} onChange={handleSearchChange} className="search-input" />
              {searchTerm && <button type="button" className="clear-search" onClick={handleClearSearch}>×</button>}
            </div>
            <button type="submit" className="filter-btn">{isSearching ? 'Searching...' : 'Filter'}</button>
          </form>
          <div className="responsive-table-wrapper">
            <table className="issues-table">
              <thead>
                <tr>
                  <th>Issue ID</th>
                  <th>Student</th>
                  <th>Category</th>
                  <th>Lecturer</th>
                  <th>Year of Study</th>
                  <th>Created</th>
                  <th>Updated</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.length > 0 ? (
                  filteredIssues.map((issue) => (
                    <tr key={issue.id} className="issue-row">
                      <td>{issue.id || 'N/A'}</td>
                      <td>{issue.student?.username || 'N/A'}</td>
                      <td>{issue.issue_type || 'N/A'}</td>
                      <td>{issue.lecturer?.username || 'Not Assigned'}</td>
                      <td>{issue.year_of_study?.replace('_', ' ') || 'N/A'}</td>
                      <td>{formatDate(issue.created_at)}</td>
                      <td>{formatDate(issue.updated_at)}</td>
                      <td>
                        <span className={`status-pill status-${issue.status}`}>
                          {issue.status === 'pending'
                            ? 'Pending'
                            : issue.status === 'in_progress'
                            ? 'In-progress'
                            : issue.status === 'resolved'
                            ? 'Resolved'
                            : issue.status === 'rejected'
                            ? 'Rejected'
                            : issue.status}
                        </span>
                      </td>
                      <td className="action-column">
                        <div className="dropdown-container" ref={dropdownRef}>
                          <button
                            className="action-dropdown-btn"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent event bubbling
                              toggleActionsDropdown(issue.id);
                            }}
                          >
                            ⋮ {/* Using a better vertical ellipsis character */}
                          </button>
                          {showActionsDropdown === issue.id && (
                            <div className="actions-dropdown">
                              <button
                                className="dropdown-item view-details-btn"
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent event bubbling
                                  handleViewDetails(issue.id);
                                }}
                              >
                                View Details
                              </button>
                              {issue.status === 'pending' && (
                                <>
                                  <button
                                    className="dropdown-item escalate-btn"
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent event bubbling
                                      handleEscalateIssue(issue.id);
                                    }}
                                  >
                                    Escalate Issue
                                  </button>
                                  <button
                                    className="dropdown-item reject-btn"
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent event bubbling
                                      handleRejectIssue(issue.id);
                                    }}
                                  >
                                    Reject Issue
                                  </button>
                                </>
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
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent event bubbling
                                      handleLecturerSelect(lecturer.id);
                                    }}
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="no-issues-message">
                      {searchTerm
                        ? 'No issues match your search'
                        : `No ${issueStatus} issues found`}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {showDetailsModal && selectedIssue && (
            <div className="issue-details-modal">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Issue Details - #{selectedIssue.id}</h2>
                  <button className="close-modal-btn" onClick={closeDetailsModal}>×</button>
                </div>
                <div className="modal-body">
                  <div className="issue-detail-row">
                    <span className="detail-label">Student:</span>
                    <span className="detail-value">{selectedIssue.student?.username || 'N/A'}</span>
                  </div>
                  <div className="issue-detail-row">
                    <span className="detail-label">Issue Type:</span>
                    <span className="detail-value">{selectedIssue.issue_type || 'N/A'}</span>
                  </div>
                  <div className="issue-detail-row">
                    <span className="detail-label">Year of Study:</span>
                    <span className="detail-value">{selectedIssue.year_of_study?.replace('_', ' ') || 'N/A'}</span>
                  </div>
                  <div className="issue-detail-row">
                    <span className="detail-label">Created:</span>
                    <span className="detail-value">{formatDate(selectedIssue.created_at)}</span>
                  </div>
                  <div className="issue-detail-row">
                    <span className="detail-label">Last Updated:</span>
                    <span className="detail-value">{formatDate(selectedIssue.updated_at)}</span>
                  </div>
                  <div className="issue-detail-row">
                    <span className="detail-label">Assigned To:</span>
                    <div className="detail-input">
                      <select name="lecturer" value={editingIssue.lecturer} onChange={handleInputChange} className="form-select">
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
                      <select name="status" value={editingIssue.status} onChange={handleInputChange} className="form-select">
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                  <div className="issue-detail-row">
                    <span className="detail-label">Description:</span>
                    <div className="detail-value description-box">{selectedIssue.description || 'No description provided'}</div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="cancel-btn" onClick={closeDetailsModal}>Cancel</button>
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

const DashboardCard = ({ title, count, description }) => {
  return (
    <div className="dashboard-card">
      <div className="card-header">
        <h3>{title}</h3>
        <span className="card-count">{count}</span>
      </div>
      <p className="card-description">{description}</p>
    </div>
  );
};

export default IssueManagement;