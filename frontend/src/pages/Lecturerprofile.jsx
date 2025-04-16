import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import name from '../assets/name.png';
import backgroundimage from "../assets/backgroundimage.jpg";
import Sidebar2 from './Sidebar2';
import NavBar from './NavBar';
import './Lecturerprofile.css';

const Lecturerprofile = () => {
  // Initial state would typically come from your API or context
  const [profileData, setProfileData] = useState({
    name: 'Dr. John Doe',
    emailaddress: 'john.doe@university.edu',
    phonenumber: '123-456-7890',
    college: 'College of computer science',
    department: 'Department 1',
    office: 'Computer Science',
    gender: 'Male',
    profilePicture: null // Would be an image URL in real application
  });

  // State to track if we're in edit mode
  const [editMode, setEditMode] = useState(false);
  // State to store temporary edits
  const [formData, setFormData] = useState({...profileData});

  const navigate = useNavigate();

  // If profile data changes, update the form data
  useEffect(() => {
    setFormData({...profileData});
  }, [profileData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Save the changes to the profile data
    setProfileData({...formData});
    // Exit edit mode
    setEditMode(false);
    // In a real application, you would send this data to your backend
    console.log('Profile data updated:', formData);
  };

  const handleCancel = () => {
    // Reset form data to original
    setFormData({...profileData});
    // Exit edit mode
    setEditMode(false);
  };

  return (
    <div className="app-container">
      <NavBar />
      <Sidebar2 />
      <div className="main-content">
        <NavBar />
        <div className="profile-container">
          <div className="profile-overlay">
            <h1 className="profile-heading">Lecturer Profile</h1>

            <div className="profile-content">
              <div className="profile-picture-section">
                <div className="profile-picture">
                  {profileData.profilePicture ? (
                    <img src={profileData.profilePicture} alt="Profile" />
                  ) : (
                    <div className="profile-picture-placeholder">
                      {profileData.name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>

              <div className="profile-details">
                {editMode ? (
                  <form className="profile-form" onSubmit={handleSave}>
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
                          required
                        />
                      </div>
                    </div>

                    <div className="detail-item">
                      <label>Email Address</label>
                      <div className="input-group">
                        <div className="input-icon">
                          <img src={name} alt="Email Icon" />
                        </div>
                        <input
                          type="email"
                          name="emailaddress"
                          value={formData.emailaddress}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="detail-item">
                      <label>Phone Number</label>
                      <div className="input-group">
                        <div className="input-icon">
                          <img src={name} alt="Phone Icon" />
                        </div>
                        <input
                          type="tel"
                          name="phonenumber"
                          value={formData.phonenumber}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="detail-item">
                      <label>College</label>
                      <div className="input-group">
                        <div className="input-icon">
                          <img src={name} alt="College Icon" />
                        </div>
                        <div className="select-wrapper">
                          <select
                            name="college"
                            value={formData.college}
                            onChange={handleChange}
                            required
                          >
                            <option value="College of computer science">College of computer science</option>
                            <option value="College of Engineering">College of Engineering</option>
                            <option value="College of Arts">College of Arts</option>
                            <option value="College of Business">College of Business</option>
                          </select>
                        </div>
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
                      <div className="detail-label">Email Address:</div>
                      <div className="detail-value">{profileData.emailaddress}</div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-label">Phone Number:</div>
                      <div className="detail-value">{profileData.phonenumber}</div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-label">College:</div>
                      <div className="detail-value">{profileData.college}</div>
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
                      <button className="edit-button" onClick={() => setEditMode(true)}>
                        Edit Profile
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bottom-links">
              <a href="/help" className="help-link">Need Help?</a>
              <a href="/delete-account" className="delete-account-link">Delete Account</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lecturerprofile;