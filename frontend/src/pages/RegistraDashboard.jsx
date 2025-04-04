import React, { useState, useEffect } from 'react';
import './RegistraDashboard.css';
import Navbar from './NavBar';
import Sidebar from './Sidebar';
import backgroundImage from '../assets/backgroundimage.jpg';
import API from '../api'; // Import your existing API file

const RegistraDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');

  // Calculate counts
  const pendingCount = filteredIssues.filter(issue => issue.status === 'Pending').length;
  const inProgressCount = filteredIssues.filter(issue => issue.status === 'In Progress').length;
  const resolvedCount = filteredIssues.filter(issue => issue.status === 'Resolved').length;
  
  // Fetch issues from API
  const fetchIssues = async (filter = '') => {
    try {
      setLoading(true);
      let url = '/api/registrar_issue_management/';
      
      // If a status filter is provided, use the filter_results endpoint
      if (filter) {
        url = `/registrar_issue_management/filter_results/?status=${filter}`;
      }
      
      const response = await API.get(url);
      setIssues(response.data);
      setFilteredIssues(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch issues');
      setLoading(false);
      console.error('Error fetching issues:', err);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchIssues();
  }, []);

  // Apply search filters
  useEffect(() => {
    if (!searchTerm && !statusFilter) {
      setFilteredIssues(issues);
      return;
    }
    
    const results = issues.filter(issue => 
      (issue.student?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       issue.issue_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       issue.status?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!statusFilter || issue.status === statusFilter)
    );
    setFilteredIssues(results);
  }, [searchTerm, statusFilter, issues]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle status filter change
  const handleFilterClick = (status) => {
    setStatusFilter(status === statusFilter ? '' : status);
    if (status && status !== statusFilter) {
      fetchIssues(status);
    } else if (!status) {
      fetchIssues();
    }
  };

  // Handle view issue details
  const handleViewIssue = (id) => {
    // You can implement navigation to issue details page
    console.log(`View issue with ID: ${id}`);
    // Example: history.push(`/issues/${id}`);
  };

  // Handle update issue status
  const handleUpdateIssue = async (id, newStatus) => {
    try {
      await API.put(`/registrar_issue_management/${id}/`, {
        status: newStatus
      });
      // Refresh the issues list after update
      fetchIssues(statusFilter);
    } catch (err) {
      console.error('Error updating issue:', err);
      setError('Failed to update issue');
    }
  };

  return (
    <div
      className="app-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width:'1000px',
      }}
    >
      <Navbar />
      <div className="content-container">
        <Sidebar />
        <main className="main-content">
          <div className="dashboard-cards">
            <DashboardCard
              title="Pending issues"
              count={pendingCount}
              description={`You currently have ${pendingCount} pending ${pendingCount === 1 ? 'issue' : 'issues'}`}
              onClick={() => handleFilterClick('Pending')}
              active={statusFilter === 'Pending'}
            />
            <DashboardCard
              title="In-progress issues"
              count={inProgressCount}
              description={`You currently have ${inProgressCount} in-progress ${inProgressCount === 1 ? 'issue' : 'issues'}`}
              onClick={() => handleFilterClick('In Progress')}
              active={statusFilter === 'In Progress'}
            />
            <DashboardCard
              title="Resolved issues"
              count={resolvedCount}
              description={`You currently have ${resolvedCount} resolved ${resolvedCount === 1 ? 'issue' : 'issues'}`}
              onClick={() => handleFilterClick('Resolved')}
              active={statusFilter === 'Resolved'}
            />
          </div>

          <div className="issues-section">
            <div className="issues-header">
              <h2>My issues</h2>
              <div className="search-container">
                <input 
                  type="text" 
                  placeholder="Search for issues" 
                  className="search-input" 
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <span className="search-icon"></span>
              </div>
              <div className="filter-dropdown">
                <button className="filter-button">
                  <span>Filter: {statusFilter || 'All'}</span>
                  <span className="filter-icon">▼</span>
                </button>
                <div className="filter-dropdown-content">
                  <div onClick={() => handleFilterClick('')}>All</div>
                  <div onClick={() => handleFilterClick('Pending')}>Pending</div>
                  <div onClick={() => handleFilterClick('In Progress')}>In Progress</div>
                  <div onClick={() => handleFilterClick('Resolved')}>Resolved</div>
                </div>
              </div>
            </div>

            <div className="issues-table">
              {loading ? (
                <div className="loading-message">Loading issues...</div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Issue ID</th>
                      <th>Status</th>
                      <th>Student</th>
                      <th>Issue Type</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIssues.length > 0 ? (
                      filteredIssues.map(issue => (
                        <tr key={issue.id}>
                          <td>{issue.id}</td>
                          <td>
                            <span className={`status-badge status-${issue.status?.toLowerCase().replace(' ', '-')}`}>
                              {issue.status}
                            </span>
                          </td>
                          <td>{issue.student?.username || 'N/A'}</td>
                          <td>{issue.issue_type}</td>
                          <td>{new Date(issue.created_at || issue.date).toLocaleDateString()}</td>
                          <td className="action-buttons">
                            <button 
                              className="view-button"
                              onClick={() => handleViewIssue(issue.id)}
                            >
                              View
                            </button>
                            <div className="status-dropdown">
                              <button className="update-button">Update Status</button>
                              <div className="status-dropdown-content">
                                <div onClick={() => handleUpdateIssue(issue.id, 'Pending')}>Pending</div>
                                <div onClick={() => handleUpdateIssue(issue.id, 'In Progress')}>In Progress</div>
                                <div onClick={() => handleUpdateIssue(issue.id, 'Resolved')}>Resolved</div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="no-issues">No issues found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
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
      className={`dashboard-card ${active ? 'active' : ''}`} 
      onClick={onClick}
    >
      <h3>{title}</h3>
      <div className="card-count">{count}</div>
      <p>{description}</p>
    </div>
  );
};

export default RegistraDashboard;