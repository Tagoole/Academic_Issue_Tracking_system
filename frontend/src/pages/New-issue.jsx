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
  const [issueType, setIssueType] = useState('missing_marks');
  const [description, setDescription] = useState('I have no marks for OS test yet I merged 86% in it.');
  const [attachment, setAttachment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [yearOfStudy, setYearOfStudy] = useState('1st_year');
  const [semester, setSemester] = useState('one');
  const [isLoading, setIsLoading] = useState({
    registrars: true,
    courseUnits: true,
    user: false
  });
  const [errors, setErrors] = useState({
    registrars: null,
    courseUnits: null,
    user: null,
    general: null
  });
  const [currentUser, setCurrentUser] = useState('');
  const [selectedCourseUnitId, setSelectedCourseUnitId] = useState(''); // Changed to store ID instead of name
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');

  // Define issue types to match backend ISSUE_CHOICES
  const issueTypes = [
    { value: 'missing_marks', label: 'Missing Marks' },
    { value: 'appeal', label: 'Appeal' },
    { value: 'correction', label: 'Correction' }
  ];

  // Define year of study options
  const yearOfStudyOptions = [
    { value: '1st_year', label: '1st Year' },
    { value: '2nd_year', label: '2nd Year' },
    { value: '3rd_year', label: '3rd Year' },
    { value: '4th_year', label: '4th Year' },
    { value: '5th_year', label: '5th Year' }
  ];

  // Define semester options
  const semesterOptions = [
    { value: 'one', label: 'One' },
    { value: 'two', label: 'Two' }
  ];

  // Define status options
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'in_progress', label: 'In Progress' }
  ];

  // Get username and tokens from localStorage when component mounts
  useEffect(() => {
    try {
      // Get username from localStorage
      const username = localStorage.getItem('userName');
      console.log('Username from localStorage:', username);
      
      // Get access token from localStorage
      const access = localStorage.getItem('accessToken');
      console.log('Access token retrieved:', access ? 'Yes' : 'No');
      
      // Get refresh token from localStorage
      const refresh = localStorage.getItem('refreshToken');
      console.log('Refresh token retrieved:', refresh ? 'Yes' : 'No');
      
      if (username) {
        setCurrentUser(username);
      } else {
        setCurrentUser('');
        setErrors(prev => ({ ...prev, user: 'User information not found. Please sign in again.' }));
      }
      
      if (access) {
        setAccessToken(access);
      } else {
        setErrors(prev => ({ ...prev, general: 'Authentication token not found. Please sign in again.' }));
        // Optionally redirect to sign in page if no token found
        // setTimeout(() => navigate('/signin'), 1500);
      }
      
      if (refresh) {
        setRefreshToken(refresh);
      }
    } catch (err) {
      console.error('Error retrieving user info from localStorage:', err);
      setCurrentUser('');
      setErrors(prev => ({ 
        ...prev, 
        user: `Could not load user info: ${err.message || 'Unknown error'}`
      }));
    }
  }, [navigate]);

  // Create API request config with auth token
  const getAuthConfig = () => {
    return {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    };
  };

  // Function to refresh the access token using refresh token
  const refreshAccessToken = async () => {
    try {
      const response = await API.post('/api/token/refresh/', {
        refresh: refreshToken
      });
      
      if (response && response.data && response.data.access) {
        // Save new access token to localStorage and state
        localStorage.setItem('accessToken', response.data.access);
        setAccessToken(response.data.access);
        return response.data.access;
      }
      return null;
    } catch (err) {
      console.error('Error refreshing access token:', err);
      // If refresh fails, redirect to login
      setErrors(prev => ({ ...prev, general: 'Session expired. Please sign in again.' }));
      setTimeout(() => navigate('/signin'), 1500);
      return null;
    }
  };

  // Helper function to handle API requests with token refresh capability
  const makeAuthRequest = async (requestFn) => {
    try {
      // First attempt with current access token
      return await requestFn();
    } catch (err) {
      // If unauthorized error (401), try refreshing the token
      if (err.response && err.response.status === 401 && refreshToken) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          // Retry the request with new token
          return await requestFn(newToken);
        }
      }
      // If not 401 or refresh failed, throw the original error
      throw err;
    }
  };

  // Fetch registrars when component mounts
  useEffect(() => {
    const fetchRegistrars = async () => {
      if (!accessToken) return; // Don't fetch if no access token
      
      try {
        setIsLoading(prev => ({ ...prev, registrars: true }));
        setErrors(prev => ({ ...prev, registrars: null }));
        
        // Use the makeAuthRequest helper for token refresh capability
        const response = await makeAuthRequest(async (token = accessToken) => {
          return API.get('/api/get_registrars/', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        });
        
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
  }, [accessToken, refreshToken]);

  // Fetch course units when component mounts
  useEffect(() => {
    const fetchCourseUnits = async () => {
      if (!accessToken) return; // Don't fetch if no access token
      
      try {
        setIsLoading(prev => ({ ...prev, courseUnits: true }));
        setErrors(prev => ({ ...prev, courseUnits: null }));
        
        // Use the makeAuthRequest helper for token refresh capability
        const response = await makeAuthRequest(async (token = accessToken) => {
          return API.get('/api/course_unit/', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        });
        
        console.log('Course units API response:', response);
        
        if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
          setCourseUnits(response.data);
          
          // Set first course unit as default
          if (response.data.length > 0) {
            const firstUnit = response.data[0];
            // Use the ID instead of name
            const firstUnitId = typeof firstUnit === 'object' ? firstUnit.id : firstUnit;
            setSelectedCourseUnitId(firstUnitId);
          }
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
  }, [accessToken, refreshToken]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setAttachment(file);
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
  };

  const handleSubmit = async () => {
    // Check if token exists
    if (!accessToken) {
      setErrors(prev => ({ ...prev, general: 'Authentication token not found. Please sign in again.' }));
      setTimeout(() => navigate('/signin'), 1500);
      return;
    }
    
    // Reset any previous submission status
    setSubmitStatus(null);
    setErrors(prev => ({ ...prev, general: null }));
    
    // Form validation
    if (!registrarName) {
      setErrors(prev => ({ ...prev, general: 'Please select a registrar.' }));
      return;
    }
    
    if (!selectedCourseUnitId) {
      setErrors(prev => ({ ...prev, general: 'Please select a course unit.' }));
      return;
    }
    
    const issueTitle = document.querySelector('input[name="issue_title"]').value;
    if (!issueTitle.trim()) {
      setErrors(prev => ({ ...prev, general: 'Please enter an issue title.' }));
      return;
    }
    
    if (!description.trim()) {
      setErrors(prev => ({ ...prev, general: 'Please provide an issue description.' }));
      return;
    }
    
    if (!currentUser) {
      setErrors(prev => ({ ...prev, general: 'User information not found. Please sign in again.' }));
      navigate('/signin');
      return;
    }
    
    try {
      setIsSubmitting(true);

      // Create FormData object
      const formData = new FormData();
      formData.append('registrar_name', registrarName);
      formData.append('issue_type', issueType);
      formData.append('description', description);
      formData.append('issue_title', issueTitle);
      formData.append('course_unit_id', selectedCourseUnitId);
      formData.append('lecturer_name', '');
      formData.append('student_name', currentUser);
      formData.append('status', 'pending');
      formData.append('year_of_study', yearOfStudy);
      formData.append('semester', semester);
      
      if (attachment) {
        formData.append('attachment', attachment);
      }

      // For debugging - log what we're sending to the API
      console.log('Submitting form data:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      // Send POST request with auth header using the makeAuthRequest helper
      const response = await makeAuthRequest(async (token = accessToken) => {
        return API.post('/api/issues/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
        });
      });

      console.log('Issue submitted successfully:', response.data);
      setSubmitStatus('success');

      // Navigate to success page after brief delay
      setTimeout(() => {
        // Find the course unit name for display on success page
        const selectedUnit = courseUnits.find(unit => {
          if (typeof unit === 'object') {
            return unit.id === selectedCourseUnitId;
          }
          return unit === selectedCourseUnitId;
        });
        
        const courseUnitName = selectedUnit ? 
          (typeof selectedUnit === 'object' ? selectedUnit.name || selectedUnit.course_unit_name : selectedUnit) : 
          'Selected Course Unit';
          
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
      
      // Handle API error responses
      let errorMessage = 'Unknown error. Please try again later.';
      
      if (err.response) {
        console.log('Error response data:', err.response.data);
        
        if (err.response.data && typeof err.response.data === 'object') {
          // Format error messages from response data if available
          const errorMessages = [];
          Object.entries(err.response.data).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              errorMessages.push(`${field}: ${messages.join(', ')}`);
            } else if (typeof messages === 'string') {
              errorMessages.push(`${field}: ${messages}`);
            }
          });
          
          if (errorMessages.length > 0) {
            errorMessage = errorMessages.join('\n');
          } else {
            errorMessage = 'Server error. Please try again later.';
          }
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setErrors(prev => ({ ...prev, general: `Failed to submit issue: ${errorMessage}` }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form is ready for submission
  const isFormReady = registrars.length > 0 && courseUnits.length > 0 && !isLoading.registrars && !isLoading.courseUnits && accessToken;
  
  // Check if any loading is in progress
  const anyLoading = isLoading.registrars || isLoading.courseUnits;

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

  // Helper function to get course unit name by ID for display purposes
  const getCourseUnitNameById = (id) => {
    const unit = courseUnits.find(unit => {
      if (typeof unit === 'object') {
        return unit.id === id;
      }
      return unit === id;
    });
    
    if (!unit) return '';
    
    return typeof unit === 'object' ? unit.name || unit.course_unit_name : unit;
  };

  return (
    <div className="create-issue-page" style={{ backgroundImage: `url(${backgroundimage})` }}>
      <NavBar />
      <div className="page-content">
        <Sidebar />
        <div className="issue-form-container">
          <h1>Create New Issue</h1>
          
          {/* Auth token error message */}
          {!accessToken && (
            <div className="error-banner">
              <p>Authentication token not found. Please sign in again.</p>
              <button className="dismiss-btn" onClick={() => navigate('/signin')}>Sign In</button>
            </div>
          )}
          
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
              <label>Issue Type</label>
              {/* Dropdown for issue types (renamed from issue categories) */}
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
              >
                {issueTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Student's Name</label>
              {/* Student name field showing current user's name from localStorage */}
              {errors.user ? (
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
            <div className="form-group">
              <label>Year of Study</label>
              <select
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value)}
              >
                {yearOfStudyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              >
                {semesterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                  value={selectedCourseUnitId}
                  onChange={(e) => setSelectedCourseUnitId(e.target.value)}
                >
                  {courseUnits.length === 0 ? (
                    <option value="">No course units available</option>
                  ) : (
                    courseUnits.map((unit, index) => {
                      const id = typeof unit === 'object' ? unit.id : unit;
                      const name = typeof unit === 'object' ? unit.name || unit.course_unit_name : unit;
                      return (
                        <option key={index} value={id}>
                          {name}
                        </option>
                      );
                    })
                  )}
                </select>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="status">Status</label>
              {/* Status field is readonly for student role */}
              <input type="text" value="Pending" readOnly disabled />
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