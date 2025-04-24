import React, { useState, useRef, useEffect } from 'react';
import Navbar from './NavBar';
import Sidebar2 from './Sidebar2';
import './LecturerProfile.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LecturerProfile = () => {
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState('/avatar-placeholder.png');
  
  // Initialize state with localStorage data
  const [profile, setProfile] = useState({
    fullName: '[Full Name]',
    role: '[Role]',
    phoneNumber: '[Phone Number]',
    email: '[Email Address]',
    gender: '[Gender]',
    registrationNumber: '[Registration]',
    lecturerNumber: '[Lecturer Number]',
    department: '[Department]'
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
      lecturerNumber: userId,
      registrationNumber: userId ? `25/LECT/23-${userId}` : '[Registration]'
    }));
  }, []);

  const [editableField, setEditableField] = useState(null);

  const handleEditClick = (field) => {
    // Don't allow editing for readonly fields
    if (isReadOnly(field)) {
      return;
    }

    setEditableField(field);

    // Show success toast
    toast.success(`Edit mode enabled for ${field}.`, {
      autoClose: 3000,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (editableField) {
      setEditableField(null);

      // Simulate a successful save (replace with API call if needed)
      const isSaveSuccessful = true; // Replace with actual save logic

      if (isSaveSuccessful) {
        // Show success toast
        toast.success('Profile updated successfully!', {
          autoClose: 3000,
        });
        console.log('Profile updated:', profile);
      } else {
        // Show error toast
        toast.error('Failed to update profile. Please try again.', {
          autoClose: 3000,
        });
      }
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Create a preview URL for the image
        const imageUrl = URL.createObjectURL(file);
        setProfileImage(imageUrl);

        // Show success toast
        toast.success('Profile picture updated successfully!', {
          autoClose: 3000,
        });

        console.log('Image file selected:', file);
      } catch (error) {
        // Show error toast
        toast.error('Failed to update profile picture. Please try again.', {
          autoClose: 3000,
        });
      }
    }
  };

  // Function to determine if a field is readonly
  const isReadOnly = (field) => {
    return ['fullName', 'email', 'gender', 'lecturerNumber', 'registrationNumber'].includes(field);
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="content-wrapper">
        <Sidebar2 />
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
              {['registrationNumber', 'lecturerNumber', 'department'].map((field) => (
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default LecturerProfile;