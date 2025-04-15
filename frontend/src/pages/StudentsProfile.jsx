import React, { useState, useRef } from 'react';
import Navbar from './NavBar';
import Sidebar from './Sidebar1';
import './StudentsProfile.css';

const StudentsProfile = ({ userData }) => {
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState('/avatar-placeholder.png');
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

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for the image
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      
      console.log('Image file selected:', file);
    }
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
                <div className="profile-image-container" onClick={handleImageClick}>
                  <img src={profileImage} alt="Profile" className="profile-image" />
                  <div className="image-overlay">
                    <span>Change Photo</span>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
                <div className="profile-details">
                  <h2>{profile.fullName}</h2>
                  <p>{profile.role}</p>
                </div>
                <button className="edit-btn" onClick={() => handleEditClick('fullName')}>
                  Edit 
                </button>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="info-card">
              <h3>Personal Information</h3>
              {['fullName', 'phoneNumber', 'email', 'gender'].map((field) => (
                <div key={field} className="info-item">
                  <label>{field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}:</label>
                  {editableField === field ? (
                    <input
                      type="text"
                      
                      name={field}
                      value={profile[field]}
                      onChange={handleInputChange}
                      autoFocus
                    />
                  ) : (
                    <span>{profile[field]}</span>
                  )}
                  {editableField === field ? (
                    <button className="edit-btn" onClick={handleSave}>
                      Save
                    </button>
                  ) : (
                    <button className="edit-btn" onClick={() => handleEditClick(field)}>
                      Edit
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Academic Information Section */}
            <div className="info-card">
              <h3>Academic Information</h3>
              {['registrationNumber', 'studentNumber', 'course', 'semester'].map((field) => (
                <div key={field} className="info-item">
                  <label>{field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}:</label>
                  {editableField === field ? (
                    <input
                      type="text"
                      name={field}
                      value={profile[field]}
                      onChange={handleInputChange}
                      autoFocus
                      disabled={field === 'registrationNumber' || field === 'studentNumber'}
                    />
                  ) : (
                    <span>{profile[field]}</span>
                  )}
                  {field !== 'registrationNumber' && field !== 'studentNumber' ? (
                    editableField === field ? (
                      <button className="edit-btn" onClick={handleSave}>
                        Save
                      </button>
                    ) : (
                      <button className="edit-btn" onClick={() => handleEditClick(field)}>
                        Edit
                      </button>
                    )
                  ) : null}
                </div>
              ))}
            </div>

            {/* Global save button removed since we now have individual save buttons */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentsProfile;