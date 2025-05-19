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
const predefinedStatuses = ['pending', 'in_progress', 'resolved', 'rejected'];

const Lecturerdashboard = () => {
  const navigate = useNavigate();
  const [selectedIssue, setSelectedIssue] = useState(null);
  const summaryRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
        toast.error('Authentication required. Please sign in.');
        navigate('/signin');
        return false;
      }
      return true;
    };

    const fetchIssues = async () => {
      try {
        setLoading(true);
        toast.info('Loading issues...'); // Add loading toast
        
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
        toast.success(`${response.data.length} issues loaded successfully`);
      } catch (err) {
        console.error('Error fetching lecturer issues:', err);
        
        // Check if error is due to unauthorized access (401)
        if (err.response && err.response.status === 401) {
          // Try refreshing the token
          try {
            toast.info('Session expired. Attempting to refresh...'); // Add refresh attempt toast
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
              toast.success('Session refreshed successfully'); // Add successful refresh toast
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
        toast.info(`Found ${response.data.length} issues matching "${searchTerm}"`); // Add search results toast
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
        
        // Add filter results toast when filters are applied
        if (statusFilter !== 'all' || categoryFilter !== 'all') {
          toast.info(`Filtered: ${filtered.length} issues found`);
        }
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching filtered issues:', err);
      
      // Handle token refresh similar to fetchIssues
      if (err.response && err.response.status === 401) {
        try {
          toast.info('Session expired. Attempting to refresh...'); // Add refresh attempt toast
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
              toast.info(`Found ${response.data.length} issues matching "${searchTerm}"`);
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
              
              if (statusFilter !== 'all' || categoryFilter !== 'all') {
                toast.info(`Filtered: ${filtered.length} issues found`);
              }
            }
            
            setLoading(false);
            toast.success('Session refreshed successfully');
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
        toast.error('Failed to filter issues. Please try again later.');
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
    setShowModal(true);
    // Show toast notification for viewing the issue
    toast.info(`Viewing issue #${issue.id}`);
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    toast.info(`Filtering by status: ${e.target.value === 'all' ? 'All' : e.target.value}`); // Add status filter toast
  };

  // Handle category filter change
  const handleCategoryFilterChange = (e) => {
    setCategoryFilter(e.target.value);
    toast.info(`Filtering by category: ${e.target.value === 'all' ? 'All' : e.target.value}`); // Add category filter toast
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
    toast.info('Issue view closed'); // Add close summary toast
  };

  // Update issue status in the dashboard
  const updateIssueStatus = async (issueId, newStatus) => {
    try {
      toast.info(`Updating issue #${issueId} status...`); // Add update in progress toast
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
        toast.error('Authentication error while updating status');
      } else {
        setError('Failed to update issue status. Please try again.');
        toast.error(`Failed to update issue #${issueId} status`);
      }
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  // Helper function to determine if a string is a URL
  const isValidURL = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Helper function to check if a URL is an image
  const isImageURL = (url) => {
    if (!url || typeof url !== 'string') return false;
    
    // Check if the URL ends with common image extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    return imageExtensions.some(ext => url.toLowerCase().endsWith(ext)) || 
           url.toLowerCase().includes('/image/') ||
           url.toLowerCase().includes('media/images/');
  };

  // Format issue detail value for display
  const formatValue = (key, value) => {
    if (value === null || value === undefined) return 'N/A';
    
    // Handle image URLs
    if ((key === 'image' || key.includes('image') || key.includes('photo') || key.includes('picture')) && 
        isValidURL(value)) {
      return (
        <div className="detail-image-container">
          <img 
            src={value} 
            alt={`Issue ${key}`} 
            className="detail-image" 
            onClick={() => window.open(value, '_blank')}
          />
          <div className="image-caption">Click to view full size</div>
        </div>
      );
    }
    
    // Handle any URL that appears to be an image
    if (typeof value === 'string' && isImageURL(value)) {
      return (
        <div className="detail-image-container">
          <img 
            src={value} 
            alt="Issue attachment" 
            className="detail-image" 
            onClick={() => window.open(value, '_blank')}
          />
          <div className="image-caption">Click to view full size</div>
        </div>
      );
    }
    
    // Handle other URLs
    if (typeof value === 'string' && isValidURL(value)) {
      return (
        <a href={value} target="_blank" rel="noopener noreferrer">
          {value}
        </a>
      );
    }
    
    // Handle dates
    if (key.includes('_at') || key.includes('date')) {
      return formatDate(value);
    }
    
    // Handle objects
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    
    // Handle boolean values
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    // Default: return as string
    return String(value);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedIssue(null);
  };

  // Handle deleting an issue
  const handleDeleteIssue = async (issueId) => {
    if (window.confirm('Are you sure you want to delete this issue? This action cannot be undone.')) {
      try {
        // Get access token
        const accessToken = localStorage.getItem('accessToken');
        
        // Set authorization header with access token
        API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        
        // Send delete request to API
        await API.delete(`api/lecturer_issue_management/${issueId}/`);
        
        // Update the state by removing the deleted issue
        setAllIssues(prevIssues => prevIssues.filter(issue => issue.id !== issueId));
        setFilteredIssues(prevIssues => prevIssues.filter(issue => issue.id !== issueId));
        
        // Show success message
        toast.success('Issue deleted successfully');
      } catch (err) {
        console.error('Error deleting issue:', err);
        toast.error('Failed to delete issue. Please try again.');
      }
    }
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
        {/* Add ToastContainer here too for loading state */}
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
        {/* Add ToastContainer here too for error state */}
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
  }

  return (
    <div className="app-container">
      <Navbar />
      <div className="content-container">
        <Sidebar2 />
        <main className="main-content">
          {/* Dashboard Stats */}
          <div className="stats-card-group">
            <div className="stat-card">
              <div className="stat-card-heading">Resolved Issues</div>
              <div className="stat-card-value">{allIssues.filter(issue => issue.status === 'resolved').length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-heading">Pending Issues</div>
              <div className="stat-card-value">{allIssues.filter(issue => issue.status === 'pending').length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-heading">In-progress Issues</div>
              <div className="stat-card-value">{allIssues.filter(issue => issue.status === 'in_progress').length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-heading">Rejected Issues</div>
              <div className="stat-card-value">{allIssues.filter(issue => issue.status === 'rejected').length}</div>
            </div>
          </div>

          {/* Dashboard header with search and filter options */}
          <div className="query-controls">
            <input 
              type="text" 
              placeholder="Search issues..." 
              className="query-input" 
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="query-filter-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 16v-4.414L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
            </button>
            
            <div className="select-wrapper mr-4">
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
          </div>

          {/* Issues view container - similar to student dashboard */}
          <div className="issues-view-container">
            <div className="issues-view-header">
              <div className="status-filter-wrapper">
                {['Pending', 'In-progress', 'Resolved', 'Rejected'].map(tab => (
                  <button
                    key={tab}
                    className={`status-filter-btn ${statusFilter === tab.toLowerCase() ? 'selected-status' : 'unselected-status'}`}
                    onClick={() => setStatusFilter(tab.toLowerCase())}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Data grid like in StudentDashboard */}
          <div className="data-grid-wrapper">
            {loading ? (
              <div className="loader-text">Loading issues...</div>
            ) : error ? (
              <div className="error-notification">{error}</div>
            ) : (
              <table className="data-grid">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Status</th>
                    <th>Student</th>
                    <th>Issue Type</th>
                    <th>Course Unit</th>
                    <th>Created</th>
                    <th>Updated</th>
                    <th>Is Commented</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIssues.length > 0 ? (
                    filteredIssues.map((issue, index) => (
                      <tr key={issue.id || index}>
                        <td>#{issue.id || 'N/A'}</td>
                        <td>
                          <span className={`status-indicator status-color-${issue.status}`}>
                            {issue.status === 'pending' ? 'Pending' : 
                             issue.status === 'in_progress' ? 'In-progress' : 
                             issue.status === 'resolved' ? 'Resolved' : 
                             issue.status === 'rejected' ? 'Rejected' : issue.status}
                          </span>
                        </td>
                        <td>{issue.student?.username || issue.studentNo || 'Unknown Student'}</td>
                        <td>{issue.issue_type || issue.category || 'N/A'}</td>
                        <td>{issue.course_unit || 'N/A'}</td>
                        <td>{formatDate(issue.created_at || issue.date)}</td>
                        <td>{formatDate(issue.updated_at)}</td>
                        <td>{issue.is_commented ? '✓' : '✗'}</td>
                        <td>
                          <div className="row-actions-group">
                            <button 
                              className="details-action-btn" 
                              onClick={() => handleIssueClick(issue)}
                            >
                              Details
                            </button>
                            {issue.status !== 'resolved' && (
                              <button 
                                className="resolve-btn" 
                                onClick={() => handleResolveIssue(issue)}
                              >
                                Resolve
                              </button>
                            )}
                            <button 
                              className="remove-action-btn" 
                              onClick={() => handleDeleteIssue(issue.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="empty-state-message">
                        No {statusFilter !== 'all' ? statusFilter : ''} issues found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </main>

        {/* Issue Details Modal - Similar to the one in StudentDashboard */}
        {showModal && selectedIssue && (
          <div className="modal-backdrop">
            <div className="modal-window">
              <div className="modal-title-bar">
                <h2>Issue Details</h2>
                <button className="modal-close-icon" onClick={closeModal}>×</button>
              </div>
              <div className="modal-body">
                <div className="detail-row">
                  <strong>ID:</strong> #{selectedIssue.id || 'N/A'}
                </div>
                
                {/* Display issue image prominently if it exists */}
                {selectedIssue.image && (
                  <div className="detail-row issue-image-row">
                    <strong>Image:</strong>
                    <div className="detail-image-container">
                      <img 
                        src={selectedIssue.image} 
                        alt="Issue attachment" 
                        className="detail-image" 
                        onClick={() => window.open(selectedIssue.image, '_blank')}
                      />
                      <div className="image-caption">Click to view full size</div>
                    </div>
                  </div>
                )}
                
                {/* Display all other issue details */}
                {Object.entries(selectedIssue).map(([key, value]) => {
                  // Skip ID and image as we've already displayed them separately
                  if (key === 'id' || key === 'image') return null;
                  
                  const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                  
                  return (
                    <div key={key} className="detail-row">
                      <strong>{formattedKey}:</strong> 
                      <div className="detail-value">
                        {formatValue(key, value)}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="modal-actions">
                {selectedIssue.status !== 'resolved' && (
                  <button 
                    className="resolve-btn" 
                    onClick={() => {
                      handleResolveIssue(selectedIssue);
                      closeModal();
                    }}
                  >
                    Resolve Issue
                  </button>
                )}
                <button className="modal-dismiss-btn" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Enhanced ToastContainer with better positioning and styling */}
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
        limit={5} // Limit the number of toasts displayed at once
      />
    </div>
  );
};

export default Lecturerdashboard;