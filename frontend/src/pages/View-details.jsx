import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './View-details.css';

const Viewdetails = () => {
  const [issueData, setIssueData] = useState({
    issueId: '1',
    studentName: 'Kibuka Mark',
    issueTitle: 'Wrong Marks',
    issueCategory: 'Missing Marks',
    courseUnitCode: 'CS 1100',
    courseUnitName: 'Software Development Project',
    issueDescription: 'You recorded an 80% yet I got a 95% in the operating systems test.',
    registrarComment: '',
    status: 'In-Progress',
    attachment: null,
  });

  const navigate = useNavigate(); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIssueData({ ...issueData, [name]: value });
  };

  const handleFileChange = (e) => {
    setIssueData({ ...issueData, attachment: e.target.files[0] });
  };

  const handleSave = () => {
    console.log('Saved Issue Data:', issueData);
    alert('Issue data has been saved successfully!');
    // Add logic to save the data to a backend or database
  };

  const handleBack = () => {
    navigate('/IssueManagement'); // Navigate back to the IssueManagement page
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="content-container">
        <Sidebar />
        <div className="issue-detail-container">
          <div className="issue-header">
            <div className="back-button" onClick={handleBack}>
              <span className="back-arrow">‹</span> Back
            </div>
            <div className="share-icon">↗</div>
          </div>

          <div className="issue-content">
            <div className="left-panel">
              <div className="field-container">
                <div className="field-label">Issue ID</div>
                <input
                  type="text"
                  name="issueId"
                  value={issueData.issueId}
                  onChange={handleInputChange}
                  className="field-value"
                />
              </div>

              <div className="field-container">
                <div className="field-label">Student's Name</div>
                <input
                  type="text"
                  name="studentName"
                  value={issueData.studentName}
                  onChange={handleInputChange}
                  className="field-value"
                />
              </div>

              <div className="field-container">
                <div className="field-label">Issue Title</div>
                <input
                  type="text"
                  name="issueTitle"
                  value={issueData.issueTitle}
                  onChange={handleInputChange}
                  className="field-value"
                />
              </div>

              <div className="field-container">
                <div className="field-label">Issue Category</div>
                <input
                  type="text"
                  name="issueCategory"
                  value={issueData.issueCategory}
                  onChange={handleInputChange}
                  className="field-value"
                />
              </div>

              <div className="field-container">
                <div className="field-label">Course Unit Code</div>
                <input
                  type="text"
                  name="courseUnitCode"
                  value={issueData.courseUnitCode}
                  onChange={handleInputChange}
                  className="field-value"
                />
              </div>

              <div className="field-container">
                <div className="field-label">Course Unit Name</div>
                <input
                  type="text"
                  name="courseUnitName"
                  value={issueData.courseUnitName}
                  onChange={handleInputChange}
                  className="field-value"
                />
              </div>

              <div className="field-container">
                <div className="field-label">Issue Description</div>
                <textarea
                  name="issueDescription"
                  value={issueData.issueDescription}
                  onChange={handleInputChange}
                  className="field-value"
                />
              </div>
            </div>

            <div className="right-panel">
              <div className="attachments-section">
                <div className="section-header">Attachments</div>
                <div className="attachment-preview">
                  {issueData.attachment ? (
                    <p>{issueData.attachment.name}</p>
                  ) : (
                    <p>No file attached</p>
                  )}
                </div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="attachment-input"
                />
              </div>

              <div className="registrar-section">
                <div className="registrar-header">(Registrar's Use)</div>
                <div className="registrar-comment-container">
                  <div className="comment-label">Registrar's Comment</div>
                  <input
                    type="text"
                    name="registrarComment"
                    value={issueData.registrarComment}
                    onChange={handleInputChange}
                    className="comment-input"
                    placeholder="Enter your comment about this issue."
                  />
                </div>

                <div className="status-container">
                  <div className="status-label">Status Update</div>
                  <select
                    name="status"
                    value={issueData.status}
                    onChange={handleInputChange}
                    className="status-dropdown"
                  >
                    <option value="In-Progress">In-Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                <button className="save-button" onClick={handleSave}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Viewdetails;