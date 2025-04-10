import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import Sidebar from './Sidebar1';
import './New-issue.css';
import backgroundimage from "../assets/backgroundimage.jpg";
import API from '../api';

const NewIssue = () => {
  const navigate = useNavigate();
  const [registrars, setRegistrars] = useState([]);
  const [registrarName, setRegistrarName] = useState('');
  const [issueCategory, setIssueCategory] = useState('missing_marks');
  const [issueDescription, setIssueDescription] = useState('I have no marks for OS test yet I merged 86% in it.');
  const [attachment, setAttachment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState('');

  // Define issue categories to match backend ISSUE_CHOICES
  const issueCategories = [
    { value: 'missing_marks', label: 'Missing Marks' },
    { value: 'appeal', label: 'Appeal' },
    { value: 'correction', label: 'Correction' }
  ];

  // Fetch registrars and current user when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch registrars
        const registrarsResponse = await API.get('/api/get_registrars/');
        console.log('Registrars API response:', registrarsResponse);
        
        if (registrarsResponse && registrarsResponse.data) {
          setRegistrars(registrarsResponse.data);
          
          // Set first registrar as default if available
          if (registrarsResponse.data.length > 0) {
            const firstRegistrar = typeof registrarsResponse.data[0] === 'object' && registrarsResponse.data[0].name 
              ? registrarsResponse.data[0].name 
              : registrarsResponse.data[0];
            setRegistrarName(firstRegistrar);
          }
        } else {
          setRegistrars([]);
          setError('No data received from server');
        }
        
        // Fetch current user
        try {
          const userResponse = await API.get('/api/current-user/');
          console.log('Current user response:', userResponse);
          if (userResponse && userResponse.data) {
            // Handle different response formats
            const username = typeof userResponse.data === 'object' ? 
              (userResponse.data.username || userResponse.data.name || '') : 
              userResponse.data;
            setCurrentUser(username);
          }
        } catch (userErr) {
          console.error('Error fetching current user:', userErr);
          // Don't set an error here as we still want the form to work
          // even if we can't get the current user
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch necessary data. Please try again later.');
        setRegistrars([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setAttachment(file);
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSubmitStatus(null);

      // Get values from form elements
      const issueTitle = document.querySelector('input[defaultValue="Wrong Marks"]').value;
      const courseUnitCode = document.querySelector('input[defaultValue="CSS 11001"]').value;
      const courseUnitName = document.querySelector('input[defaultValue="Operating Systems"]').value;
      
      // Create FormData object
      const formData = new FormData();
      formData.append('registrar_name', registrarName);
      formData.append('issue_category', issueCategory);
      formData.append('issue_description', issueDescription);
      formData.append('issue_title', issueTitle);
      formData.append('course_unit_code', courseUnitCode);
      formData.append('course_unit_name', courseUnitName);
      formData.append('lecturer_name', ''); // Always sending empty for lecturer name
      formData.append('student_name', currentUser); // Using current user's username
      formData.append('status', 'Submitted');
      
      if (attachment) {
        formData.append('attachment', attachment);
      }

      // Send POST request
      const response = await API.post('/api/issues/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Issue submitted successfully:', response.data);
      setSubmitStatus('success');

      // Navigate to success page after brief delay
      setTimeout(() => {
        navigate('/success', {
          state: {
            registrarName,
            issueTitle,
            courseUnitName,
          },
        });
      }, 1500);
    } catch (err) {
      console.error('Error submitting issue:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
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
              {isLoading ? (
                <select disabled>
                  <option>Loading registrars...</option>
                </select>
              ) : error ? (
                <div>
                  <select disabled>
                    <option>Error loading registrars</option>
                  </select>
                  <p className="error-message">{error}</p>
                </div>
              ) : (
                <select
                  value={registrarName}
                  onChange={(e) => setRegistrarName(e.target.value)}
                >
                  {registrars.length === 0 ? (
                    <option value="">No registrars available</option>
                  ) : (
                    registrars.map((registrar, index) => (
                      <option 
                        key={index} 
                        value={typeof registrar === 'object' ? registrar.name || registrar.username : registrar}
                      >
                        {typeof registrar === 'object' ? registrar.name || registrar.username : registrar}
                      </option>
                    ))
                  )}
                </select>
              )}
            </div>
            <div className="form-group">
              <label>Lecturer's Name</label>
              {/* Lecturer field is set to disabled and empty */}
              <input type="text" disabled placeholder="Not required" value="" readOnly />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Issue Category</label>
              {/* Dropdown for issue categories */}
              <select
                value={issueCategory}
                onChange={(e) => setIssueCategory(e.target.value)}
              >
                {issueCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Student's Name</label>
              {/* Student name field showing current user's name and disabled */}
              <input 
                type="text" 
                value={currentUser} 
                readOnly 
                disabled
                placeholder={isLoading ? "Loading user information..." : ""}
              />
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
              disabled={isSubmitting || isLoading || registrars.length === 0}
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