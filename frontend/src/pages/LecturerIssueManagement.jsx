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
    setSelectedIssue({
      ...selectedIssue,
      status: 'Resolved',
    });
    // Add logic to save the issue, e.g., send to server or local storage
    console.log('Issue saved:', selectedIssue);
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
              <button className="save-button" onClick={handleSave}>Save and Mark as Resolved</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LecturerIssueManagement;
