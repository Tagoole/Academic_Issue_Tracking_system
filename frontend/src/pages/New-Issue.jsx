import React, { useState } from 'react';
import './New-Issue.css';

const NewIssue = () => {
  const [registrarName, setRegistrarName] = useState('Nassuna Annet');
  const [issueCategory, setIssueCategory] = useState('Missing marks');
  const [issueDescription, setIssueDescription] = useState('I have no marks for OS test yet i merged 86% in it.');
  const [attachment, setAttachment] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setAttachment(file ? URL.createObjectURL(file) : null);
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
  };

  return (
    <div className="issue-form-container">
      <h1>Create New Issue</h1>
      <div className="form-row">
        <div className="form-group">
          <label>Registrar's Name</label>
          <input 
            type="text" 
            value={registrarName} 
            onChange={(e) => setRegistrarName(e.target.value)}
          />
          <span className="clear-icon">×</span>
        </div>
        <div className="form-group">
          <label>Lecturer's Name</label>
          <input type="text" placeholder="" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Issue Category</label>
          <input 
            type="text" 
            value={issueCategory} 
            onChange={(e) => setIssueCategory(e.target.value)}
          />
          <span className="clear-icon">×</span>
        </div>
        <div className="form-group">
          <label>Student's Name</label>
          <input type="text" placeholder="Enter your full name" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group full-width">
          <label>Issue Description</label>
          <textarea 
            value={issueDescription} 
            onChange={(e) => setIssueDescription(e.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Attachments</label>
          <div className="attachment-area">
            {attachment ? (
              <div className="attachment-preview">
                <img src={attachment} alt="Attachment" />
                <span className="clear-icon" onClick={handleRemoveAttachment}>×</span>
              </div>
            ) : (
              <div className="attachment-placeholder">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload}
                />
              </div>
            )}
          </div>
        </div>
        <div className="form-group">
          <label>Issue Title</label>
          <input type="text" defaultValue="Wrong Marks" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Course Unit Code</label>
          <input type="text" defaultValue="CSS 11001" />
        </div>
        <div className="form-group">
          <label>Course Unit Name</label>
          <input type="text" defaultValue="Operating Systems" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Status</label>
          <input type="text" defaultValue="Pending ......." />
        </div>
      </div>
    </div>
  );
};

export default NewIssue;