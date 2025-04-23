import React, { useState, useEffect } from 'react';
import './LecturerIssueManagement.css'; 
import Navbar from './NavBar'; 
import Sidebar2 from './Sidebar2'; 
import backgroundImage from '../assets/backgroundimage.jpg'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    attachments: [],
    comments: '',
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

  // Fetch issue data from sessionStorage when component mounts
  useEffect(() => {
    try {
      // Get the issue data from sessionStorage
      const issueData = JSON.parse(sessionStorage.getItem('issueToResolve'));
      console.log(issueData);
      if (issueData) {
        console.log("Retrieved issue data:", issueData);
        
        // Map the API response fields to our component's state structure
        setSelectedIssue(prevState => ({
          ...prevState,
          id: issueId,
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
          year_of_study: issueData.year_of_study
        }));
        
        // Success toast notification
        toast.success('Issue details loaded successfully');
      } else {
        console.log(`No issue data found in sessionStorage for ID: ${issueId}`);
        // Error toast notification
        toast.error('Issue data not found. Please return to dashboard.');
        // You might want to redirect back to dashboard or show an error
      }
    } catch (error) {
      console.error("Error parsing issue data from sessionStorage:", error);
      // Error toast notification
      toast.error('Error loading issue details. Please try again.');
    }
  }, [issueId]);

  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [statusUpdateMessage, setStatusUpdateMessage] = useState('');
  const [selectedNewStatus, setSelectedNewStatus] = useState('');

  const handleStatusUpdate = (newStatus) => {
    setSelectedNewStatus(newStatus);
    setShowStatusDialog(false);

    let message = `Status will be updated to "${newStatus}".`;
    if (newStatus !== 'Resolved') {
      message += " Please remember to come back later and resolve this issue.";
    }
    setStatusUpdateMessage(message);
    setShowConfirmation(true);
    
    // Info toast notification
    toast.info(`Status selected: ${newStatus}`);
  };

  const handleCommentChange = (event) => {
    setSelectedIssue({
      ...selectedIssue,
      comments: event.target.value,
    });
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    
    if (selectedFile) {
      // Success toast notification
      toast.success(`File "${selectedFile.name}" selected`);
    }
  };

  const handleSave = () => {
    if (!selectedIssue.comments.trim()) {
      setErrorMessage('Please add a comment before saving changes.');
      
      // Warning toast notification
      toast.warning('Please add a comment before saving changes');
      return;
    }

    setErrorMessage('');
    setShowStatusDialog(true);
  };

  const handleConfirmSave = () => {
    try {
      // Here you would typically make an API call to update the issue
      // For now, we'll just update the local state
      setSelectedIssue({
        ...selectedIssue,
        status: selectedNewStatus,
      });

      console.log('Issue saved with status:', selectedNewStatus, selectedIssue);
      
      // Clear the stored issue data before redirecting
      sessionStorage.removeItem('issueToResolve');
      
      // Success toast notification
      toast.success(`Issue status updated to ${selectedNewStatus} successfully`, {
        onClose: () => {
          // Redirect back to dashboard after toast is closed
          window.location.href = '/Lecturerdashboard';
        },
        autoClose: 3000 // Stay open for 3 seconds
      });
    } catch (error) {
      console.error("Error saving issue status:", error);
      
      // Error toast notification
      toast.error('Failed to update issue status. Please try again.');
      setShowConfirmation(false);
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
              <div className="issue-field"><strong>Issue ID:</strong><p>{issueId}</p></div>
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
              <strong>Comments</strong>
              <textarea
                value={selectedIssue.comments}
                onChange={handleCommentChange}
                placeholder="Enter your response to this issue..."
                rows="4"
              />
            </div>

            <div className="file-attachment-section">
              <strong>Attach Files</strong>
              <input type="file" onChange={handleFileChange} />
              {file && <p>File selected: {file.name}</p>}
            </div>

            <div className="save-button-container">
              <button className="save-button" onClick={handleSave}>Save Changes and Update Status</button>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
          </div>

          {showStatusDialog && (
            <div className="status-dialog-overlay">
              <div className="status-dialog">
                <h3>Choose Status</h3>
                <p>Select a status for this issue:</p>
                <div className="status-options">
                  <button className="status-option pending" onClick={() => handleStatusUpdate('Pending')}>Pending</button>
                  <button className="status-option in-progress" onClick={() => handleStatusUpdate('In Progress')}>In Progress</button>
                  <button className="status-option resolved" onClick={() => handleStatusUpdate('Resolved')}>Resolved</button>
                </div>
                <button className="cancel-button" onClick={() => {
                  setShowStatusDialog(false);
                  toast.info('Status selection cancelled');
                }}>Cancel</button>
              </div>
            </div>
          )}

          {showConfirmation && (
            <div className="status-dialog-overlay">
              <div className="status-dialog">
                <h3>Status Update</h3>
                <p>{statusUpdateMessage}</p>
                <div className="confirmation-buttons">
                  <button className="confirm-button" onClick={handleConfirmSave}>Confirm</button>
                  <button className="cancel-button" onClick={handleCancelSave}>Cancel</button>
                </div>
              </div>
            </div>
          )}
          
          {/* Toast Container - This is where all toast notifications will appear */}
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
        </main>
      </div>
    </div>
  );
};

export default LecturerIssueManagement;