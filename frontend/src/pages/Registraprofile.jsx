import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import name from '../assets/name.png'; 
import './Registraprofile.css';
import NavBar from './NavBar';
import Sidebar from './Sidebar';
import backgroundimage from "../assets/backgroundimage.jpg";

const PersonalProfile = () => {
  const [formData, setFormData] = useState({
    emailaddress: '',
    phonenumber: '',
    college: '',
    department: '',
    office: ''
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
    // Handle form submission, e.g., send data to an API
    console.log(formData);
  };

  const navigate = useNavigate();
  const handleprofilepicture = () => {
    navigate('/profilepicture');
  };
  const Back = () => {
    navigate(-1);
  };

  return (
    <div className="app-container" style={{ backgroundImage: `url(${backgroundimage})` }}>
      <NavBar />
      <div className="main-content">
        <Sidebar />
        <div className="profile-setup-container">
          <div className="right-section">
            <div className="form-container">
              <h2 className="setup-title">Personal Profile</h2>
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="emailaddress" className="label">Email address</label>
                  <div className="input-container">
                    <input
                      type="text"
                      id="emailaddress"
                      name="emailaddress"
                      value={formData.emailaddress}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className="input"
                      required
                    />
                    <img src={name} alt="Email Icon" className="icon" />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="phonenumber" className="label">Phone number</label>
                  <div className="input-container">
                    <input
                      type="text"
                      id="phonenumber"
                      name="phonenumber"
                      value={formData.phonenumber}
                      onChange={handleChange}
                      placeholder="Enter your Phone Number"
                      className="input"
                      required
                    />
                    <img src={name} alt="Phone Number Icon" className="icon" />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="college" className="label red-text">College</label>
                  <select
                    id="college"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    className="input"
                    required
                  >
                    <option value="">Select your college</option>
                    <option value="college 1">College of Science</option>
                    <option value="college 2">College of Engineering</option>
                    <option value="college 3">College of Arts</option>
                    <option value="college 4">College of Business</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="department" className="label red-text">Department</label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="input select-input"
                    required
                  >
                    <option value="">Select your department</option>
                    <option value="1">Department 1</option>
                    <option value="2">Department 2</option>
                    <option value="3">Department 3</option>
                    <option value="4">Department 4</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="office" className="label">Office</label>
                  <select
                    id="office"
                    name="office"
                    value={formData.office}
                    onChange={handleChange}
                    className="input select-input"
                    required
                  >
                    <option value="">Select your office</option>
                    <option value="office 1">Computer Science</option>
                    <option value="office 2">Mathematics</option>
                    <option value="office 3">Physics</option>
                    <option value="office 4">Chemistry</option>
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
    </div>
  );
};

export default PersonalProfile;