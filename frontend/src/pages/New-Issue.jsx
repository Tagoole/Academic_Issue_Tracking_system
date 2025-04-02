import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import Sidebar from './Sidebar1';
import './New-Issue.css';
import backgroundimage from "../assets/backgroundimage.jpg";

const NewIssue = () => {
  const navigate = useNavigate();
  const [registrarName, setRegistrarName] = useState('Nassuna Annet');
  const [issueCategory, setIssueCategory] = useState('Missing marks');
  const [issueDescription, setIssueDescription] = useState('I have no marks for OS test yet I merged 86% in it.');
  const [attachment, setAttachment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setAttachment(file ? URL.createObjectURL(file) : null);
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
  };

  const handleSubmit = () => {
    // Set submitting state to show loading indicator
    setIsSubmitting(true);
    
    // Create issue object with all form data
    const issueData = {
      registrarName,
      issueCategory,
      issueDescription,
      attachment,
      issueTitle: document.querySelector('input[defaultValue="Wrong Marks"]').value,
      courseUnitCode: document.querySelector('input[defaultValue="CSS 11001"]').value,
      courseUnitName: document.querySelector('input[defaultValue="Operating Systems"]').value,
      lecturerName: document.querySelector('input[placeholder=""]').value,
      studentName: document.querySelector('input[placeholder="Enter your full name"]').value,
      status: "Submitted"
    };
    
    // Simulate API call to send data to the registrar
    setTimeout(() => {
      console.log("Issue submitted to registrar:", issueData);
      setIsSubmitting(false);
      setSubmitStatus("success");
      
      // Navigate to success page after brief delay
      setTimeout(() => {
        navigate('/success', { 
          state: { 
            registrarName,
            issueTitle: issueData.issueTitle,
            courseUnitName: issueData.courseUnitName
          } 
        });
      }, 1500);
    }, 1500);
  };

  return (
    <div className="create-issue-page" style={{ backgroundImage: `url(${backgroundimage})` }}>
      <NavBar />
      <div className="page-content">
        <Sidebar />
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
              <label className='status'>Status</label>
              <input type="text" defaultValue="Pending ......." />
            </div>
          </div>

          {/* Submit Button Section */}
          <div className="form-row submit-row">
            <button 
              className="submit-button" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Issue'}
            </button>
            
            {submitStatus === 'success' && (
              <div className="submit-status success">
                Issue successfully sent to {registrarName}!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewIssue;