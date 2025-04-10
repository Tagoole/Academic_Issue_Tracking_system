import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import Sidebar from './Sidebar1';
import './New-issue.css';
import backgroundimage from "../assets/backgroundimage.jpg";
import API from '../api'; // Using your existing API import

const NewIssue = () => {
  const navigate = useNavigate();
  const [registrars, setRegistrars] = useState([]);
  const [registrarName, setRegistrarName] = useState('');
  const [issueCategory, setIssueCategory] = useState('Missing marks');
  const [issueDescription, setIssueDescription] = useState('I have no marks for OS test yet I merged 86% in it.');
  const [attachment, setAttachment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Fetch registrars when component mounts
  useEffect(() => {
    // Fetch registrars from API
    API.get('/api/get_registrars/')
      .then(response => {
        console.log('Registrars fetched:', response.data);
        setRegistrars(response.data);
        
        // Set first registrar as default if available
        if (response.data && response.data.length > 0) {
          // Handle different response formats (array of strings or objects)
          const firstRegistrar = typeof response.data[0] === 'object' 
            ? response.data[0].name 
            : response.data[0];
          setRegistrarName(firstRegistrar);
        }
      })
      .catch(error => {
        console.error('Error fetching registrars:', error);
      });
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setAttachment(file); // Store the file object itself, not a URL
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    // Create FormData object to handle file upload and text fields
    const formData = new FormData();
    formData.append('registrar_name', registrarName);
    formData.append('issue_category', issueCategory);
    formData.append('issue_description', issueDescription);
    formData.append('issue_title', document.querySelector('input[defaultValue="Wrong Marks"]').value);
    formData.append('course_unit_code', document.querySelector('input[defaultValue="CSS 11001"]').value);
    formData.append('course_unit_name', document.querySelector('input[defaultValue="Operating Systems"]').value);
    formData.append('lecturer_name', document.querySelector('input[placeholder=""]').value || '');
    formData.append('student_name', document.querySelector('input[placeholder="Enter your full name"]').value || '');
    formData.append('status', 'Submitted');
    if (attachment) {
      formData.append('attachment', attachment); // Attach file if present
    }

    // Send POST request to Django API
    API.post('/api/issues/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Required for file uploads
      },
    })
    .then((response) => {
      console.log('Issue submitted successfully:', response.data);
      setIsSubmitting(false);
      setSubmitStatus('success');

      // Navigate to success page after brief delay
      setTimeout(() => {
        navigate('/success', {
          state: {
            registrarName,
            issueTitle: response.data.issue_title,
            courseUnitName: response.data.course_unit_name,
          },
        });
      }, 1500);
    })
    .catch((error) => {
      console.error('Error submitting issue:', error);
      setIsSubmitting(false);
      setSubmitStatus('error');
    });
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
              <select
                value={registrarName}
                onChange={(e) => setRegistrarName(e.target.value)}
              >
                {registrars.length === 0 && <option value="">Loading registrars...</option>}
                
                {registrars.map((registrar, index) => (
                  <option 
                    key={index} 
                    value={typeof registrar === 'object' ? registrar.name : registrar}
                  >
                    {typeof registrar === 'object' ? registrar.name : registrar}
                  </option>
                ))}
              </select>
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
                    <img src={URL.createObjectURL(attachment)} alt="Attachment" />
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
              <label className="status">Status</label>
              <input type="text" defaultValue="Pending ......." disabled />
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
            {submitStatus === 'error' && (
              <div className="submit-status error">
                Failed to submit issue. Please try again.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewIssue;