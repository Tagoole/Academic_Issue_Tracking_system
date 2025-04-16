import React, { useState } from 'react';
import './lecturerprofile.css';
import Navbar from './NavBar'; // Import Navbar
import Sidebar2 from './Sidebar2'; // Import Sidebar
import pencilIcon from '../assets/pencil.png'; // Adjust the path based on your folder structure

const LecturerProfile = ({ userData = {} }) => {
  // Default placeholder data
  const defaultData = {
    fullName: 'John Doe',
    role: 'Assistant Professor',
    phoneNumber: '+123 456 7890',
    email: 'john.doe@university.edu',
    gender: 'Male',
    college: 'College of Engineering',
    department: 'Computer Science',
    office: 'Room 203, Building B'
  };

  // Combine provided userData with default data
  const data = { ...defaultData, ...userData };

  // State for tracking edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(data);

  // Handle saving edited data
  const handleSave = () => {
    setIsEditing(false);
    console.log('Saved profile data:', profileData);
    // Here you would typically send the data to an API
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Profile information fields configuration
  const personalInfoFields = [
    { label: 'Full Name', key: 'fullName' },
    { label: 'Phone Number', key: 'phoneNumber' },
    { label: 'Email Address', key: 'email' },
    { label: 'Gender', key: 'gender' },
    { label: 'College', key: 'college' },
    { label: 'Department', key: 'department' },
    { label: 'Office', key: 'office' }
  ];

  return (
    <div className="academic-profile-container">
      {/* Include Navbar */}
      <Navbar />

      <div className="profile-layout">
        {/* Include Sidebar */}
        <Sidebar2 />

        <div className="profile-card">
          {/* Header Section */}
          <div className="profile-header">
            <h2>Profile</h2>
          </div>

          {/* Profile Top Section */}
          <div className="profile-top">
            <div className="profile-image-container">
              {/* Placeholder profile image */}
              <div className="profile-image"></div>
            </div>

            <div className="profile-title">
              <h3>{profileData.fullName}</h3>
              <p>{profileData.role}</p>
            </div>

            <div className="profile-actions">
              {isEditing ? (
                <button className="edit-button" onClick={handleSave}>
                  <span>Save</span>
                </button>
              ) : (
                <button className="edit-button" onClick={() => setIsEditing(true)}>
                  <img src={pencilIcon} alt="Edit" className="edit-icon" />
                  <span>Edit</span>
                </button>
              )}
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="info-section">
            <div className="section-header">
              <h3>Personal Information</h3>
            </div>

            <div className="info-grid">
              {personalInfoFields.map((field) => (
                <div className="info-row" key={field.key}>
                  <div className="info-label">{field.label}:</div>
                  <div className="info-value">
                    {isEditing ? (
                      <input
                        type="text"
                        name={field.key}
                        value={profileData[field.key]}
                        onChange={handleChange}
                        className="info-input"
                      />
                    ) : (
                      profileData[field.key]
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerProfile;