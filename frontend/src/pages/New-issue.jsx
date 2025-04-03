import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../api.js';
import Navbar from './NavBar';
import Sidebar from './Sidebar1';
import './New-Issue.css';
import backgroundimage from "../assets/backgroundimage.jpg";

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
    semester: '2'
  });
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [registrars, setRegistrars] = useState([{ name: 'a1', id: 27 }]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [registrarsRes, userRes] = await Promise.all([
          axios.get(`${API}/get_academic_registrars/`),
          axios.get(`${API}/current_user/`, {
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
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    setErrorMessage('');
    if (!formData.student || !formData.description || !formData.course_unit || !formData.registrar) {
      setErrorMessage('All fields are required.');
      return;
    }

    setIsSubmitting(true);
    const apiFormData = new FormData();
    Object.keys(formData).forEach(key => apiFormData.append(key, formData[key]));
    if (image) apiFormData.append('image', image);

    try {
      const response = await axios.post(`${API}/api/issues/`, apiFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log("Issue submitted successfully:", response.data);
      setIsSubmitting(false);
      navigate('/success', { state: { registrarName: formData.registrar, issueType: formData.issue_type, courseUnit: formData.course_unit } });
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error submitting issue:", error);
      setErrorMessage(error.response?.data?.detail || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="create-issue-page" style={{ backgroundImage: `url(${backgroundimage})` }}>
      <Navbar />
      <div className="page-content">
        <Sidebar />
        <div className="issue-form-container">
          <h1>Create New Issue</h1>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <div className="form-group">
            <label>Registrar's Name<span>*</span></label>
            <select name="registrar" value={formData.registrar} onChange={handleChange} required>
              {registrars.map((reg, index) => <option key={index} value={reg.name}>{reg.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Student's Name<span>*</span></label>
            <input type="text" name="student" value={formData.student} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Issue Type</label>
            <select name="issue_type" value={formData.issue_type} onChange={handleChange}>
              <option value="Missing marks">Missing marks</option>
              <option value="Wrong marks">Wrong marks</option>
              <option value="Registration issue">Registration issue</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Issue Description<span>*</span></label>
            <textarea name="description" value={formData.description} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Attachment</label>
            <input type="file" accept="image/*" onChange={handleFileUpload} />
          </div>
          <div className="form-group">
            <button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Issue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewIssue;
