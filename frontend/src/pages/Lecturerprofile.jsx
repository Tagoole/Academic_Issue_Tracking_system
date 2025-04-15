import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import name from '../assets/name.png';
import backgroundimage from "../assets/backgroundimage.jpg";
import Sidebar2 from './Sidebar2';
import NavBar from './NavBar';
import './Lecturerprofile.css';

const LecturerProfile = () => {
  const [formData, setFormData] = useState({
    emailaddress: '',
    phonenumber: '',
    college: '',
    department: '',
    office: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    navigate('/profilepicture');
  };

  return (
    <div className="app-container">
      <NavBar />
      <Sidebar2 />
      <div className="main-content">

        <div className="profile-container" style={{ backgroundImage: `url(${backgroundimage})` }}>
          <div className="profile-overlay">
            <h1 className="profile-heading">Personal profile</h1>

            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <div className="input-icon">
                  <img src={name} alt="Email Icon" />
                </div>
                <input
                  type="email"
                  name="emailaddress"
                  placeholder="Enter your email address"
                  value={formData.emailaddress}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <div className="input-icon">
                  <img src={name} alt="Phone Icon" />
                </div>
                <input
                  type="tel"
                  name="phonenumber"
                  placeholder="Enter your phone number"
                  value={formData.phonenumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <div className="input-icon">
                  <img src={name} alt="College Icon" />
                </div>
                <div className="select-wrapper">
                  <select
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select your college</option>
                    <option value="college 1">College of computer science</option>
                    <option value="college 2">College of Engineering</option>
                    <option value="college 3">College of Arts</option>
                    <option value="college 4">College of Business</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <div className="input-icon">
                  <img src={name} alt="Department Icon" />
                </div>
                <div className="select-wrapper">
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select your department</option>
                    <option value="1">Department 1</option>
                    <option value="2">Department 2</option>
                    <option value="3">Department 3</option>
                    <option value="4">Department 4</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <div className="input-icon">
                  <img src={name} alt="Office Icon" />
                </div>
                <div className="select-wrapper">
                  <select
                    name="office"
                    value={formData.office}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select your office</option>
                    <option value="office 1">Computer Science</option>
                    <option value="office 2">Mathematics</option>
                    <option value="office 3">Physics</option>
                    <option value="office 4">Chemistry</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="next-button">NEXT</button>
            </form>

            <div className="bottom-links">
              <a href="/help" className="help-link">Need Help?</a>
              <a href="/delete-account" className="delete-account-link">Delete Account</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerProfile;
