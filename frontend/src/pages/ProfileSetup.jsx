import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import libraryImage from '../assets/student.png'; // Import the library image (you'll need to add this)
import name from '../assets/name.png'; // Import the name image
import './ProfileSetup.css';

const ProfileSetup = () => {
  const [formData, setFormData] = useState({
    registrationNumber: '',
    studentNumber: '',
    yearOfStudy: '',
    course: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);
  };

  const handleBack = () => {
    // Handle back button click
    console.log('Back button clicked');
  };
  const navigate = useNavigate();
  const handleprofilepicture = () => {
    navigate('/profilepicture');
  };
  const Back = () => {
    navigate(-1);
  };

  return (
    <div className="profile-setup-container">
      <div className="split-layout">
        {/* Left section with library image */}
        <div className="left-section">
          <img src={libraryImage} alt="Library" className="library-image" />
        </div>
        
        {/* Right section with form */}
        <div className="right-section">
          <div className="system-banner">
            <h1 className="system-title">Academic Issue Tracking System</h1>
          </div>
          
          <div className="form-container">
            <h2 className="setup-title">Profile Setup</h2>
            <p className="setup-subtitle">Let's start by personalizing your profile</p>
            
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="registrationNumber" className="label">Enter your Registration Number</label>
                <div className="input-container">
                  <input
                    type="text"
                    id="registrationNumber"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    placeholder="Enter your Registration Number"
                    className="input"
                    required
                  />
                  <img src={name} alt="Registration Number Icon" className="icon" />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="studentNumber" className="label red-text">Student Number</label>
                <div className="input-container">
                  <input
                    type="text"
                    id="studentNumber"
                    name="studentNumber"
                    value={formData.studentNumber}
                    onChange={handleChange}
                    placeholder="Enter your Student Number"
                    className="input"
                    required
                  />
                  <img src={name} alt="Student Number Icon" className="icon" />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="yearOfStudy" className="label red-text">Year of Study</label>
                <select
                  id="yearOfStudy"
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleChange}
                  className="input select-input"
                  required
                >
                  <option value="">Select your Year of Study</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="course" className="label">Course</label>
                <select
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="input select-input"
                  required
                >
                  <option value="">Select your Course</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                </select>
              </div>

              <div className="navigation-container">
                <div className="button-group">
                  <button type="button" className="button back-button" onClick={Back}>Back</button>
                  <button type="submit" className="button next-button" onClick={handleprofilepicture}>Next</button>
                </div>
                <div className="page-indicator">1 of 2</div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;