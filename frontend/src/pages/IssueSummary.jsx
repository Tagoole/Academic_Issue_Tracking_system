import React from 'react';
import './IssueSummary.css'; // Import the corresponding CSS file

const IssueSummary = ({ issue }) => {
  if (!issue) return null; // If no issue is passed, return nothing

  return (
    <div className="issue-summary-container">
      <div className="issue-summary-card">
        <h3>Issue Summary</h3>
        <div className="issue-field">
          <strong>Issue Title:</strong>
          <p>{issue.title}</p>
        </div>
        <div className="issue-field">
          <strong>Issue ID:</strong>
          <p>{issue.id}</p>
        </div>
        <div className="issue-field">
          <strong>Submission Date:</strong>
          <p>{issue.submissionDate}</p>
        </div>
        <div className="issue-field">
          <strong>Issue Category:</strong>
          <p>{issue.category}</p>
        </div>
        <div className="issue-field">
          <strong>Issue Status:</strong>
          <p>{issue.status}</p>
        </div>
        <div className="issue-field">
          <strong>Course Unit Name:</strong>
          <p>{issue.courseUnitName}</p>
        </div>
        <div className="issue-field">
          <strong>Course Unit Code:</strong>
          <p>{issue.courseUnitCode}</p>
        </div>
        <div className="issue-field">
          <strong>Assigned Lecturer:</strong>
          <p>{issue.assignedLecturer}</p>
        </div>
        <div className="issue-field">
          <strong>Issue Description:</strong>
          <p>{issue.description}</p>
        </div>
        <div className="issue-field">
          <strong>Attachments:</strong>
          <button className="open-file-button">Open file</button>
        </div>
      </div>
    </div>
  );
};

export default IssueSummary;
