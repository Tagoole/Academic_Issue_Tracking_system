import React, { useState } from 'react';
import './Studentprofile.css';
import NavBar from './NavBar'; // Imported NavBar component

function ProfileScreen() {
  const [profileImage, setProfileImage] = useState('/api/placeholder/80/80'); // Default profile image
  const [isEditingPersonal, setIsEditingPersonal] = useState(false); // Toggle for personal info edit mode
  const [isEditingAcademic, setIsEditingAcademic] = useState(false); // Toggle for academic info edit mode

  const [personalInfo, setPersonalInfo] = useState({
    fullName: 'John Doe',
    phoneNumber: '123-456-7890',
    email: 'johndoe@example.com',
    gender: 'Male',
  });

  const [academicInfo, setAcademicInfo] = useState({
    registrationNumber: '2021-12345',
    course: 'Computer Science',
    studentNumber: 'CS-001',
    semester: 'Semester 1',
  });

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl); // Update the profile image
    }
  };

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleAcademicInfoChange = (e) => {
    const { name, value } = e.target;
    setAcademicInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="profile-page-container">
      {/* Updated NavBar with white glassmorphism */}
      <NavBar style={{ background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)' }} />

      <div className="content-container">
        {/* Left Sidebar with glassmorphism */}
        <div
          className="settings-sidebar"
          style={{
            background: 'rgba(0, 0, 0, 0.6)', // Semi-transparent black
            backdropFilter: 'blur(10px)', // Blur effect
            WebkitBackdropFilter: 'blur(10px)', // Safari support
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.2)', // Subtle border
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)', // Shadow for depth
          }}
        >
          <a href="/dashboard" className="menu-item">
            Dashboard
          </a>
          <a href="/issues" className="menu-item">
            Issues
          </a>
          <a href="/profile" className="menu-item active">
            Profile
          </a>
          <a href="/settings" className="menu-item">
            Settings
          </a>
          <a href="/help" className="menu-item">
            Help & Support
          </a>
          <a href="/logout" className="menu-item logout">
            Logout
          </a>
        </div>

        {/* Main Content with glassmorphism */}
        <div
          className="main-content"
          style={{
            background: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white
            backdropFilter: 'blur(12px)', // Blur effect
            WebkitBackdropFilter: 'blur(12px)', // Safari support
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.18)', // Subtle border
            boxShadow: '0 8px 32px 0 rgba(5, 5, 5, 0.37)', // Shadow for depth
          }}
        >
          {/* Profile Header */}
          <div className="profile-header-card">
            <div className="profile-header-left">
              <div
                className="profile-avatar"
                onClick={() => document.getElementById('profileImageInput').click()}
                style={{ cursor: 'pointer' }}
              >
                <img src={profileImage} alt="Profile" />
              </div>
              <input
                type="file"
                id="profileImageInput"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleProfileImageChange}
              />
              <div className="profile-info">
                <h2>{personalInfo.fullName}</h2>
                <p className="role">{"{Role}"}</p>
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="info-card">
            <div className="card-header">
              <h2>Personal Information</h2>
              <button className="edit-button" onClick={() => setIsEditingPersonal(!isEditingPersonal)}>
                {isEditingPersonal ? 'Save' : 'Edit'} <span className="edit-icon">✎</span>
              </button>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <label>Full Name</label>
                {isEditingPersonal ? (
                  <input
                    type="text"
                    name="fullName"
                    value={personalInfo.fullName}
                    onChange={handlePersonalInfoChange}
                  />
                ) : (
                  <div className="info-value">{personalInfo.fullName}</div>
                )}
              </div>
              <div className="info-item">
                <label>Phone Number</label>
                {isEditingPersonal ? (
                  <input
                    type="text"
                    name="phoneNumber"
                    value={personalInfo.phoneNumber}
                    onChange={handlePersonalInfoChange}
                  />
                ) : (
                  <div className="info-value">{personalInfo.phoneNumber}</div>
                )}
              </div>
              <div className="info-item">
                <label>Email Address</label>
                {isEditingPersonal ? (
                  <input
                    type="email"
                    name="email"
                    value={personalInfo.email}
                    onChange={handlePersonalInfoChange}
                  />
                ) : (
                  <div className="info-value">{personalInfo.email}</div>
                )}
              </div>
              <div className="info-item">
                <label>Gender</label>
                {isEditingPersonal ? (
                  <input
                    type="text"
                    name="gender"
                    value={personalInfo.gender}
                    onChange={handlePersonalInfoChange}
                  />
                ) : (
                  <div className="info-value">{personalInfo.gender}</div>
                )}
              </div>
            </div>
          </div>

          {/* Academic Information Section */}
          <div className="info-card">
            <div className="card-header">
              <h2>Academic Information</h2>
              <button className="edit-button" onClick={() => setIsEditingAcademic(!isEditingAcademic)}>
                {isEditingAcademic ? 'Save' : 'Edit'} <span className="edit-icon">✎</span>
              </button>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <label>Registration Number</label>
                {isEditingAcademic ? (
                  <input
                    type="text"
                    name="registrationNumber"
                    value={academicInfo.registrationNumber}
                    onChange={handleAcademicInfoChange}
                  />
                ) : (
                  <div className="info-value">{academicInfo.registrationNumber}</div>
                )}
              </div>
              <div className="info-item">
                <label>Course</label>
                {isEditingAcademic ? (
                  <input
                    type="text"
                    name="course"
                    value={academicInfo.course}
                    onChange={handleAcademicInfoChange}
                  />
                ) : (
                  <div className="info-value">{academicInfo.course}</div>
                )}
              </div>
              <div className="info-item">
                <label>Student Number</label>
                {isEditingAcademic ? (
                  <input
                    type="text"
                    name="studentNumber"
                    value={academicInfo.studentNumber}
                    onChange={handleAcademicInfoChange}
                  />
                ) : (
                  <div className="info-value">{academicInfo.studentNumber}</div>
                )}
              </div>
              <div className="info-item">
                <label>Semester</label>
                {isEditingAcademic ? (
                  <input
                    type="text"
                    name="semester"
                    value={academicInfo.semester}
                    onChange={handleAcademicInfoChange}
                  />
                ) : (
                  <div className="info-value">{academicInfo.semester}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileScreen;


