import React, { useState, useRef, useEffect } from 'react';
import Navbar from './NavBar';
import Sidebar from './Sidebar';

import './Registraprofile.css';

const RegistraProfile = () => {
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState('/avatar-placeholder.png');

  // Initialize state with localStorage data
  const [profile, setProfile] = useState({
    fullName: '[Full Name]',
    role: '[Role]',
    phoneNumber: '0712 346587',
    email: '[Email Address]',
    gender: '[Gender]',
    registrationNumber: '[Registration]',
    RegNumber: '[Registra Number]',
    department: 'Department of Computer Science'
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    // Get user data from localStorage
    const userName = localStorage.getItem('userName') || '[Full Name]';
    const userEmail = localStorage.getItem('userEmail') || '[Email Address]';
    const userGender = localStorage.getItem('userGender') || '[Gender]';
    const userId = localStorage.getItem('userId') || '';

    // Update profile state with localStorage data
    setProfile(prevProfile => ({
      ...prevProfile,
      fullName: userName,
      email: userEmail,
      gender: userGender,
      RegNumber: userId,
      registrationNumber: userId ? `25/Reg/23-${userId}` : '[Registration]'
    }));
  }, []);

  const [editableField, setEditableField] = useState(null);

  const handleEditClick = (field) => {
    // Don't allow editing for readonly fields
    if (field === 'fullName' || field === 'email' || field === 'gender' ||
      field === 'RegNumber' || field === 'registrationNumber') {
      return;
    }
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

  // Function to determine if a field is readonly
  const isReadOnly = (field) => {
    return ['fullName', 'email', 'gender', 'RegNumber', 'registrationNumber'].includes(field);
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
                {!isReadOnly('fullName') && (
                  <button className="edit-btn" onClick={() => handleEditClick('fullName')}>
                    Edit
                  </button>
                )}
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
                      readOnly={isReadOnly(field)}
                      className={isReadOnly(field) ? 'readonly-field' : ''}
                    />
                  ) : (
                    <span className={isReadOnly(field) ? 'readonly-value' : ''}>
                      {profile[field]}
                    </span>
                  )}
                  {!isReadOnly(field) && (
                    editableField === field ? (
                      <button className="edit-btn" onClick={handleSave}>
                        Save
                      </button>
                    ) : (
                      <button className="edit-btn" onClick={() => handleEditClick(field)}>
                        Edit
                      </button>
                    )
                  )}
                </div>
              ))}
            </div>

            {/* Academic Information Section */}
            <div className="info-card">
              <h3>Academic Information</h3>
              {['registrationNumber', 'RegNumber', 'department'].map((field) => (
                <div key={field} className="info-item">
                  <label>{field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}:</label>
                  {editableField === field ? (
                    <input
                      type="text"
                      name={field}
                      value={profile[field]}
                      onChange={handleInputChange}
                      autoFocus
                      readOnly={isReadOnly(field)}
                      className={isReadOnly(field) ? 'readonly-field' : ''}
                    />
                  ) : (
                    <span className={isReadOnly(field) ? 'readonly-value' : ''}>
                      {profile[field]}
                    </span>
                  )}
                  {!isReadOnly(field) && (
                    editableField === field ? (
                      <button className="edit-btn" onClick={handleSave}>
                        Save
                      </button>
                    ) : (
                      <button className="edit-btn" onClick={() => handleEditClick(field)}>
                        Edit
                      </button>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RegistraProfile;