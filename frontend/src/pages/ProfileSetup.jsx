import React, { useState } from 'react';
import name from '../assets/name.png'; 
import makererelogo from '../assets/makererelogo.png'; 
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

  return (
    <div className="profile-setup">
      <div className="title-container">
        <img src={makererelogo} alt="Makerere University Logo" className="logo" />
        <h1 className="title red-text">Academic Issue Tracking System</h1>
      </div>
      <h2>Profile Setup</h2>
      <p className="description">Let's start by personalizing your profile</p>
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
            className="input"
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
            className="input"
            required
          >
            <option value="">Select your Course</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
          </select>
        </div>
        <div className="button-group">
          <button type="button" className="button back-button">Back</button>
          <button type="submit" className="button next-button">Next</button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSetup;