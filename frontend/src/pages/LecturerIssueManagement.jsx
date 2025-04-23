import React, { useState, useEffect } from 'react';
import './LecturerIssueManagement.css'; 
import Navbar from './NavBar'; 
import Sidebar2 from './Sidebar2'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from '../api.js'; // Import the API variable

const LecturerIssueManagement = () => {
  // Get issue ID from URL
  const [issueId, setIssueId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('issueId')) || 1; // Default to 1 if no ID
  });

  // State for the selected issue details
  const [selectedIssue, setSelectedIssue] = useState({
    id: 1,
    title: 'Sample Issue',
    status: 'pending',
    studentNo: '',
    category: '',
    date: '',
    submissionDate: '',
    courseUnitName: '',
    courseUnitCode: '',
    assignedLecturer: '',
    description: '',
    comments: '', // Initialize with empty string instead of null
    is_commented: false,
    // Additional fields from API response
    course_unit: '',
    image: '',
    issue_type: '',
    lecturer: '',
    semester: '',
    student: {
      email: '',
      id: '',
      username: ''
    },
    year_of_study: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [statusUpdateMessage, setStatusUpdateMessage] = useState('');
  const [selectedNewStatus, setSelectedNewStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch issue data from sessionStorage when component mounts
  useEffect(() => {
    try {
      // Get the issue data from sessionStorage
      const issueData = JSON.parse(sessionStorage.getItem('issueToResolve'));
      console.log("Initial issue data:", issueData);
      
      if (issueData) {
        console.log("Retrieved issue data:", issueData);
        console.log("Original comments value:", issueData.comments);
        
        // Map the API response fields to our component's state structure
        setSelectedIssue(prevState => ({
          ...prevState,
          id: issueData.id || issueId, // Use the ID from the data if available
          status: issueData.status || 'pending',
          // Map student information
          studentNo: issueData.student?.username || '',
          // Map category to issue_type
          category: issueData.issue_type || '',
          // Map description
          description: issueData.description || '',
          // Map course unit
          courseUnitName: `Course Unit ${issueData.course_unit}`,
          courseUnitCode: `CU-${issueData.course_unit}`,
          // Map semester and year
          date: new Date().toLocaleDateString(),
          submissionDate: new Date().toISOString().split('T')[0],
          // Map lecturer
          assignedLecturer: `Lecturer ID: ${issueData.lecturer}`,
          // Keep the original fields from API
          course_unit: issueData.course_unit,
          image: issueData.image,
          issue_type: issueData.issue_type,
          lecturer: issueData.lecturer,
          semester: issueData.semester,
          student: issueData.student,
          year_of_study: issueData.year_of_study,
          comments: issueData.comments || '', // Use empty string as fallback instead of null
          is_commented: issueData.is_commented || false
        }));
        
        console.log("State after update:", selectedIssue);
        // Success toast notification
        toast.success('Issue details loaded successfully');
      } else {
        console.log(`No issue data found in sessionStorage for ID: ${issueId}`);
        // You might want to redirect back to dashboard or show an error
      }
    } catch (error) {
      console.error("Error parsing issue data from sessionStorage:", error);
    }
  }, [issueId]);

  const handleStatusUpdate = (newStatus) => {
    setSelectedNewStatus(newStatus.toLowerCase()); // Convert to lowercase to match API expectations
    setShowStatusDialog(false);

    let message = `Status will be updated to "${newStatus}".`;
    if (newStatus.toLowerCase() !== 'resolved') {
      message += " Please remember to come back later and resolve this issue.";
    }
    setStatusUpdateMessage(message);
    setShowConfirmation(true);
  };

  const handleCommentChange = (event) => {
    const commentText = event.target.value;
    console.log("Comment changed to:", commentText);
    
    setSelectedIssue(prevState => ({
      ...prevState,
      comments: commentText,
    }));
  };

  const handleSave = () => {
    console.log("Current comments before save:", selectedIssue.comments);
    
    if (!selectedIssue.comments || !selectedIssue.comments.trim()) {
      setErrorMessage('Please add a comment before saving changes.');
      // Warning toast notification
      toast.warning('Please add a comment before saving changes');
      return;
    }

    setErrorMessage('');
    setShowStatusDialog(true);
  };

  const handleConfirmSave = async () => {
    try {
      setLoading(true);
      console.log("Saving comment:", selectedIssue.comments);
      
      // Get access token for authorization
      const accessToken = localStorage.getItem('accessToken');
      
      // Check if token exists, if not redirect to login
      if (!accessToken) {
        window.location.href = '/signin';
        return;
      }
      
      // Set authorization header with access token
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      // Format the status value to match backend expectations
      // Convert "In Progress" to "in_progress" format if needed
      let formattedStatus = selectedNewStatus.toLowerCase();
      if (formattedStatus === 'in progress') {
        formattedStatus = 'in_progress';
      }
      
      // Data to send to the backend
      const updateData = {
        status: formattedStatus,
        comments: selectedIssue.comments, // This will be the user's typed comment
        is_commented: true
      };
      
      console.log('Sending update data:', updateData);
      console.log('Issue ID:', selectedIssue.id);
      
      // Send PATCH request to update the issue
      const response = await API.patch(`api/lecturer_issue_management/${selectedIssue.id}/`, updateData);
      console.log('Issue updated successfully:', response.data);
      
      setLoading(false);
      
      // Clear the stored issue data before redirecting
      sessionStorage.removeItem('issueToResolve');
      
      // Success toast notification
      toast.success(`Issue status updated to ${formattedStatus} successfully`, {
        onClose: () => {
          // Redirect back to dashboard after toast is closed
          window.location.href = '/Lecturerdashboard';
        },
        autoClose: 3000 // Stay open for 3 seconds
      });
    } catch (err) {
      setLoading(false);
      console.error('Error updating issue:', err);
      
      // Error toast notification
      toast.error('Failed to update issue status. Please try again.');
      
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
            
            // Format the status value again
            let formattedStatus = selectedNewStatus.toLowerCase();
            if (formattedStatus === 'in progress') {
              formattedStatus = 'in_progress';
            }
            
            // Retry the original request with new token
            API.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            const retryResponse = await API.patch(`api/lecturer_issue_management/${selectedIssue.id}/`, {
              status: formattedStatus,
              comments: selectedIssue.comments,
              is_commented: true
            });
            
            console.log('Issue updated successfully after token refresh:', retryResponse.data);
            
            // Clear the stored issue data before redirecting
            sessionStorage.removeItem('issueToResolve');
            
            // Success toast notification after retry
            toast.success(`Issue status updated to ${formattedStatus} successfully`, {
              onClose: () => {
                // Redirect back to dashboard after toast is closed
                window.location.href = '/Lecturerdashboard';
              },
              autoClose: 3000 // Stay open for 3 seconds
            });
          } else {
            // No refresh token available, redirect to login
            toast.error('Session expired. Redirecting to login...', {
              onClose: () => {
                window.location.href = '/signin';
              },
              autoClose: 2000
            });
          }
        } catch (refreshErr) {
          console.error('Error refreshing token:', refreshErr);
          toast.error('Your session has expired. Please log in again.', {
            onClose: () => {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              window.location.href = '/signin';
            },
            autoClose: 2000
          });
        }
      } else {
        toast.error('Failed to update issue. Please try again later.');
      }
    }
  };

  const handleCancelSave = () => {
    setShowConfirmation(false);
    // Info toast notification
    toast.info('Status update cancelled');
  };

  // Format date for display if available
  const formattedDate = () => {
    try {
      return new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return new Date().toLocaleDateString();
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="content-container">
        <Sidebar2 />
        <main className="main-content">
          <div className="issue-management-container">
            <h2>Issue Management</h2>
            <div className="issue-details">
              <div className="issue-field"><strong>Issue ID:</strong><p>{selectedIssue.id}</p></div>
              <div className="issue-field"><strong>Student Username:</strong><p>{selectedIssue.student?.username || 'N/A'}</p></div>
              <div className="issue-field"><strong>Student Email:</strong><p>{selectedIssue.student?.email || 'N/A'}</p></div>
              <div className="issue-field"><strong>Issue Type:</strong><p>{selectedIssue.issue_type || 'N/A'}</p></div>
              <div className="issue-field"><strong>Issue Status:</strong><p>{selectedIssue.status || 'pending'}</p></div>
              <div className="issue-field"><strong>Course Unit:</strong><p>{selectedIssue.course_unit || 'N/A'}</p></div>
              <div className="issue-field"><strong>Semester:</strong><p>{selectedIssue.semester || 'N/A'}</p></div>
              <div className="issue-field"><strong>Year of Study:</strong><p>{selectedIssue.year_of_study || 'N/A'}</p></div>
              <div className="issue-field"><strong>Date:</strong><p>{formattedDate()}</p></div>
              <div className="issue-field"><strong>Description:</strong><p>{selectedIssue.description || 'No description provided.'}</p></div>
              
              {selectedIssue.image && (
                <div className="issue-field issue-image-field">
                  <strong>Attached Image:</strong>
                  <img 
                    src={selectedIssue.image} 
                    alt="Issue attachment" 
                    className="issue-attachment-image"
                    onError={() => toast.error('Failed to load attachment image')}
                  />
                </div>
              )}
            </div>

            <div className="comment-section">
              <strong>Add Comment</strong>
              <textarea
                value={selectedIssue.comments || ''}
                onChange={handleCommentChange}
                placeholder="Enter your response to this issue..."
                rows="4"
              />
              {/* Display current comment value for debugging */}
              <div className="debug-info" style={{ fontSize: "12px", color: "#666" }}>
                Current comment: {selectedIssue.comments ? `"${selectedIssue.comments}"` : "(empty)"}
              </div>
            </div>

            <div className="save-button-container">
              <button className="save-button" onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save Comment and Update Status'}
              </button>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
          </div>

          {showStatusDialog && (
            <div className="status-dialog-overlay">
              <div className="status-dialog">
                <h3>Choose Status</h3>
                <p>Select a status for this issue:</p>
                <div className="status-options">
                  <button className="status-option pending" onClick={() => handleStatusUpdate('pending')}>Pending</button>
                  <button className="status-option in-progress" onClick={() => handleStatusUpdate('in_progress')}>In Progress</button>
                  <button className="status-option resolved" onClick={() => handleStatusUpdate('resolved')}>Resolved</button>
                </div>
                <button className="cancel-button" onClick={() => setShowStatusDialog(false)}>Cancel</button>
              </div>
            </div>
          )}

          {showConfirmation && (
            <div className="status-dialog-overlay">
              <div className="status-dialog">
                <h3>Status Update</h3>
                <p>{statusUpdateMessage}</p>
                <p><strong>Comment:</strong> {selectedIssue.comments}</p>
                <div className="confirmation-buttons">
                  <button 
                    className="confirm-button" 
                    onClick={handleConfirmSave}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Confirm'}
                  </button>
                  <button 
                    className="cancel-button" 
                    onClick={handleCancelSave}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default LecturerIssueManagement;