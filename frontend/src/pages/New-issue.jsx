import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import Sidebar from './Sidebar1';
import './New-issue.css';
import API from '../api';

const NewIssue = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    registrar: '',
    student: '',
    issueType: 'missing_marks',
    description: 'I have no marks for OS test yet I merged 86% in it.',
    courseUnitId: '',
    yearOfStudy: '1st_year',
    semester: 'one',
    attachment: null
  });
  const [registrars, setRegistrars] = useState([]);
  const [courseUnits, setCourseUnits] = useState([]);
  const [registrarDisplayNames, setRegistrarDisplayNames] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isLoading, setIsLoading] = useState({
    registrars: true,
    courseUnits: true,
  });
  const [errors, setErrors] = useState({
    registrars: null,
    courseUnits: null,
    general: null
  });
  const [currentUser, setCurrentUser] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');

  // Define constants
  const issueTypes = [
    { value: 'missing_marks', label: 'Missing Marks' },
    { value: 'appeal', label: 'Appeal' },
    { value: 'correction', label: 'Correction' }
  ];

  const yearOfStudyOptions = [
    { value: '1st_year', label: '1st Year' },
    { value: '2nd_year', label: '2nd Year' },
    { value: '3rd_year', label: '3rd Year' },
    { value: '4th_year', label: '4th Year' },
    { value: '5th_year', label: '5th Year' }
  ];

  const semesterOptions = [
    { value: 'one', label: 'One' },
    { value: 'two', label: 'Two' }
  ];

  // Initialize user data
  useEffect(() => {
    const initializeUser = () => {
      try {
        const username = localStorage.getItem('userName');
        const access = localStorage.getItem('accessToken');
        const refresh = localStorage.getItem('refreshToken');

        if (!username || !access) {
          throw new Error('Missing authentication data');
        }

        setCurrentUser(username);
        setAccessToken(access);
        if (refresh) setRefreshToken(refresh);
        setFormData(prev => ({ ...prev, student: username }));
      } catch (err) {
        console.error('Initialization error:', err);
        setErrors(prev => ({ ...prev, user: 'Please sign in again' }));
        navigate('/signin');
      }
    };

    initializeUser();
  }, [navigate]);

  // Token refresh function
  const refreshAccessToken = async () => {
    if (!refreshToken) {
      navigate('/signin');
      return null;
    }

    try {
      const response = await API.post('/api/token/refresh/', { refresh: refreshToken });
      const newToken = response.data.access;
      localStorage.setItem('accessToken', newToken);
      setAccessToken(newToken);
      return newToken;
    } catch (err) {
      console.error('Token refresh failed:', err);
      navigate('/signin');
      return null;
    }
  };

  // Auth request wrapper
  const makeAuthRequest = async (requestFn) => {
    try {
      return await requestFn(accessToken);
    } catch (err) {
      if (err.response?.status === 401 && refreshToken) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          return await requestFn(newToken);
        }
      }
      throw err;
    }
  };

  // Fetch registrars
  useEffect(() => {
    if (!accessToken) return;

    const fetchRegistrars = async () => {
      try {
        setIsLoading(prev => ({ ...prev, registrars: true }));
        setErrors(prev => ({ ...prev, registrars: null }));

        const response = await makeAuthRequest(async (token) => {
          return API.get('/api/get_registrars/', {
            headers: { Authorization: `Bearer ${token}` }
          });
        });

        if (response?.data?.length > 0) {
          setRegistrars(response.data);
          
          // Create display name mapping
          const displayNames = {};
          response.data.forEach(reg => {
            const username = reg.username || reg;
            const name = reg.name || username;
            displayNames[username] = name;
          });
          setRegistrarDisplayNames(displayNames);
          
          // Set first registrar as default
          const firstReg = response.data[0];
          const firstRegUsername = firstReg.username || firstReg;
          setFormData(prev => ({ ...prev, registrar: firstRegUsername }));
        } else {
          setErrors(prev => ({ ...prev, registrars: 'No registrars found' }));
        }
      } catch (err) {
        console.error('Fetch registrars error:', err);
        setErrors(prev => ({ ...prev, registrars: 'Failed to load registrars' }));
      } finally {
        setIsLoading(prev => ({ ...prev, registrars: false }));
      }
    };

    fetchRegistrars();
  }, [accessToken, refreshToken]);

  // Fetch course units
  useEffect(() => {
    if (!accessToken) return;

    const fetchCourseUnits = async () => {
      try {
        setIsLoading(prev => ({ ...prev, courseUnits: true }));
        setErrors(prev => ({ ...prev, courseUnits: null }));

        const response = await makeAuthRequest(async (token) => {
          return API.get('/api/course_unit/', {
            headers: { Authorization: `Bearer ${token}` }
          });
        });

        if (response?.data?.length > 0) {
          setCourseUnits(response.data);
          
          // Set first course unit as default
          const firstUnit = response.data[0];
          const firstUnitId = firstUnit.id || firstUnit;
          setFormData(prev => ({ ...prev, courseUnitId: firstUnitId }));
        } else {
          setErrors(prev => ({ ...prev, courseUnits: 'No course units found' }));
        }
      } catch (err) {
        console.error('Fetch course units error:', err);
        setErrors(prev => ({ ...prev, courseUnits: 'Failed to load course units' }));
      } finally {
        setIsLoading(prev => ({ ...prev, courseUnits: false }));
      }
    };

    fetchCourseUnits();
  }, [accessToken, refreshToken]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, attachment: e.target.files[0] }));
  };

  const removeAttachment = () => {
    setFormData(prev => ({ ...prev, attachment: null }));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.registrar) {
      setErrors(prev => ({ ...prev, general: 'Please select a registrar' }));
      return;
    }
    
    if (!formData.courseUnitId) {
      setErrors(prev => ({ ...prev, general: 'Please select a course unit' }));
      return;
    }
    
    if (!formData.description.trim()) {
      setErrors(prev => ({ ...prev, general: 'Please provide a description' }));
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitStatus(null);
      setErrors(prev => ({ ...prev, general: null }));

      // Prepare form data
      const submissionData = new FormData();
      submissionData.append('registrar', formData.registrar);
      submissionData.append('student', formData.student);
      submissionData.append('lecturer', '');
      submissionData.append('issue_type', formData.issueType);
      submissionData.append('description', formData.description);
      submissionData.append('course_unit_id', formData.courseUnitId);
      submissionData.append('status', 'pending');
      submissionData.append('year_of_study', formData.yearOfStudy);
      submissionData.append('semester', formData.semester);
      
      if (formData.attachment) {
        submissionData.append('image', formData.attachment);
      }

      // Debug log
      console.log('Submitting with course_unit_id:', formData.courseUnitId);

      // Make request
      const response = await makeAuthRequest(async (token) => {
        return API.post('/api/issues/', submissionData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });
      });

      // Handle success
      setSubmitStatus('success');
      
      // Find course unit name for success page
      const selectedUnit = courseUnits.find(unit => {
        const unitId = unit.id || unit;
        return unitId === formData.courseUnitId;
      });
      
      const courseUnitName = selectedUnit?.name || selectedUnit?.course_unit_name || 'Selected Course';
      const registrarName = registrarDisplayNames[formData.registrar] || formData.registrar;
      const issueTypeLabel = issueTypes.find(t => t.value === formData.issueType)?.label || formData.issueType;

      // Navigate to success page
      setTimeout(() => {
        navigate('/notification-success', {
          state: {
            registrarName,
            issueType: issueTypeLabel,
            courseUnitName
          }
        });
      }, 1500);
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitStatus('error');
      setErrors(prev => ({
        ...prev,
        general: err.response?.data?.message || 'Failed to submit issue'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form is ready
  const isFormReady = registrars.length > 0 && courseUnits.length > 0 && 
                     !isLoading.registrars && !isLoading.courseUnits && 
                     accessToken && formData.courseUnitId;

  return (
    <div className="create-issue-page">
      <NavBar />
      <div className="page-content">
        <Sidebar />
        <div className="issue-form-container">
          <h1>Create New Issue</h1>
          
          {/* Error messages */}
          {!accessToken && (
            <div className="error-banner">
              <p>Please sign in to continue</p>
              <button onClick={() => navigate('/signin')}>Sign In</button>
            </div>
          )}
          
          {errors.general && (
            <div className="error-banner">
              <p>{errors.general}</p>
              <button onClick={() => setErrors(prev => ({ ...prev, general: null }))}>×</button>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Registrar's Name</label>
                {isLoading.registrars ? (
                  <div className="loading-field">
                    <select disabled>
                      <option>Loading...</option>
                    </select>
                  </div>
                ) : errors.registrars ? (
                  <div className="error-field">
                    <select disabled>
                      <option>Error loading registrars</option>
                    </select>
                    <button type="button" onClick={() => window.location.reload()}>Retry</button>
                  </div>
                ) : (
                  <select
                    name="registrar"
                    value={formData.registrar}
                    onChange={handleChange}
                    required
                  >
                    {registrars.map((reg, index) => {
                      const username = reg.username || reg;
                      const displayName = registrarDisplayNames[username] || username;
                      return (
                        <option key={index} value={username}>
                          {displayName}
                        </option>
                      );
                    })}
                  </select>
                )}
              </div>
              
              <div className="form-group">
                <label>Student's Name</label>
                <input 
                  type="text" 
                  value={currentUser} 
                  readOnly 
                  disabled
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Issue Type</label>
                <select
                  name="issueType"
                  value={formData.issueType}
                  onChange={handleChange}
                >
                  {issueTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Status</label>
                <input type="text" value="Pending" readOnly disabled />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Year of Study</label>
                <select
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleChange}
                >
                  {yearOfStudyOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Semester</label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                >
                  {semesterOptions.map(option => (
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
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Attachments</label>
                <div className="attachment-area">
                  {formData.attachment ? (
                    <div className="attachment-preview">
                      <img 
                        src={URL.createObjectURL(formData.attachment)} 
                        alt="Attachment preview" 
                      />
                      <button 
                        type="button" 
                        className="clear-icon" 
                        onClick={removeAttachment}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="attachment-placeholder">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
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
                      <option>Loading...</option>
                    </select>
                  </div>
                ) : errors.courseUnits ? (
                  <div className="error-field">
                    <select disabled>
                      <option>Error loading course units</option>
                    </select>
                    <button type="button" onClick={() => window.location.reload()}>Retry</button>
                  </div>
                ) : (
                  <select
                    name="courseUnitId"
                    value={formData.courseUnitId}
                    onChange={handleChange}
                    required
                  >
                    {courseUnits.map((unit, index) => {
                      const id = unit.id || unit;
                      const name = unit.name || unit.course_unit_name || unit;
                      return (
                        <option key={index} value={id}>
                          {name}
                        </option>
                      );
                    })}
                  </select>
                )}
              </div>
            </div>

            <div className="form-row submit-row">
              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting || !isFormReady}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Issue'}
              </button>

              {submitStatus === 'success' && (
                <div className="submit-status success">
                  Issue submitted successfully!
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="submit-status error">
                  Submission failed. Please try again.
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewIssue;