import React, { useState } from 'react';
import NavBar from './NavBar';
import HorizontalSidebar from './HorizontalSideBar';
import './CreateIssueForm.css';

const CreateIssueForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    registrarName: 'Nassuna Annet',
    issueCategory: 'Missing marks',
    issueDescription: 'I have no marks for OS test yet i merged 86% in it.',
    lecturerName: '',
    studentName: '',
    issueTitle: 'Wrong Marks',
    courseUnitCode: 'CSS 11001',
    courseUnitName: 'Operating Systems',
    status: 'Pending .........',
    attachments: [
      { id: 1, name: 'screenshot.jpg', preview: '/sample-attachment.jpg' }
    ]
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Clear field value
  const clearField = (fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: ''
    });
  };

  // Remove attachment
  const removeAttachment = (id) => {
    setFormData({
      ...formData,
      attachments: formData.attachments.filter(attachment => attachment.id !== id)
    });
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      const newAttachments = files.map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
        preview: URL.createObjectURL(file)
      }));

      setFormData({
        ...formData,
        attachments: [...formData.attachments, ...newAttachments]
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add form submission logic here
  };

  // Handle back button
  const handleBack = () => {
    console.log('Navigating back');
    // Add navigation logic here
  };

  return (
    <div className="create-issue-page">
      <NavBar />
      <HorizontalSidebar />
      {/* Header Section */}
      <header className="header">
        <div className="header-left">
          <div className="user-profile">
            <div className="user-avatar">
              <span className="avatar-placeholder">JD</span>
            </div>
            <span className="user-name">John</span>
          </div>
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Search for anything..." 
              className="global-search" 
            />
          </div>
        </div>
        <div className="header-right">
          <div className="notification-icon">
            <i className="fas fa-bell icon"></i>
          </div>
          <div className="system-title">
            <span>Academic Issue Tracking System</span>
            <span className="university-logo">MUK</span>
          </div>
        </div>
      </header>

      {/* Navigation Menu */}
      <nav className="main-navigation">
        <ul>
          <li>
            <i className="fas fa-chart-line nav-icon"></i>
            <span>Dashboard</span>
          </li>
          <li className="active">
            <i className="fas fa-exclamation-circle nav-icon"></i>
            <span>Issues</span>
          </li>
          <li>
            <i className="fas fa-user nav-icon"></i>
            <span>Profile</span>
          </li>
          <li>
            <i className="fas fa-cog nav-icon"></i>
            <span>Settings</span>
          </li>
          <li>
            <i className="fas fa-question-circle nav-icon"></i>
            <span>Help & support</span>
          </li>
          <li>
            <i className="fas fa-sign-out-alt nav-icon"></i>
            <span>Logout</span>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="content">
        <div className="page-header">
          <button className="back-button" onClick={handleBack}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <h1>Create a new issue</h1>
        </div>

        <form className="issue-form" onSubmit={handleSubmit}>
          <div className="form-container">
            {/* Left Column */}
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="registrarName">Registrar's Name</label>
                <div className="input-with-clear">
                  <input
                    type="text"
                    id="registrarName"
                    name="registrarName"
                    value={formData.registrarName}
                    onChange={handleInputChange}
                  />
                  {formData.registrarName && (
                    <button 
                      type="button" 
                      className="clear-button"
                      onClick={() => clearField('registrarName')}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="issueCategory">Issue Category</label>
                <div className="input-with-clear">
                  <select
                    id="issueCategory"
                    name="issueCategory"
                    value={formData.issueCategory}
                    onChange={handleInputChange}
                  >
                    <option value="Missing marks">Missing marks</option>
                    <option value="Wrong marks">Wrong marks</option>
                    <option value="Registration issue">Registration issue</option>
                    <option value="Other">Other</option>
                  </select>
                  {formData.issueCategory && (
                    <button 
                      type="button" 
                      className="clear-button"
                      onClick={() => clearField('issueCategory')}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="issueDescription">Issue Description</label>
                <textarea
                  id="issueDescription"
                  name="issueDescription"
                  value={formData.issueDescription}
                  onChange={handleInputChange}
                  rows="5"
                ></textarea>
              </div>

              <div className="form-group">
                <label>Attachments</label>
                <div className="attachments-container">
                  <div className="attachment-upload">
                    <label htmlFor="fileUpload" className="upload-label">
                      <i className="fas fa-upload"></i>
                      <span>Upload Files</span>
                    </label>
                    <input
                      type="file"
                      id="fileUpload"
                      multiple
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                  </div>
                  
                  <div className="attachment-previews">
                    {formData.attachments.map(attachment => (
                      <div key={attachment.id} className="attachment-item">
                        <img src={attachment.preview} alt={attachment.name} />
                        <div className="attachment-name">{attachment.name}</div>
                        <button 
                          type="button"
                          className="remove-attachment"
                          onClick={() => removeAttachment(attachment.id)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="lecturerName">Lecturer's Name</label>
                <input
                  type="text"
                  id="lecturerName"
                  name="lecturerName"
                  value={formData.lecturerName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="studentName">Student's Name</label>
                <input
                  type="text"
                  id="studentName"
                  name="studentName"
                  placeholder="Enter your full name"
                  value={formData.studentName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="issueTitle">Issue Title</label>
                <input
                  type="text"
                  id="issueTitle"
                  name="issueTitle"
                  value={formData.issueTitle}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="courseUnitCode">Course Unit Code</label>
                <input
                  type="text"
                  id="courseUnitCode"
                  name="courseUnitCode"
                  value={formData.courseUnitCode}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="courseUnitName">Course Unit Name</label>
                <input
                  type="text"
                  id="courseUnitName"
                  name="courseUnitName"
                  value={formData.courseUnitName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <input
                  type="text"
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  disabled
                  className="disabled-input"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-button">Submit Issue</button>
                <button type="button" className="cancel-button" onClick={handleBack}>Cancel</button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateIssueForm;