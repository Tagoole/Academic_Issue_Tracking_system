import React, { useState } from 'react';
import { FaUser, FaPhone, FaGraduationCap, FaBuilding, FaCity } from 'react-icons/fa';
import './PersonalProfile.css';

const PersonalProfile = () => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    college: '',
    department: '',
    office: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  return (
    <div className="page-container">
      <div className="form-overlay">
        <h1 className="form-title">Personal profile</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <div className="input-icon">
              <FaUser />
            </div>
            <input 
              type="email" 
              name="email" 
              placeholder="Enter your email address" 
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="input-group">
            <div className="input-icon">
              <FaPhone />
            </div>
            <input 
              type="tel" 
              name="phone" 
              placeholder="Enter your phone number" 
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="input-group">
            <div className="input-icon">
              <FaGraduationCap />
            </div>
            <select 
              name="college" 
              value={formData.college}
              onChange={handleChange}
              required
            >
              <option value="" disabled selected>Select your college</option>
              <option value="college1">College 1</option>
              <option value="college2">College 2</option>
              <option value="college3">College 3</option>
            </select>
            <div className="select-arrow">▼</div>
          </div>
          
          <div className="input-group">
            <div className="input-icon">
              <FaBuilding />
            </div>
            <select 
              name="department" 
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="" disabled selected>Select your department</option>
              <option value="dept1">Department 1</option>
              <option value="dept2">Department 2</option>
              <option value="dept3">Department 3</option>
            </select>
            <div className="select-arrow">▼</div>
          </div>
          
          <div className="input-group">
            <div className="input-icon">
              <FaCity />
            </div>
            <select 
              name="office" 
              value={formData.office}
              onChange={handleChange}
              required
            >
              <option value="" disabled selected>Select your office</option>
              <option value="office1">Office 1</option>
              <option value="office2">Office 2</option>
              <option value="office3">Office 3</option>
            </select>
            <div className="select-arrow">▼</div>
          </div>
          
          <button type="submit" className="next-button">NEXT</button>
        </form>
        
        <a href="#" className="help-link">Need Help?</a>
        <a href="#" className="delete-link">Delete Account</a>
      </div>
    </div>
  );
};

export default PersonalProfile;
