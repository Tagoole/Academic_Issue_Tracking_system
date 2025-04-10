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
  const [courseUnits, setCourseUnits] = useState([]);
  const [registrarName, setRegistrarName] = useState('');
  const [issueCategory, setIssueCategory] = useState('missing_marks');
  const [issueDescription, setIssueDescription] = useState('I have no marks for OS test yet I merged 86% in it.');
  const [attachment, setAttachment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isLoading, setIsLoading] = useState({
    registrars: true,
    courseUnits: true,
    user: true
  });
  const [errors, setErrors] = useState({
    registrars: null,
    courseUnits: null,
    user: null,
    general: null
  });
  const [currentUser, setCurrentUser] = useState('');
  const [selectedCourseUnit, setSelectedCourseUnit] = useState('');

  // Define issue categories to match backend ISSUE_CHOICES
  const issueCategories = [
    { value: 'missing_marks', label: 'Missing Marks' },
    { value: 'appeal', label: 'Appeal' },
    { value: 'correction', label: 'Correction' }
  ];

  // Fetch registrars when component mounts
  useEffect(() => {
    const fetchRegistrars = async () => {
      try {
        setIsLoading(prev => ({ ...prev, registrars: true }));
        setErrors(prev => ({ ...prev, registrars: null }));
        
        const response = await API.get('/api/get_registrars/');
        console.log('Registrars API response:', response);
        
        if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
          setRegistrars(response.data);
          
          // Set first registrar as default
          const firstRegistrar = typeof response.data[0] === 'object' && response.data[0].name 
            ? response.data[0].name 
            : response.data[0];
          setRegistrarName(firstRegistrar);
        } else {
          setRegistrars([]);
          setErrors(prev => ({ ...prev, registrars: 'No registrars found. Please try again later.' }));
        }
      } catch (err) {
        console.error('Error fetching registrars:', err);
        setRegistrars([]);
        setErrors(prev => ({ 
          ...prev, 
          registrars: `Failed to load registrars: ${err.response?.data?.message || err.message || 'Unknown error'}`
        }));
      } finally {
        setIsLoading(prev => ({ ...prev, registrars: false }));
      }
    };

    fetchRegistrars();
  }, []);

  // Fetch course units when component mounts
  useEffect(() => {
    const fetchCourseUnits = async () => {
      try {
        setIsLoading(prev => ({ ...prev, courseUnits: true }));
        setErrors(prev => ({ ...prev, courseUnits: null }));
        
        const response = await API.get('/api/course_unit/');
        console.log('Course units API response:', response);
        
        if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
          setCourseUnits(response.data);
          
          // Set first course unit as default
          const firstCourseUnit = typeof response.data[0] === 'object' 
            ? response.data[0].name || response.data[0].course_unit_name 
            : response.data[0];
          setSelectedCourseUnit(firstCourseUnit);
        } else {
          setCourseUnits([]);
          setErrors(prev => ({ ...prev, courseUnits: 'No course units found. Please try again later.' }));
        }
      } catch (err) {
        console.error('Error fetching course units:', err);
        setCourseUnits([]);
        setErrors(prev => ({ 
          ...prev, 
          courseUnits: `Failed to load course units: ${err.response?.data?.message || err.message || 'Unknown error'}`
        }));
      } finally {
        setIsLoading(prev => ({ ...prev, courseUnits: false }));
      }
    };

    fetchCourseUnits();
  }, []);

  // Fetch current user when component mounts
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setIsLoading(prev => ({ ...prev, user: true }));
        setErrors(prev => ({ ...prev, user: null }));
        
        const response = await API.get('/api/get_user_info/');
        console.log('Current user response:', response);
        
        if (response && response.data) {
          // Handle different response formats
          const username = typeof response.data === 'object' ? 
            (response.data.username || response.data.name || '') : 
            response.data;
          setCurrentUser(username);
        } else {
          setCurrentUser('');
          setErrors(prev => ({ ...prev, user: 'Failed to retrieve user information.' }));
        }
      } catch (err) {
        console.error('Error fetching current user:', err);
        setCurrentUser('');
        setErrors(prev => ({ 
          ...prev, 
          user: `Could not load user info: ${err.response?.data?.message || err.message || 'Unknown error'}`
        }));
      } finally {
        setIsLoading(prev => ({ ...prev, user: false }));
      }
    };

    fetchCurrentUser();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setAttachment(file);
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
  };

  const handleSubmit = async () => {
    // Reset any previous submission status
    setSubmitStatus(null);
    setErrors(prev => ({ ...prev, general: null }));
    
    // Form validation
    if (!registrarName) {
      setErrors(prev => ({ ...prev, general: 'Please select a registrar.' }));
      return;
    }
    
    if (!selectedCourseUnit) {
      setErrors(prev => ({ ...prev, general: 'Please select a course unit.' }));
      return;
    }
    
    const issueTitle = document.querySelector('input[name="issue_title"]').value;
    if (!issueTitle.trim()) {
      setErrors(prev => ({ ...prev, general: 'Please enter an issue title.' }));
      return;
    }
    
    if (!issueDescription.trim()) {
      setErrors(prev => ({ ...prev, general: 'Please provide an issue description.' }));
      return;
    }
    
    try {
      setIsSubmitting(true);

      // Create FormData object
      const formData = new FormData();
      formData.append('registrar_name', registrarName);
      formData.append('issue_category', issueCategory);
      formData.append('issue_description', issueDescription);
      formData.append('issue_title', issueTitle);
      formData.append('course_unit_name', selectedCourseUnit);
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
            courseUnitName: selectedCourseUnit,
          },
        });
      }, 1500);
    } catch (err) {
      console.error('Error submitting issue:', err);
      setSubmitStatus('error');
      setErrors(prev => ({ 
        ...prev, 
        general: `Failed to submit issue: ${err.response?.data?.message || err.message || 'Unknown error. Please try again later.'}`
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form is ready for submission
  const isFormReady = registrars.length > 0 && courseUnits.length > 0 && !isLoading.registrars && !isLoading.courseUnits;
  
  // Check if any loading is in progress
  const anyLoading = isLoading.registrars || isLoading.courseUnits || isLoading.user;

  // Helper function to retry loading
  const retryLoading = (type) => {
    if (type === 'registrars') {
      // Reset registrars error and trigger effect to reload
      setErrors(prev => ({ ...prev, registrars: null }));
      setIsLoading(prev => ({ ...prev, registrars: true }));
      // Force effect to run again by updating a dependency
      setRegistrars([]);
    } else if (type === 'courseUnits') {
      // Reset course units error and trigger effect to reload
      setErrors(prev => ({ ...prev, courseUnits: null }));
      setIsLoading(prev => ({ ...prev, courseUnits: true }));
      // Force effect to run again by updating a dependency
      setCourseUnits([]);
    }
  };

  return (
    <div className="create-issue-page" style={{ backgroundImage: `url(${backgroundimage})` }}>
      <NavBar />
      <div className="page-content">
        <Sidebar />
        <div className="issue-form-container">
          <h1>Create New Issue</h1>
          
          {/* General error message at the top */}
          {errors.general && (
            <div className="error-banner">
              <p>{errors.general}</p>
              <button className="dismiss-btn" onClick={() => setErrors(prev => ({ ...prev, general: null }))}>×</button>
            </div>
          )}
          
          <div className="form-row">
            <div className="form-group">
              <label>Registrar's Name</label>
              {isLoading.registrars ? (
                <div className="loading-field">
                  <select disabled>
                    <option>Loading registrars...</option>
                  </select>
                  <div className="loading-spinner"></div>
                </div>
              ) : errors.registrars ? (
                <div className="error-field">
                  <select disabled>
                    <option>Error loading registrars</option>
                  </select>
                  <p className="error-message">{errors.registrars}</p>
                  <button className="retry-btn" onClick={() => retryLoading('registrars')}>Retry</button>
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
              {isLoading.user ? (
                <input 
                  type="text" 
                  disabled
                  placeholder="Loading user information..."
                />
              ) : errors.user ? (
                <div className="error-field">
                  <input 
                    type="text" 
                    disabled
                    placeholder="Error loading user"
                    value={currentUser}
                  />
                  <p className="error-message">{errors.user}</p>
                </div>
              ) : (
                <input 
                  type="text" 
                  value={currentUser} 
                  readOnly 
                  disabled
                />
              )}
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
              <input type="text" name="issue_title" defaultValue="Wrong Marks" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Course Unit Name</label>
              {isLoading.courseUnits ? (
                <div className="loading-field">
                  <select disabled>
                    <option>Loading course units...</option>
                  </select>
                  <div className="loading-spinner"></div>
                </div>
              ) : errors.courseUnits ? (
                <div className="error-field">
                  <select disabled>
                    <option>Error loading course units</option>
                  </select>
                  <p className="error-message">{errors.courseUnits}</p>
                  <button className="retry-btn" onClick={() => retryLoading('courseUnits')}>Retry</button>
                </div>
              ) : (
                <select
                  value={selectedCourseUnit}
                  onChange={(e) => setSelectedCourseUnit(e.target.value)}
                >
                  {courseUnits.length === 0 ? (
                    <option value="">No course units available</option>
                  ) : (
                    courseUnits.map((unit, index) => (
                      <option 
                        key={index} 
                        value={typeof unit === 'object' ? unit.name || unit.course_unit_name : unit}
                      >
                        {typeof unit === 'object' ? unit.name || unit.course_unit_name : unit}
                      </option>
                    ))
                  )}
                </select>
              )}
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
              disabled={isSubmitting || anyLoading || !isFormReady}
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
                Failed to submit issue. Please check the form and try again.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewIssue;