import React, { useState } from 'react';
import './LecturerIssueManagement.css'; 
import Navbar from './NavBar'; 
import Sidebar2 from './Sidebar2'; 
import backgroundImage from '../assets/backgroundimage.jpg'; 

const LecturerIssueManagement = () => {
  const [selectedIssue, setSelectedIssue] = useState({
    id: 1,
    title: 'Sample Issue',
    status: 'In-progress',
    studentNo: '25/U0000/PS',
    category: 'Missing Mark',
    date: '01/01/2025',
    submissionDate: '2025-01-01',
    courseUnitName: 'Math 101',
    courseUnitCode: 'MATH101',
    assignedLecturer: 'Dr. John',
    description: 'Description of the issue',
    attachments: [],
    comments: '',
  });

  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [statusUpdateMessage, setStatusUpdateMessage] = useState('');
  const [selectedNewStatus, setSelectedNewStatus] = useState('');

  const handleStatusUpdate = (newStatus) => {
    setSelectedNewStatus(newStatus);
    setShowStatusDialog(false);

    // Prepare status update message
    let message = `Status will be updated to "${newStatus}".`;
    if (newStatus !== 'Resolved') {
      message += " Please remember to come back later and resolve this issue.";
    }
    setStatusUpdateMessage(message);
    setShowConfirmation(true);
  };

  const handleCommentChange = (event) => {
    setSelectedIssue({
      ...selectedIssue,
      comments: event.target.value,
    });
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSave = () => {
    // Check if comments are empty
    if (!selectedIssue.comments.trim()) {
      setErrorMessage('Please add a comment before saving changes.');
      return;
    }

    // Clear any previous error message
    setErrorMessage('');

    // Show status selection dialog
    setShowStatusDialog(true);
  };

  const handleConfirmSave = () => {
    // Update the issue with new status and comments
    setSelectedIssue({
      ...selectedIssue,
      status: selectedNewStatus,
    });
    
    // Add logic to save the issue to server/storage
    console.log('Issue saved with status:', selectedNewStatus, selectedIssue);
    
    // Navigate back to dashboard
    window.location.href = '/Lecturerdashboard';
  };

  const handleCancelSave = () => {
    setShowConfirmation(false);
  };

  return (
    <div
      className="app-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '1000px',
      }}
    >
      <Navbar />
      <div className="content-container">
        <Sidebar2 />
        <main className="main-content">
          <div className="issue-management-container">
            <h2>Issue Management</h2>
            <div className="issue-details">
              <div className="issue-field">
                <strong>Issue Title:</strong>
                <p>{selectedIssue.title}</p>
              </div>
              <div className="issue-field">
                <strong>Issue ID:</strong>
                <p>{selectedIssue.id}</p>
              </div>
              <div className="issue-field">
                <strong>Student No:</strong>
                <p>{selectedIssue.studentNo}</p>
              </div>
              <div className="issue-field">
                <strong>Issue Category:</strong>
                <p>{selectedIssue.category}</p>
              </div>
              <div className="issue-field">
                <strong>Issue Status:</strong>
                <p>{selectedIssue.status}</p>
              </div>
              <div className="issue-field">
                <strong>Assigned Lecturer:</strong>
                <p>{selectedIssue.assignedLecturer}</p>
              </div>
              <div className="issue-field">
                <strong>Description:</strong>
                <p>{selectedIssue.description}</p>
              </div>
            </div>

            <div className="comment-section">
              <strong>Comments</strong>
              <textarea
                value={selectedIssue.comments}
                onChange={handleCommentChange}
                placeholder="Enter comments..."
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
                  <button 
                    className="status-option pending" 
                    onClick={() => handleStatusUpdate('Pending')}
                  >
                    Pending
                  </button>
                  <button 
                    className="status-option in-progress" 
                    onClick={() => handleStatusUpdate('In Progress')}
                  >
                    In Progress
                  </button>
                  <button 
                    className="status-option resolved" 
                    onClick={() => handleStatusUpdate('Resolved')}
                  >
                    Resolved
                  </button>
                </div>
                <button 
                  className="cancel-button" 
                  onClick={() => setShowStatusDialog(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {showConfirmation && (
            <div className="status-dialog-overlay">
              <div className="status-dialog">
                <h3>Status Update</h3>
                <p>{statusUpdateMessage}</p>
                <div className="confirmation-buttons">
                  <button 
                    className="confirm-button" 
                    onClick={handleConfirmSave}
                  >
                    Confirm
                  </button>
                  <button 
                    className="cancel-button" 
                    onClick={handleCancelSave}
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
