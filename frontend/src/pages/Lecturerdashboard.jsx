import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Lecturerdashboard.css';
import Navbar from './NavBar';
import Sidebar2 from './Sidebar2';
import IssueSummary from './IssueSummary';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from '../api.js';

const Lecturerdashboard = () => {
  const navigate = useNavigate();
  const [selectedIssue, setSelectedIssue] = useState(null);
  const summaryRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Issues data from API
  const [allIssues, setAllIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);

  // Fetch issues from API when component mounts
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
        
        const response = await API.get('api/lecturer_issue_management/');
        console.log("API Response:", response.data); // Debug log
        
        setAllIssues(response.data);
        setFilteredIssues(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching lecturer issues:', err);
        
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
              const retryResponse = await API.get('api/lecturer_issue_management/');
              
              setAllIssues(retryResponse.data);
              setFilteredIssues(retryResponse.data);
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

  // Apply filters to issues whenever filters change
  useEffect(() => {
    if (allIssues.length === 0) return;

    const filtered = allIssues.filter((issue) => {
      const matchesStatus =
        statusFilter === 'all' || issue.status?.toLowerCase() === statusFilter.toLowerCase();
      const matchesCategory =
        categoryFilter === 'all' || issue.category?.toLowerCase() === categoryFilter.toLowerCase();
      const matchesSearch =
        searchTerm === '' ||
        (issue.id && issue.id.toString().includes(searchTerm)) || // Search by Issue ID
        (issue.studentNo && issue.studentNo.toLowerCase().includes(searchTerm.toLowerCase())) || // Search by Student No
        (issue.category && issue.category.toLowerCase().includes(searchTerm.toLowerCase())); // Search by Category

      return matchesStatus && matchesCategory && matchesSearch;
    });

    setFilteredIssues(filtered);

    // Show toast notifications
    if (searchTerm !== '') {
      if (filtered.length > 0) {
        toast.success(`Issue(s) found matching "${searchTerm}".`, {
          autoClose: 3000,
        });
      } else {
        toast.error(`No issues found matching "${searchTerm}".`, {
          autoClose: 3000,
        });
      }
    }
  }, [statusFilter, categoryFilter, searchTerm, allIssues]);

  // Handle issue click
  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Handle category filter change
  const handleCategoryFilterChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Effect to handle clicks outside the issue summary
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (summaryRef.current && !summaryRef.current.contains(event.target)) {
        setSelectedIssue(null);
      }
    };

    if (selectedIssue) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedIssue]);

  // Get unique categories and statuses for filter dropdowns
  const uniqueCategories = allIssues.length > 0 ? [...new Set(allIssues.map((issue) => issue.category))] : [];
  const uniqueStatuses = allIssues.length > 0 ? [...new Set(allIssues.map((issue) => issue.status))] : [];

  // Handler to close the issue summary from within
  const handleCloseSummary = () => {
    setSelectedIssue(null);
  };

  // Update issue status in the dashboard
  const updateIssueStatus = async (issueId, newStatus) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      // Send update to the API
      await API.patch(`api/lecturer_issue_management/${issueId}/`, {
        status: newStatus
      });
      
      // Update local state
      const updatedIssues = allIssues.map(issue => {
        if (issue.id === issueId) {
          return { ...issue, status: newStatus };
        }
        return issue;
      });
      
      setAllIssues(updatedIssues);
      
      // If the selected issue is the one being updated, update it too
      if (selectedIssue && selectedIssue.id === issueId) {
        setSelectedIssue({ ...selectedIssue, status: newStatus });
      }
      
      console.log(`Issue ${issueId} status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating issue status:', err);
      // Handle token refresh if needed (similar to fetch issues logic)
      if (err.response && err.response.status === 401) {
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          
          if (refreshToken) {
            const refreshResponse = await API.post('/api/refresh_token/', {
              refresh: refreshToken
            });
            
            const newAccessToken = refreshResponse.data.access;
            localStorage.setItem('accessToken', newAccessToken);
            
            // Retry the update with new token
            API.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            await API.patch(`api/lecturer_issue_management/${issueId}/`, {
              status: newStatus
            });
            
            // Update local state (same as above)
            const updatedIssues = allIssues.map(issue => {
              if (issue.id === issueId) {
                return { ...issue, status: newStatus };
              }
              return issue;
            });
            
            setAllIssues(updatedIssues);
            
            if (selectedIssue && selectedIssue.id === issueId) {
              setSelectedIssue({ ...selectedIssue, status: newStatus });
            }
          } else {
            navigate('/signin');
          }
        } catch (refreshErr) {
          console.error('Error refreshing token during status update:', refreshErr);
          setError('Your session has expired. Please log in again.');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          navigate('/signin');
        }
      } else {
        setError('Failed to update issue status. Please try again.');
      }
    }
  };

  // Handle resolving an issue
  const handleResolveIssue = (issue) => {
    // Extract only the necessary data (exclude created_at, updated_at, id, and registrar email)
    const issueData = {
      course_unit: issue.course_unit,
      description: issue.description,
      image: issue.image,
      issue_type: issue.issue_type,
      lecturer: issue.lecturer,
      semester: issue.semester,
      status: issue.status,
      student: {
        email: issue.student?.email,
        id: issue.student?.id,
        username: issue.student?.username
      },
      year_of_study: issue.year_of_study
    };
    
    // Store issue data in localStorage or sessionStorage to pass it to the next page
    sessionStorage.setItem('issueToResolve', JSON.stringify(issueData));
    
    // Navigate to the LecturerIssueManagement page with the issue ID as a URL parameter
    navigate(`/LecturerIssueManagement?issueId=${issue.id}`);
  };

  if (loading) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="content-container">
          <Sidebar2 />
          <main className="main-content">
            <div className="loading-message">Loading issues...</div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="content-container">
          <Sidebar2 />
          <main className="main-content">
            <div className="error-message">{error}</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <div className="content-container">
        <Sidebar2 />
        <main className="main-content">
          {/* Dashboard header with search and filter options */}
          <div className="dashboard-header">
            <h1>Issue Dashboard</h1>
            <div className="filter-controls">
              <div className="select-wrapper">
                <select
                  className="status-filter"
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
                <span className="dropdown-arrow"></span>
              </div>
              <div className="select-wrapper">
                <select
                  className="category-filter"
                  value={categoryFilter}
                  onChange={handleCategoryFilterChange}
                >
                  <option value="all">All Categories</option>
                  <option value="Missing Marks">Missing Marks</option>
                  <option value="Wrong Marks">Wrong Marks</option>
                  <option value="Other">Other</option>
                </select>
                <span className="dropdown-arrow"></span>
              </div>
            </div>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by Issue ID, Student No, or Category..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* Issues table section */}
          <div className="issues-section">
            <div className="issues-table">
              <table>
                <thead>
                  <tr>
                    <th>Issue ID</th>
                    <th>Status</th>
                    <th>Student No</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIssues.length > 0 ? (
                    filteredIssues.map((issue) => (
                      <tr
                        key={issue.id}
                        className={selectedIssue && selectedIssue.id === issue.id ? 'selected-row' : ''}
                      >
                        <td onClick={() => handleIssueClick(issue)}>{issue.id}</td>
                        <td onClick={() => handleIssueClick(issue)}>
                          <span className={`status-badge ${issue.status.toLowerCase().replace(' ', '-')}`}>
                            {issue.status}
                          </span>
                        </td>
                        <td onClick={() => handleIssueClick(issue)}>{issue.studentNo}</td>
                        <td onClick={() => handleIssueClick(issue)}>{issue.category}</td>
                        <td onClick={() => handleIssueClick(issue)}>{issue.date}</td>
                        <td>
                          {(issue.status === 'Pending' || issue.status === 'In Progress') && (
                            <button
                              className="resolve-btn"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering the row click event
                                handleResolveIssue(issue);
                              }}
                            >
                              Resolve Issue
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="no-issues">
                        No issues match the current filters. Please try another search term
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* Issue Summary with ref for click outside detection */}
        {selectedIssue && (
          <div className="issue-summary-overlay">
            <div ref={summaryRef} className="issue-summary-container">
              <IssueSummary 
                issue={selectedIssue} 
                onClose={handleCloseSummary}
                onUpdateStatus={updateIssueStatus}
              />
            </div>
          </div>
        )}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Lecturerdashboard;