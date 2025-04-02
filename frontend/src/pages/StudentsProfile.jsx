import React, { useState } from 'react';
import Navbar from './NavBar';
import Sidebar from './Sidebar';
import './StudentsProfile.css';

const StudentsProfile = ({ userData }) => {
  const [profile, setProfile] = useState({
    fullName: userData?.fullName || '[Full Name]',
    role: userData?.role || '[Role]',
    phoneNumber: userData?.phoneNumber || '[Phone Number]',
    email: userData?.email || '[Email Address]',
    gender: userData?.gender || '[Gender]',
    registrationNumber: userData?.registrationNumber || '[Registration]',
    studentNumber: userData?.studentNumber || '[Student Number]',
    course: userData?.course || '[Course]',
    semester: userData?.semester || '[Semester]',
  });

  const [editableField, setEditableField] = useState(null);

  const handleEditClick = (field) => {
    setEditableField(field);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setEditableField(null);
    console.log('Profile updated:', profile);
    // Add API call to save updated profile data
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="content-wrapper">
        <Sidebar />
        <main className="main-content">
          <div className="profile-container">
            {/* Header Section */}
            <div className="profile-card">
              <div className="profile-header">
                <img src="/avatar-placeholder.png" alt="Profile" className="profile-image" />
                <div className="profile-details">
                  <h2>{profile.fullName}</h2>
                  <p>{profile.role}</p>
                </div>
                <button className="edit-btn" onClick={() => handleEditClick('profile')}>
                  Edit ✏️
                </button>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="info-card">
              <h3>Personal Information</h3>
              {['fullName', 'phoneNumber', 'email', 'gender'].map((field) => (
                <div key={field} className="info-item">
                  <label>{field.replace(/([A-Z])/g, ' $1')}:</label>
                  {editableField === field ? (
                    <input
                      type="text"
                      name={field}
                      value={profile[field]}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <span>{profile[field]}</span>
                  )}
                  <button className="edit-btn" onClick={() => handleEditClick(field)}>
                    Edit ✏️
                  </button>
                </div>
              ))}
            </div>

            {/* Academic Information Section */}
            <div className="info-card">
              <h3>Academic Information</h3>
              {['registrationNumber', 'studentNumber', 'course', 'semester'].map((field) => (
                <div key={field} className="info-item">
                  <label>{field.replace(/([A-Z])/g, ' $1')}:</label>
                  {editableField === field && field !== 'registrationNumber' && field !== 'studentNumber' ? (
                    <input
                      type="text"
                      name={field}
                      value={profile[field]}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <span>{profile[field]}</span>
                  )}
                  {field !== 'registrationNumber' && field !== 'studentNumber' && (
                    <button className="edit-btn" onClick={() => handleEditClick(field)}>
                      Edit ✏️
                    </button>
                  )}
                </div>
              ))}
            </div>

            {editableField && (
              <button className="save-btn" onClick={handleSave}>
                Save Changes
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentsProfile;