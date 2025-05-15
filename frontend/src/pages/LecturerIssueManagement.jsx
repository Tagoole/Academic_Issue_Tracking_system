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
    comment: '', // Changed from "comments" to "comment" to match serializer
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
    // Show loading toast
    const loadingToastId = toast.loading('Loading issue details...');

    try {
      // Get the issue data from sessionStorage
      const issueData = JSON.parse(sessionStorage.getItem('issueToResolve'));
      console.log("Initial issue data:", issueData);

      if (issueData) {
        console.log("Retrieved issue data:", issueData);

        // Map the API response fields to our component's state structure
        setSelectedIssue(prevState => ({
          ...prevState,
          id: issueData.id || issueId,
          status: issueData.status || 'pending',
          studentNo: issueData.student?.username || '',
          category: issueData.issue_type || '',
          description: issueData.description || '',
          courseUnitName: `Course Unit ${issueData.course_unit}`,
          courseUnitCode: `CU-${issueData.course_unit}`,
          date: new Date().toLocaleDateString(),
          submissionDate: new Date().toISOString().split('T')[0],
          assignedLecturer: `Lecturer ID: ${issueData.lecturer}`,
          course_unit: issueData.course_unit,
          image: issueData.image,
          issue_type: issueData.issue_type,
          lecturer: issueData.lecturer,
          semester: issueData.semester,
          student: issueData.student,
          year_of_study: issueData.year_of_study,
          comment: issueData.comment || '', // Changed from "comments" to "comment"
          is_commented: issueData.is_commented || false
        }));

        // Update loading toast to success
        toast.update(loadingToastId, {
          render: 'Issue details loaded successfully',
          type: 'success',
          isLoading: false,
          autoClose: 2000
        });

        // Add toast for previously commented issues
        if (issueData.is_commented) {
          toast.info('This issue already has your comments', {
            autoClose: 3000
          });
        }
      } else {
        console.log(`No issue data found in sessionStorage for ID: ${issueId}`);
        // Update loading toast to error
        toast.update(loadingToastId, {
          render: 'Issue not found or data is missing',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
          onClose: () => {
            // Redirect back to dashboard after toast is closed
            window.location.href = '/Lecturerdashboard';
          }
        });
      }
    } catch (error) {
      console.error("Error parsing issue data from sessionStorage:", error);
      toast.update(loadingToastId, {
        render: 'Failed to load issue details. Redirecting to dashboard...',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
        onClose: () => {
          window.location.href = '/Lecturerdashboard';
        }
      });
    }
  }, [issueId]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (selectedIssue.comment && !loading && !showConfirmation) { // Changed from "comments" to "comment"
        const message = "You have unsaved changes. Are you sure you want to leave?";
        e.returnValue = message; // This is required for the browser to show a confirmation dialog.
        toast.warning('You have unsaved changes', {
          autoClose: 3000, // Toast will disappear after 3 seconds
        });
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [selectedIssue.comment, loading, showConfirmation]); // Changed from "comments" to "comment"

  const handleStatusUpdate = (newStatus) => {
    setSelectedNewStatus(newStatus.toLowerCase()); // Convert to lowercase to match API expectations
    setShowStatusDialog(false);
  
    let message = `Status will be updated to "${newStatus}".`;
    if (newStatus.toLowerCase() === 'resolved') {
      toast.success('Marking this issue as resolved will complete the handling process.', {
        autoClose: 3000,
      });
    } else if (newStatus.toLowerCase() === 'in_progress') {
      toast.info('This issue is now marked as in progress. You can return to resolve it later.', {
        autoClose: 3000,
      });
    } else {
      toast.info('This issue is now marked as pending. Please review it later.', {
        autoClose: 3000,
      });
    }
  
    setStatusUpdateMessage(message);
    setShowConfirmation(true);
  };

  const handleCommentChange = (event) => {
    const commentText = event.target.value;
    console.log("Comment changed to:", commentText);

    // If the comment exceeds 500 characters, show an informational toast
    if (commentText.length > 500 && selectedIssue.comment.length <= 500) { // Changed from "comments" to "comment"
      toast.info('Your comment is getting quite detailed. You can continue writing or save whenever ready.', {
        autoClose: 3000, // Toast will disappear after 3 seconds
      });
    }

    setSelectedIssue((prevState) => ({
      ...prevState,
      comment: commentText, // Changed from "comments" to "comment"
    }));
  };

  const handleSave = () => {
    console.log("Current comment before save:", selectedIssue.comment); // Changed from "comments" to "comment"

    // Check if the comment is empty or only contains whitespace
    if (!selectedIssue.comment || !selectedIssue.comment.trim()) { // Changed from "comments" to "comment"
      setErrorMessage('Please add a comment before saving changes.');
      // Warning toast notification
      toast.warning('Please add a comment before saving changes', {
        autoClose: 3000, // Toast will disappear after 3 seconds
      });
      return;
    }

    // Check if the comment is too short
    if (selectedIssue.comment.trim().length < 20) { // Changed from "comments" to "comment"
      toast.warning('Your comment is quite brief. Consider adding more details to help the student.', {
        autoClose: 4000, // Toast will disappear after 4 seconds
      });
    }

    setErrorMessage('');
    setShowStatusDialog(true);
    toast.info('Please select a status for this issue', {
      autoClose: 2000, // Toast will disappear after 2 seconds
    });
  };

 

  const handleConfirmSave = async () => {
    try {
      setLoading(true);

      // Create a FormData object to handle file upload
      const formData = new FormData();
      formData.append('status', selectedNewStatus.toLowerCase());
      formData.append('comment', selectedIssue.comment); // Changed from "comments" to "comment"
      formData.append('is_commented', true);
     

      // Send PATCH request to update the issue
      const response = await API.patch(
        `api/lecturer_issue_management/${selectedIssue.id}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setLoading(false);

      // Success toast notification
      toast.success(`Issue updated successfully.`, {
        autoClose: 3000,
        onClose: () => {
          window.location.href = '/Lecturerdashboard';
        },
      });
    } catch (err) {
      setLoading(false);
      console.error('Error updating issue:', err);

      // Handle errors
      if (!navigator.onLine) {
        toast.error('No internet connection. Please check your network and try again.', {
          autoClose: 4000,
        });
      } else if (err.response && err.response.status === 400) {
        toast.error('Invalid data provided. Please check your input and try again.', {
          autoClose: 4000,
        });
      } else {
        toast.error('An unexpected error occurred. Please try again later.', {
          autoClose: 4000,
        });
      }
    }
  };

  const handleCancelSave = () => {
    setShowConfirmation(false);
    toast.info('Status update cancelled.', {
      autoClose: 2000,
    });
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

  const handleLogout = () => {
    // Clear tokens and user data from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
  
    // Show a toast notification for logout
    toast.info('You have been logged out.');
  
    // Redirect to the landing page
    window.location.href = '/';
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
                value={selectedIssue.comment || ''} // Changed from "comments" to "comment"
                onChange={handleCommentChange}
                placeholder="Enter your response to this issue..."
                rows="4"
                onFocus={() =>
                  toast.info('Adding a detailed comment helps students understand your response better.', {
                    autoClose: 3000, // Toast will disappear after 3 seconds
                  })
                }
              />
              {/* Display current comment value for debugging */}
              <div className="debug-info" style={{ fontSize: "12px", color: "#666" }}>
                Current comment: {selectedIssue.comment ? `"${selectedIssue.comment}"` : "(empty)"} {/* Changed from "comments" to "comment" */}
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
                <p><strong>Comment:</strong> {selectedIssue.comment}</p> {/* Changed from "comments" to "comment" */}
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
      <ToastContainer
        position="top-right" // Position the toasts at the top-right corner
        autoClose={5000} // Automatically close toasts after 3 seconds
        hideProgressBar={true} // Hide the progress bar for a cleaner look
        newestOnTop={true} // Show the newest toasts on top
        closeOnClick // Allow closing toasts by clicking on them
        rtl={false} // Disable right-to-left layout
        pauseOnFocusLoss={false} // Do not pause toasts when the window loses focus
        draggable // Allow dragging toasts to reposition them
        pauseOnHover // Pause toasts when hovered over
        theme="colored" // Use a colored theme for better visibility
      />
    </div>
  );
};

export default LecturerIssueManagement;