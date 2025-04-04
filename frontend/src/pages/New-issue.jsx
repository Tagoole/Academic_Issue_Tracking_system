import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import Sidebar from './Sidebar1';
import './New-issue.css';
import backgroundimage from "../assets/backgroundimage.jpg";
import axios from 'axios'; // Import axios for API calls

const NewIssue = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    student: '',
    issue_type: 'Missing marks',
    course_unit: 'CSS 11001 - Operating Systems',
    description: '',
    status: 'Pending',
    registrar: '',
    year_of_study: '3',
    semester: '2',
    lecturer_name: '',
    issue_title: 'Wrong Marks'
  });
  const [attachment, setAttachment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [registrars, setRegistrars] = useState([{ name: 'a1', id: 27 }]);
  const [currentUser, setCurrentUser] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);

  const API_URL = 'http://127.0.0.1:8000/api/'; // Django API base URL

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [registrarsRes, userRes] = await Promise.all([
          axios.get(`${API_URL}/get_academic_registrars/`),
          axios.get(`${API_URL}/current_user/`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          })
        ]);

        const registrarList = Array.isArray(registrarsRes.data) ? registrarsRes.data : [];
        if (!registrarList.some(reg => reg.id === 27)) {
          registrarList.push({ name: 'a1', id: 27 });
        }
        setRegistrars(registrarList);
        setFormData(prev => ({ ...prev, registrar: registrarList[0]?.name || 'a1' }));

        const user = userRes.data;
        if (user) {
          setCurrentUser(user);
          setFormData(prev => ({ ...prev, student: user.full_name || user.username || '' }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage("Failed to load data. Please refresh the page.");
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setAttachment(file); // Store the file object itself, not a URL
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
  };

  const handleSubmit = () => {
    setErrorMessage('');
    if (!formData.student || !formData.description || !formData.course_unit || !formData.registrar) {
      setErrorMessage('All fields are required.');
      return;
    }

    setIsSubmitting(true);

    // Create FormData object to handle file upload and text fields
    const formDataObject = new FormData();
    formDataObject.append('registrar_name', formData.registrar);
    formDataObject.append('issue_category', formData.issue_type);
    formDataObject.append('issue_description', formData.description);
    formDataObject.append('issue_title', formData.issue_title);
    
    // Parse the course unit code and name
    const courseUnitParts = formData.course_unit.split(' - ');
    formDataObject.append('course_unit_code', courseUnitParts[0]);
    formDataObject.append('course_unit_name', courseUnitParts[1] || '');
    
    formDataObject.append('lecturer_name', formData.lecturer_name || '');
    formDataObject.append('student_name', formData.student);
    formDataObject.append('status', 'Submitted');
    
    if (attachment) {
      formDataObject.append('attachment', attachment);
    }

    // Send POST request to Django API
    axios
      .post(`${API_URL}issues/`, formDataObject, {
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
              registrarName: formData.registrar,
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
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          
          <div className="form-row">
            <div className="form-group">
              <label>Registrar's Name</label>
              <input
                type="text"
                name="registrar"
                value={formData.registrar}
                onChange={handleChange}
              />
              <span className="clear-icon" onClick={() => setFormData({...formData, registrar: ''})}>×</span>
            </div>
            <div className="form-group">
              <label>Lecturer's Name</label>
              <input 
                type="text" 
                name="lecturer_name"
                value={formData.lecturer_name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Issue Category</label>
              <input
                type="text"
                name="issue_type"
                value={formData.issue_type}
                onChange={handleChange}
              />
              <span className="clear-icon" onClick={() => setFormData({...formData, issue_type: ''})}>×</span>
            </div>
            <div className="form-group">
              <label>Student's Name</label>
              <input 
                type="text" 
                name="student"
                value={formData.student}
                onChange={handleChange}
                placeholder="Enter your full name" 
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Issue Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
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
              <input 
                type="text" 
                name="issue_title"
                value={formData.issue_title} 
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="status">Status</label>
              <input type="text" value={formData.status} disabled />
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
                Issue successfully sent to {formData.registrar}!
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