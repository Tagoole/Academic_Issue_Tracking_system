import React, { useState } from 'react';
import makererelogo from '../assets/makererelogo.png'; 
import Vector from '../assets/upload.png'; 
import './profilepicture.css';
const ProfilePictureSetup = () => {
  const navigate = useNavigate();
  const Back = () => {
    navigate(-1);
  };
  const handleGoToCongragulation = () => {
    navigate('/congragulation');
  };


  // const currentPicture = libraryImage
  const [currentPicture, setCurrentPicture] = useState(null);
  const [newPicture, setNewPicture] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };
  

  const handleFileUpload = (file) => {
    // Check file type
    if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
      alert('Please upload a JPG or PNG file');
      return;
    }


    


    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size should be less than 10MB');
      return;
    }

    // Simulate upload process
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Create preview
    setNewPicture(URL.createObjectURL(file));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (newPicture) {
      setCurrentPicture(newPicture);
      setNewPicture(null);
    }
  };

  const handleBack = () => {
    // Handle back button click
    console.log('Back button clicked');
  };

  return (
    <div className="profile-picture-setup-container">
      <div className="split-layout">
        {/* Left section with library image */}
        <div className="left-section">
          <img src={libraryImage} alt="Library" className="library-image" />
        </div>

        {/* Right section with form */}
        <div className="right-section">
          <div className="system-banner">
            <h1 className="system-title">Academic Issue Tracking System</h1>
          </div>

          <div className="form-container">
            <h2 className="setup-title">Profile Picture Setup</h2>
            <p className="setup-subtitle">Let's also set your profile picture</p>

            <form onSubmit={handleSubmit}>
              <div className="picture-section">
                <h3 className="section-title">Current Picture</h3>
                <div className="current-picture-container">
                  {currentPicture ? (
                    <img src= {currentPicture} alt="Current Profile" className="profile-preview" />
                  ) : (
                    <p className="no-picture">None</p>
                  )}
                </div>
              </div>

              <div className="picture-section">
                <h3 className="section-title">New Picture</h3>
                <div
                  className={`upload-container ${isDragging ? 'dragging' : ''}`}
                  onClick={handleUploadClick}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg, image/png"
                    className="file-input" />

                  {newPicture ? (
                    <img src={newPicture} alt="New Profile" className="profile-preview" />
                  ) : (
                    <div className="upload-content">
                      <img src={uploadIcon} alt="Upload" className="upload-icon" />
                      <h4 className="upload-title">Upload Image</h4>
                      <p className="upload-subtitle">Upload a file or drag and drop</p>
                      <p className="upload-formats">PNG, JPG (Max: 10MB)</p>
                    </div>
                  )}

                  {isUploading && (
                    <div className="progress-container">
                      <div
                        className="progress-bar"
                        style={{ width: `${uploadProgress}%` }}>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="navigation-container">
                <div className="button-group">
                  <button type="button" className="button back-button" onClick={Back}>Back</button>
                  <button type="submit" className="button next-button" onClick={handleGoToCongragulation}>Next</button>
                </div>
                <div className="page-indicator">2 of 2</div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureSetup;