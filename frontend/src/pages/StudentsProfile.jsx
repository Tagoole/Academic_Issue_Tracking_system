import React, { useState, useRef, useEffect } from 'react';
import Navbar from './NavBar';
import Sidebar from './Sidebar1';
import './StudentsProfile.css';
import API from '../api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentsProfile = () => {
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState('/avatar-placeholder.png');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editableField, setEditableField] = useState(null);

  // Initialize profile state with default values
  const [profile, setProfile] = useState({
    fullName: 'Loading...',
    role: 'Student',
    phoneNumber: 'Loading...',
    email: 'Loading...',
    gender: 'Loading...',
    registrationNumber: 'Loading...',
    studentNumber: 'Loading...',
    program: 'Loading...',
  });

  // Fields that should be read-only
  const readOnlyFields = [
    'fullName', 'email', 'gender', 
    'studentNumber', 'registrationNumber', 
    'program'
  ];

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Show toast notification for loading profile data
        toast.info("Loading your profile data...");
        
        // Get basic user data from localStorage
        const userData = {
          fullName: localStorage.getItem('userName') || 'Not available',
          email: localStorage.getItem('userEmail') || 'Not available',
          gender: localStorage.getItem('userGender') || 'Not specified',
          studentNumber: localStorage.getItem('userId') || 'Not assigned',
          programId: localStorage.getItem('userProgram') || null,
        };

        // Generate registration number if student number exists
        const registrationNumber = userData.studentNumber 
          ? `25/MAK/23-${userData.studentNumber}`
          : 'Not available';

        // Update profile with basic info
        setProfile(prev => ({
          ...prev,
          ...userData,
          registrationNumber,
          phoneNumber: '0723 456678', // Default phone number
        }));

        // Fetch program details if programId exists
        if (userData.programId) {
          await fetchProgramName(userData.programId);
        } else {
          setProfile(prev => ({
            ...prev,
            program: 'No program assigned'
          }));
        }

        // Show success toast when profile is loaded
        toast.success("Profile loaded successfully!");
      } catch (err) {
        console.error("Failed to load user data:", err);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Fetch program name from API
  const fetchProgramName = async (programId) => {
    try {
      const response = await API.get(`/api/program/${programId}`);
      
      if (response.data && (response.data.name || response.data.programName)) {
        const programName = response.data.name || response.data.programName;
        setProfile(prev => ({
          ...prev,
          program: programName
        }));
        localStorage.setItem('userProgramName', programName);

        // Show success toast when program information is loaded
        toast.success("Program information loaded");
      } else {
        throw new Error('Invalid program data format');
      }
    } catch (err) {
      console.error('Error fetching program:', err);
      setProfile(prev => ({
        ...prev,
        program: 'Program info unavailable'
      }));
      toast.warning("Couldn't retrieve program information");
    }
  };

  const handleEditClick = (field) => {
    if (!readOnlyFields.includes(field)) {
      setEditableField(field);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setEditableField(null);
    // Here you would typically send the updated data to your API
    console.log('Updated profile:', profile);
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Navbar />
        <div className="content-wrapper">
          <Sidebar />
          <main className="main-content">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading your profile...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Navbar />
        <div className="content-wrapper">
          <Sidebar />
          <main className="main-content">
            <div className="error-container">
              <div className="error-icon">⚠️</div>
              <h3>Error Loading Profile</h3>
              <p>{error}</p>
              <button 
                className="retry-btn"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Navbar />
      <div className="content-wrapper">
        <Sidebar />
        <main className="main-content">
          <div className="profile-container">
            {/* Profile Header Card */}
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-image-container" onClick={handleImageClick}>
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="profile-image" 
                    onError={(e) => {
                      e.target.src = '/avatar-placeholder.png';
                    }}
                  />
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
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="info-card">
              <h3>Personal Information</h3>
              {[
                { field: 'fullName', label: 'Full Name' },
                { field: 'phoneNumber', label: 'Phone Number' },
                { field: 'email', label: 'Email Address' },
                { field: 'gender', label: 'Gender' },
              ].map(({ field, label }) => (
                <div key={field} className="info-item">
                  <label>{label}:</label>
                  <div className="info-value-container">
                    {editableField === field ? (
                      <input
                        type={field === 'email' ? 'email' : 'text'}
                        name={field}
                        value={profile[field]}
                        onChange={handleInputChange}
                        autoFocus
                        readOnly={readOnlyFields.includes(field)}
                        className={readOnlyFields.includes(field) ? 'readonly-field' : ''}
                      />
                    ) : (
                      <span className={readOnlyFields.includes(field) ? 'readonly-value' : ''}>
                        {profile[field]}
                      </span>
                    )}
                    {!readOnlyFields.includes(field) && (
                      editableField === field ? (
                        <button className="save-btn" onClick={handleSave}>
                          Save
                        </button>
                      ) : (
                        <button 
                          className="edit-btn" 
                          onClick={() => handleEditClick(field)}
                        >
                          Edit
                        </button>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Academic Information Section */}
            <div className="info-card">
              <h3>Academic Information</h3>
              {[
                { field: 'registrationNumber', label: 'Registration Number' },
                { field: 'studentNumber', label: 'Student Number' },
                { field: 'program', label: 'Program' },
              ].map(({ field, label }) => (
                <div key={field} className="info-item">
                  <label>{label}:</label>
                  <div className="info-value-container">
                    <span className="readonly-value">
                      {profile[field]}
                    </span>
                  </div>
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