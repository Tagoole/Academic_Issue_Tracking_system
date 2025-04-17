import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import name from '../assets/name.png';
import backgroundimage from "../assets/backgroundimage.jpg";
import Sidebar2 from './Sidebar2';
import NavBar from './NavBar';
import './Lecturerprofile.css';

const LecturerProfile = ({ userData = {} }) => {
  // Default placeholder data
  const defaultData = {
    name: 'John Doe',
    role: 'Assistant Professor',
    phoneNumber: '+123 456 7890',
    email: 'john.doe@university.edu',
    gender: 'Male',
    college: 'College of Engineering',
    department: 'Computer Science',
    office: 'Room 203, Building B',
    profilePicture: null
  };

  // Set up initial profile data
  const [profileData, setProfileData] = useState({ ...defaultData, ...userData });
  
  // State to track if we're in edit mode
  const [editMode, setEditMode] = useState(false);
  
  // State to store temporary edits
  const [formData, setFormData] = useState({...profileData});
  
  // State for confirmation dialog
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  // State for success messages
  const [successMessage, setSuccessMessage] = useState('');
  
  // File input reference
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  // If profile data changes, update the form data
  useEffect(() => {
    setFormData({...profileData});
  }, [profileData]);

  // Auto-hide success messages after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create a preview URL for the selected image
    const reader = new FileReader();
    reader.onload = () => {
      setFormData({
        ...formData,
        profilePicture: reader.result
      });
      
      // In a real app, you would upload the file to your server here
      // For now, we'll just update the state and show a success message
      setProfileData({
        ...profileData,
        profilePicture: reader.result
      });
      
      setSuccessMessage('Profile picture updated successfully!');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const handleConfirmSave = () => {
    // Save the changes to the profile data
    setProfileData({...formData});
    // Exit edit mode
    setEditMode(false);
    // Hide confirmation dialog
    setShowConfirmDialog(false);
    // Show success message
    setSuccessMessage('Profile updated successfully!');
    
    // In a real application, you would send this data to your backend
    console.log('Profile data updated:', formData);
  };

  const handleCancel = () => {
    // Reset form data to original
    setFormData({...profileData});
    // Exit edit mode
    setEditMode(false);
    // Hide confirmation dialog if it's open
    setShowConfirmDialog(false);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setFormData({...profileData});
  };

  return (
    <div className="app-container">
      <NavBar />
      <Sidebar2 />
      <div className="main-content">
        <div className="profile-container">
          <div className="profile-overlay">
            <h1 className="profile-heading">Lecturer Profile</h1>

            {/* Success Message */}
            {successMessage && (
              <div className="success-message">
                {successMessage}
              </div>
            )}

            <div className="profile-content">
              <div className="profile-picture-section">
                <div 
                  className="profile-picture" 
                  onClick={editMode ? handleProfilePictureClick : undefined}
                  style={editMode ? { cursor: 'pointer' } : {}}
                >
                  {formData.profilePicture ? (
                    <img src={formData.profilePicture} alt="Profile" />
                  ) : (
                    <div className="profile-picture-placeholder">
                      {formData.name.charAt(0)}
                    </div>
                  )}
                  {editMode && (
                    <div className="profile-picture-overlay">
                      <span>Click to change</span>
                    </div>
                  )}
                </div>
                {editMode && (
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                )}
              </div>

              <div className="profile-details">
                {editMode ? (
                  <form className="profile-form" onSubmit={handleSaveClick}>
                    <div className="detail-item">
                      <label>Name</label>
                      <div className="input-group">
                        <div className="input-icon">
                          <img src={name} alt="Name Icon" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="info-input"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="detail-item">
                      <label>Department</label>
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
                            <option value="Department 1">Department 1</option>
                            <option value="Department 2">Department 2</option>
                            <option value="Department 3">Department 3</option>
                            <option value="Department 4">Department 4</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="detail-item">
                      <label>Office</label>
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
                            <option value="Computer Science">Computer Science</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Physics">Physics</option>
                            <option value="Chemistry">Chemistry</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="detail-item">
                      <label>Gender</label>
                      <div className="input-group">
                        <div className="input-icon">
                          <img src={name} alt="Gender Icon" />
                        </div>
                        <div className="select-wrapper">
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="profile-actions">
                      <button type="submit" className="save-button">Save Changes</button>
                      <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="detail-item">
                      <div className="detail-label">Name:</div>
                      <div className="detail-value">{profileData.name}</div>
                    </div>
                    
                    <div className="detail-item">
                      <div className="detail-label">Department:</div>
                      <div className="detail-value">{profileData.department}</div>
                    </div>
                    
                    <div className="detail-item">
                      <div className="detail-label">Office:</div>
                      <div className="detail-value">{profileData.office}</div>
                    </div>
                    
                    <div className="detail-item">
                      <div className="detail-label">Gender:</div>
                      <div className="detail-value">{profileData.gender}</div>
                    </div>
                    
                    <div className="profile-actions">
                      <button type="button" className="edit-button" onClick={toggleEditMode}>Edit Profile</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="confirm-dialog-overlay">
          <div className="confirm-dialog">
            <h3>Save Changes</h3>
            <p>Are you sure you want to save these changes?</p>
            <div className="confirm-dialog-actions">
              <button onClick={handleConfirmSave} className="confirm-button">Yes, Save</button>
              <button onClick={() => setShowConfirmDialog(false)} className="cancel-button">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerProfile;