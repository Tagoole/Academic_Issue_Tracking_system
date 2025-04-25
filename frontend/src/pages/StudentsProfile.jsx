import React, { useState, useRef, useEffect } from 'react';
import Navbar from './NavBar';
import Sidebar from './Sidebar1';
import './StudentsProfile.css';

const StudentsProfile = () => {
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState('/avatar-placeholder.png');
  const [programName, setProgramName] = useState('[Program]');
  
  // Initialize state with localStorage data
  const [profile, setProfile] = useState({
    fullName: '[Full Name]',
    role: '[Role]',
    phoneNumber: '0723 456678', // Default phone number
    email: '[Email Address]',
    gender: '[Gender]',
    registrationNumber: '[Registration]',
    studentNumber: '[Student Number]',
    program: '[Program]',
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    // Get user data from localStorage
    const userName = localStorage.getItem('userName') || '[Full Name]';
    const userEmail = localStorage.getItem('userEmail') || '[Email Address]';
    const userGender = localStorage.getItem('userGender') || '[Gender]';
    const userId = localStorage.getItem('userId') || '';
    const userProgram = localStorage.getItem('userProgram') || '';
    
    // Update profile state with localStorage data
    setProfile(prevProfile => ({
      ...prevProfile,
      fullName: userName,
      email: userEmail,
      gender: userGender,
      studentNumber: userId,
      registrationNumber: userId ? `25/MAK/23-${userId}` : '[Registration]'
    }));

    // Fetch program name from API if userProgram exists
    if (userProgram) {
      fetchProgramName(userProgram);
    }
  }, []);

  // Function to fetch program name from API
  const fetchProgramName = async (programId) => {
    try {
      const response = await fetch(`/api/program/${programId}`);
      if (response.ok) {
        const data = await response.json();
        setProgramName(data.name || '[Program]');
        setProfile(prevProfile => ({
          ...prevProfile,
          program: data.name || '[Program]'
        }));
      } else {
        console.error('Failed to fetch program data');
      }
    } catch (error) {
      console.error('Error fetching program data:', error);
    }
  };

  const [editableField, setEditableField] = useState(null);

  const handleEditClick = (field) => {
    // Don't allow editing for readonly fields
    if (field === 'fullName' || field === 'email' || field === 'gender' || 
        field === 'studentNumber' || field === 'registrationNumber' || 
        field === 'phoneNumber' || field === 'program') {
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
    return ['fullName', 'email', 'gender', 'studentNumber', 'registrationNumber', 'phoneNumber', 'program'].includes(field);
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
              {['registrationNumber', 'studentNumber', 'program'].map((field) => (
                <div key={field} className="info-item">
                  <label>
                    {field === 'program' 
                      ? 'Program' 
                      : field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}:
                  </label>
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

export default StudentsProfile;