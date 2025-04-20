import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import Sidebar from './Sidebar1';
import './New-issue.css';
import API from '../api';

const NewIssue = () => {
  const navigate = useNavigate();
  const [registrars, setRegistrars] = useState([]);
  const [courseUnits, setCourseUnits] = useState([]);
  const [registrarUsername, setRegistrarUsername] = useState('');
  const [registrarDisplayNames, setRegistrarDisplayNames] = useState({});
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
  const [selectedCourseUnitId, setSelectedCourseUnitId] = useState('');
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

  // Function to refresh the access token using refresh token
  const refreshAccessToken = async () => {
    try {
      const response = await API.post('/api/token/refresh/', {
        refresh: refreshToken
      });
      
      if (response && response.data && response.data.access) {
        localStorage.setItem('accessToken', response.data.access);
        setAccessToken(response.data.access);
        return response.data.access;
      }
      return null;
    } catch (err) {
      console.error('Error refreshing access token:', err);
      setErrors(prev => ({ ...prev, general: 'Session expired. Please sign in again.' }));
      setTimeout(() => navigate('/signin'), 1500);
      return null;
    }
  };

  // Helper function to handle API requests with token refresh capability
  const makeAuthRequest = async (requestFn) => {
    try {
      return await requestFn();
    } catch (err) {
      if (err.response && err.response.status === 401 && refreshToken) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          return await requestFn(newToken);
        }
      }
      throw err;
    }
  };

  // Fetch registrars when component mounts
  useEffect(() => {
    const fetchRegistrars = async () => {
      if (!accessToken) return;
      
      try {
        setIsLoading(prev => ({ ...prev, registrars: true }));
        setErrors(prev => ({ ...prev, registrars: null }));
        
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
          
          // Create a mapping of username to display name
          const displayNameMap = {};
          response.data.forEach(registrar => {
            if (typeof registrar === 'object') {
              const username = registrar.username || '';
              displayNameMap[username] = registrar.name || username;
            } else {
              displayNameMap[registrar] = registrar;
            }
          });
          setRegistrarDisplayNames(displayNameMap);
          
          // Store the username of the first registrar
          const firstRegistrar = response.data[0];
          const firstRegistrarUsername = typeof firstRegistrar === 'object' ? 
            (firstRegistrar.username || '') : 
            firstRegistrar;
          setRegistrarUsername(firstRegistrarUsername);
        } else {
          setRegistrars([]);
          setErrors(prev => ({ ...prev, registrars: 'No registrars found. Please try again later.' }));
        }
      } catch (err) {
        console.error('Error fetching registrars:', err);
        setRegistrars([]);
        setErrors(prev => ({ 
          ...prev, 
          registrars: 'Failed to load registrars. Please try again later.'
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
      if (!accessToken) return;
      
      try {
        setIsLoading(prev => ({ ...prev, courseUnits: true }));
        setErrors(prev => ({ ...prev, courseUnits: null }));
        
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
          courseUnits: 'Failed to load course units. Please try again later.'
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
    if (!registrarUsername) {
      setErrors(prev => ({ ...prev, general: 'Please select a registrar.' }));
      return;
    }
    
    if (!selectedCourseUnitId) {
      setErrors(prev => ({ ...prev, general: 'Please select a course unit.' }));
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
      
      // Get the student username and registrar username
      const studentUsername = currentUser;
      
      // For debugging
      console.log('Using registrar username:', registrarUsername);
      console.log('Using student username:', studentUsername);
      console.log('Using course unit ID:', selectedCourseUnitId);
      
      // Append data to FormData
      formData.append('registrar', registrarUsername);
      formData.append('student', studentUsername);
      formData.append('lecturer', ''); // Empty string will be treated as null by backend
      
      // Rest of form data
      formData.append('issue_type', issueType);
      formData.append('description', description);
      
      // Use course_unit to pass the ID (what the backend expects)
      formData.append('course_unit', selectedCourseUnitId);
      
      formData.append('status', 'pending');
      formData.append('year_of_study', yearOfStudy);
      formData.append('semester', semester);
      
      if (attachment) {
        formData.append('image', attachment);
      }

      // For debugging - log what we're sending to the API
      console.log('Submitting form data:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value instanceof File ? 'File: ' + value.name : value}`);
      }

      // Send POST request with auth header
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
      
      // Use display name for success page, falling back to username if no display name exists
      const registrarDisplayName = registrarDisplayNames[registrarUsername] || registrarUsername;
        
      // Navigate to NotificationSuccess page after brief delay
      setTimeout(() => {
        navigate('/notification-success', {
          state: {
            registrarName: registrarDisplayName,
            issueType: issueTypes.find(t => t.value === issueType)?.label || issueType,
            courseUnitName,
          },
        });
      }, 1500);
    } catch (err) {
      console.error('Error submitting issue:', err);
      setSubmitStatus('error');
      
      // Simplified error handling
      setErrors(prev => ({ ...prev, general: 'Failed to submit issue. Please try again later.' }));
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
      setErrors(prev => ({ ...prev, registrars: null }));
      setIsLoading(prev => ({ ...prev, registrars: true }));
      setRegistrars([]);
    } else if (type === 'courseUnits') {
      setErrors(prev => ({ ...prev, courseUnits: null }));
      setIsLoading(prev => ({ ...prev, courseUnits: true }));
      setCourseUnits([]);
    }
  };

  return (
    <div className="create-issue-page">
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
                  <button className="retry-btn" onClick={() => retryLoading('registrars')}>Retry</button>
                </div>
              ) : (
                <select
                  value={registrarUsername}
                  onChange={(e) => setRegistrarUsername(e.target.value)}
                >
                  {registrars.length === 0 ? (
                    <option value="">No registrars available</option>
                  ) : (
                    registrars.map((registrar, index) => {
                      // Get the username as the value
                      const username = typeof registrar === 'object' ? 
                        (registrar.username || '') : 
                        registrar;
                      
                      // Get a display name (could be the full name or just the username)
                      const displayName = typeof registrar === 'object' ? 
                        (registrar.name || registrar.username || '') : 
                        registrar;
                      
                      return (
                        <option key={index} value={username}>
                          {displayName}
                        </option>
                      );
                    })
                  )}
                </select>
              )}
            </div>
            <div className="form-group">
              <label>Student's Name</label>
              {errors.user ? (
                <div className="error-field">
                  <input 
                    type="text" 
                    disabled
                    placeholder="Error loading user"
                    value={currentUser}
                  />
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
              <label>Issue Type</label>
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
              <label>Status</label>
              {/* Status field is readonly for student role */}
              <input type="text" value="Pending" readOnly disabled />
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
              <label>Course Unit</label>
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
                      // Get the unit ID for the value attribute
                      const id = typeof unit === 'object' ? unit.id : unit;
                      
                      // Get the unit name for display in the dropdown
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
                Issue successfully submitted!
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="submit-status error">
                Failed to submit issue.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewIssue;