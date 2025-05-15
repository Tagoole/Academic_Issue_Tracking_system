import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Lecturerdashboard.css';
import Navbar from './NavBar';
import Sidebar2 from './Sidebar2';
import IssueSummary from './IssueSummary';
import API from '../api.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Predefined categories and statuses
const predefinedCategories = ['Missing Marks', 'Wrong Marks', 'Others'];
const predefinedStatuses = ['Pending', 'In Progress', 'Resolved'];

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
      if (!accessToken) {
        toast.error('Authentication required. Please sign in.');
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

        // Show success toast when issues are loaded
        toast.success('Issues loaded successfully');
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
              toast.error('Session expired. Please log in again.');
              navigate('/signin');
              return;
            }
          } catch (refreshErr) {
            console.error('Error refreshing token:', refreshErr);
            setError('Your session has expired. Please log in again.');
            toast.error('Session expired. Please log in again.');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/signin');
          }
        } else {
          setError('Failed to load issues. Please try again later.');
          setLoading(false);

          // Show error toast when issues fail to load
          toast.error('Failed to load issues. Please try again later.');
        }
      }
    };

    // Only fetch data if authentication check passes
    if (checkAuth()) {
      fetchIssues();
    }
  }, [navigate]);

  // Handle API-based filtering and searching
  const fetchFilteredResults = async () => {
    try {
      setLoading(true);
      
      // Get access token
      const accessToken = localStorage.getItem('accessToken');
      
      // Set authorization header with access token
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      // Build the search query based on filters
      let queryParams = '';
      
      // If we have a search term, use the filter_results endpoint
      if (searchTerm) {
        queryParams = `status=${encodeURIComponent(searchTerm)}`;
        const response = await API.get(`api/lecturer_issue_management/filter_results/?${queryParams}`);
        console.log("Filtered API Response:", response.data);
        setFilteredIssues(response.data);
      } else {
        // If no search term, use the basic fetch and apply client-side filtering
        const response = await API.get('api/lecturer_issue_management/');
        const issues = response.data;
        
        // Apply client-side filters for category and status
        const filtered = issues.filter(issue => {
          const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
          const matchesCategory = categoryFilter === 'all' || issue.category === categoryFilter;
          return matchesStatus && matchesCategory;
        });
        
        setAllIssues(issues);
        setFilteredIssues(filtered);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching filtered issues:', err);
      
      // Handle token refresh similar to fetchIssues
      if (err.response && err.response.status === 401) {
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          
          if (refreshToken) {
            const refreshResponse = await API.post('/api/refresh_token/', {
              refresh: refreshToken
            });
            
            const newAccessToken = refreshResponse.data.access;
            localStorage.setItem('accessToken', newAccessToken);
            
            // Retry the filtered fetch with new token
            API.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            
            // Repeat the same query logic as above
            let queryParams = '';
            if (searchTerm) {
              queryParams = `status=${encodeURIComponent(searchTerm)}`;
              const response = await API.get(`api/lecturer_issue_management/filter_results/?${queryParams}`);
              setFilteredIssues(response.data);
            } else {
              const response = await API.get('api/lecturer_issue_management/');
              const issues = response.data;
              
              const filtered = issues.filter(issue => {
                const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
                const matchesCategory = categoryFilter === 'all' || issue.category === categoryFilter;
                return matchesStatus && matchesCategory;
              });
              
              setAllIssues(issues);
              setFilteredIssues(filtered);
            }
            
            setLoading(false);
          } else {
            toast.error('Session expired. Please log in again.');
            navigate('/signin');
            return;
          }
        } catch (refreshErr) {
          console.error('Error refreshing token:', refreshErr);
          setError('Your session has expired. Please log in again.');
          toast.error('Session expired. Please log in again.');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          navigate('/signin');
        }
      } else {
        setError('Failed to fetch filtered issues. Please try again later.');
        setLoading(false);
      }
    }
  };

  // Apply filters to issues whenever filters change
  useEffect(() => {
    // Only run if we have loaded issues initially
    if (loading) return;
    
    // Set a small delay to prevent too many API calls while typing
    const delaySearch = setTimeout(() => {
      fetchFilteredResults();
    }, 500);
    
    return () => clearTimeout(delaySearch);
  }, [statusFilter, categoryFilter, searchTerm]);

  // Handle issue click
  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);

    // Show toast notification for viewing the issue
    toast.info(`Viewing issue #${issue.id}`);
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
  const getUniqueFilterOptions = (predefinedOptions, apiData, field) => {
    const uniqueFromAPI = apiData.length > 0 ? [...new Set(apiData.map(item => item[field]))] : [];
    const combinedOptions = [...new Set([...predefinedOptions, ...uniqueFromAPI])];
    return combinedOptions;
  };

  const uniqueCategories = getUniqueFilterOptions(predefinedCategories, allIssues, 'category');
  const uniqueStatuses = getUniqueFilterOptions(predefinedStatuses, allIssues, 'status');

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
      
      // After successful update, fetch the latest issues
      fetchFilteredResults();
      
      // If the selected issue is the one being updated, update it too
      if (selectedIssue && selectedIssue.id === issueId) {
        setSelectedIssue(prev => ({ ...prev, status: newStatus }));
      }
      
      // Show success toast for status update
      toast.success(`Issue #${issueId} status updated to ${newStatus}`);
      console.log(`Issue ${issueId} status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating issue status:', err);
      // Handle token refresh if needed (similar to fetch issues logic)
      if (err.response && err.response.status === 401) {
        // Handle token refresh logic here
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
    
    // Show toast notification for redirecting
    toast.info(`Redirecting to resolve issue #${issue.id}`);
    
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
            <div className="error-message">
              {error}
              <button 
                className="retry-btn"
                onClick={() => {
                  toast.info("Retrying...");
                  window.location.reload();
                }}
              >
                Try Again
              </button>
            </div>
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
                  className="category-filter" 
                  value={categoryFilter} 
                  onChange={handleCategoryFilterChange}
                >
                  <option value="all">All Categories</option>
                  {uniqueCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <span className="dropdown-arrow"></span>
              </div>

              <div className="select-wrapper">
                <select 
                  className="status-filter" 
                  value={statusFilter} 
                  onChange={handleStatusFilterChange}
                >
                  <option value="all">All Statuses</option>
                  {uniqueStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <span className="dropdown-arrow"></span>
              </div>

              <input 
                type="text" 
                placeholder="Search issues by status, student, or issue type..." 
                className="search-input" 
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
                    filteredIssues.map(issue => (
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
                          {issue.status !== 'Resolved' && (
                            <button 
                              className="resolve-btn"
                              onClick={(e) => {
                                e.stopPropagation();
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
                      <td colSpan="6" className="no-issues">No issues match the current filters. Please try another search term</td>
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
      {/* Add ToastContainer here */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Lecturerdashboard;