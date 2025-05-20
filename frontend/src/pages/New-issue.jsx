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
    registrationNumber: '',
    programId: '',
    programName: '',
    issueType: 'missing_marks',
    description: 'I have no marks for OS test yet I merged 86% in it.',
    courseUnitId: '',
    yearOfStudy: '1st_year',
    semester: 'one',
    attachment: null
  });
  const [registrars, setRegistrars] = useState([]);
  const [courseUnits, setCourseUnits] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [registrarDisplayNames, setRegistrarDisplayNames] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isLoading, setIsLoading] = useState({
    registrars: true,
    courseUnits: true,
    programs: true
  });
  const [errors, setErrors] = useState({
    registrars: null,
    courseUnits: null,
    programs: null,
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
        const userId = localStorage.getItem('userId');
        const userProgramId = localStorage.getItem('userProgram');
        const access = localStorage.getItem('accessToken');
        const refresh = localStorage.getItem('refreshToken');

        if (!username || !access) {
          throw new Error('Missing authentication data');
        }

        // Create registration number format
        const registrationNumber = userId ? `25/MAK/23-${userId}` : '';

        setCurrentUser(username);
        setAccessToken(access);
        if (refresh) setRefreshToken(refresh);
        setFormData(prev => ({ 
          ...prev, 
          student: username,
          registrationNumber: registrationNumber,
          programId: userProgramId || ''
        }));
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
      const response = await API.post('/api/refresh_token/', { refresh: refreshToken });
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

  // Fetch programs
  useEffect(() => {
    if (!accessToken) return;

    const fetchPrograms = async () => {
      try {
        setIsLoading(prev => ({ ...prev, programs: true }));
        setErrors(prev => ({ ...prev, programs: null }));

        const response = await makeAuthRequest(async (token) => {
          return API.get('/api/program/', {
            headers: { Authorization: `Bearer ${token}` }
          });
        });

        if (response?.data?.length > 0) {
          setPrograms(response.data);
          
          // Find the program name that matches the user's program ID
          const userProgramId = formData.programId;
          if (userProgramId) {
            const userProgram = response.data.find(p => 
              p.id?.toString() === userProgramId.toString() || 
              p.program_id?.toString() === userProgramId.toString()
            );
            
            if (userProgram) {
              const programName = userProgram.name || userProgram.program_name || 'Unknown Program';
              setFormData(prev => ({ ...prev, programName }));
            }
          }
        } else {
          setErrors(prev => ({ ...prev, programs: 'No programs found' }));
        }
      } catch (err) {
        console.error('Fetch programs error:', err);
        setErrors(prev => ({ ...prev, programs: 'Failed to load programs' }));
      } finally {
        setIsLoading(prev => ({ ...prev, programs: false }));
      }
    };

    fetchPrograms();
  }, [accessToken, refreshToken, formData.programId]);

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
      submissionData.append('registration_number', formData.registrationNumber);
      submissionData.append('program', formData.programId); // Send program ID for backend
      submissionData.append('issue_type', formData.issueType);
      submissionData.append('description', formData.description);
      submissionData.append('course_unit', formData.courseUnitId);
      submissionData.append('year_of_study', formData.yearOfStudy);
      submissionData.append('semester', formData.semester);
      
      if (formData.attachment) {
        submissionData.append('image', formData.attachment);
      }

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
      
      // Simple error handling
      if (err.response?.data) {
        let errorMessage = 'Failed to submit issue';
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.detail) {
          errorMessage = err.response.data.detail;
        } else {
          // Try to extract field-specific errors
          const fieldErrors = Object.entries(err.response.data)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join('; ');
          if (fieldErrors) {
            errorMessage = `Validation errors: ${fieldErrors}`;
          }
        }
        setErrors(prev => ({ ...prev, general: errorMessage }));
      } else {
        setErrors(prev => ({
          ...prev,
          general: 'Network error or server unavailable'
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form is ready
  const isFormReady = registrars.length > 0 && courseUnits.length > 0 && 
                     !isLoading.registrars && !isLoading.courseUnits && 
                     accessToken && formData.courseUnitId;

  return (
    <div className="academic-issue-page">
      <NavBar />
      <div className="academic-content-wrapper">
        <Sidebar />
        <div className="academic-form-card">
          <h1>Create New Issue</h1>
          
          {/* Error messages */}
          {!accessToken && (
            <div className="academic-error-banner">
              <p>Please sign in to continue</p>
              <button onClick={() => navigate('/signin')}>Sign In</button>
            </div>
          )}
          
          {errors.general && (
            <div className="academic-error-banner">
              <p>{errors.general}</p>
              <button onClick={() => setErrors(prev => ({ ...prev, general: null }))}>×</button>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Student Information Section */}
            <div className="academic-form-section">
              <h2>Student Information</h2>
              
              <div className="academic-flex-row">
                <div className="academic-field-wrapper">
                  <label>Student's Name</label>
                  <input 
                    type="text" 
                    value={currentUser} 
                    readOnly 
                    disabled
                  />
                </div>
                
                <div className="academic-field-wrapper">
                  <label>Registration Number</label>
                  <input 
                    type="text" 
                    value={formData.registrationNumber} 
                    readOnly 
                    disabled
                  />
                </div>
              </div>

              <div className="academic-flex-row">
                <div className="academic-field-wrapper">
                  <label>Program</label>
                  {isLoading.programs ? (
                    <div className="academic-loading-field">
                      <input
                        type="text"
                        value="Loading..."
                        readOnly
                        disabled
                      />
                    </div>
                  ) : errors.programs ? (
                    <div className="academic-error-field">
                      <input
                        type="text"
                        value="Error loading program"
                        readOnly
                        disabled
                      />
                      <button type="button" onClick={() => window.location.reload()}>Retry</button>
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={formData.programName || "Program not found"}
                      readOnly
                      disabled
                    />
                  )}
                </div>
                
                <div className="academic-field-wrapper">
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
              </div>
            </div>

            {/* Issue Details Section */}
            <div className="academic-form-section">
              <h2>Issue Details</h2>
              
              <div className="academic-flex-row">
                <div className="academic-field-wrapper">
                  <label>Registrar's Name</label>
                  {isLoading.registrars ? (
                    <div className="academic-loading-field">
                      <select disabled>
                        <option>Loading...</option>
                      </select>
                    </div>
                  ) : errors.registrars ? (
                    <div className="academic-error-field">
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
                
                <div className="academic-field-wrapper">
                  <label>Course Unit</label>
                  {isLoading.courseUnits ? (
                    <div className="academic-loading-field">
                      <select disabled>
                        <option>Loading...</option>
                      </select>
                    </div>
                  ) : errors.courseUnits ? (
                    <div className="academic-error-field">
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

              <div className="academic-flex-row">
                <div className="academic-field-wrapper">
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
                
                <div className="academic-field-wrapper">
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

              <div className="academic-flex-row">
                <div className="academic-field-wrapper">
                  <label>Status</label>
                  <input type="text" value="Pending" readOnly disabled />
                </div>
                
                <div className="academic-field-wrapper">
                  <label>Attachments</label>
                  <div className="academic-file-upload-area">
                    {formData.attachment ? (
                      <div className="academic-file-preview">
                        <img 
                          src={URL.createObjectURL(formData.attachment)} 
                          alt="Attachment preview" 
                        />
                        <button 
                          type="button" 
                          className="academic-remove-button" 
                          onClick={removeAttachment}
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="academic-file-placeholder">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="academic-flex-row">
                <div className="academic-field-wrapper full-width">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    placeholder="Describe your issue in detail..."
                    rows="5"
                  />
                </div>
              </div>
            </div>

            <div className="academic-flex-row academic-submit-row">
              <button
                type="submit"
                className="academic-submit-button"
                disabled={isSubmitting || !isFormReady}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Issue'}
              </button>

              {submitStatus === 'success' && (
                <div className="academic-status-message academic-status-success">
                  Issue submitted successfully!
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="academic-status-message academic-status-error">
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