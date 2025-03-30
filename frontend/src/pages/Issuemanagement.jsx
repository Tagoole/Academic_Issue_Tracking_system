import React, { useState, useRef } from 'react';
import './Issuemanagement.css';

const Issuemanagement = () => {
  const [registrarName, setRegistrarName] = useState('');
  const [lecturerName, setLecturerName] = useState('');
  const [issueCategory, setIssueCategory] = useState('');
  const [studentName, setStudentName] = useState('');
  const [issueTitle, setIssueTitle] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [courseUnitCode, setCourseUnitCode] = useState('');
  const [courseUnitName, setCourseUnitName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validation logic
    if (
      !registrarName ||
      !lecturerName ||
      !issueCategory ||
      !studentName ||
      !issueTitle ||
      !issueDescription ||
      !courseUnitCode ||
      !courseUnitName
    ) {
      setErrorMessage('Please fill in all required fields.');
      setSubmissionMessage(''); // Clear success message if validation fails
      return;
    }

    // If validation passes
    setErrorMessage(''); // Clear error message
    setSubmissionMessage('Your issue has been successfully submitted!');
    // Reset form fields if needed
  };

  return (
    <div className="issue-reporting-container">
      <form className="form-container" onSubmit={handleSubmit}>
        <div className="left-column">
          <div className="form-group">
            <label>
              Registrar's Name <span className="required">*</span>
            </label>
            <div className="dropdown-container">
              <select
                className="dropdown"
                value={registrarName}
                onChange={(e) => setRegistrarName(e.target.value)}
              >
                <option value="">Select the registrar's name</option>
                <option value="Registrar 1">Registrar 1</option>
                <option value="Registrar 2">Registrar 2</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>
              Issue Category <span className="required">*</span>
            </label>
            <div className="dropdown-container">
              <select
                className="dropdown"
                value={issueCategory}
                onChange={(e) => setIssueCategory(e.target.value)}
              >
                <option value="">Select the issue category</option>
                <option value="Category 1">Category 1</option>
                <option value="Category 2">Category 2</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>
              Issue Description <span className="required">*</span>
            </label>
            <textarea
              className="text-area"
              placeholder="Enter the description"
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Attachments (Optional)</label>
            <div
              className="file-upload-container"
              onClick={() => fileInputRef.current.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                accept=".png,.jpg,.jpeg"
              />
              <div className="upload-text">
                <span className="upload-link">Upload a file</span> or drag and drop
              </div>
              <div className="file-type-info">PNG, JPG up to 10MB</div>
              {selectedFile && (
                <div className="selected-file">{selectedFile.name}</div>
              )}
            </div>
          </div>
        </div>

        <div className="right-column">
          <div className="form-group">
            <label>
              Lecturer's Name <span className="required">*</span>
            </label>
            <div className="dropdown-container">
              <select
                className="dropdown"
                value={lecturerName}
                onChange={(e) => setLecturerName(e.target.value)}
              >
                <option value="">Select the lecturer's name</option>
                <option value="Lecturer 1">Lecturer 1</option>
                <option value="Lecturer 2">Lecturer 2</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>
              Student's Name <span className="required">*</span>
            </label>
            <input
              type="text"
              className="text-input"
              placeholder="Enter your full name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>
              Issue Title <span className="required">*</span>
            </label>
            <input
              type="text"
              className="text-input"
              placeholder="Enter the issue title"
              value={issueTitle}
              onChange={(e) => setIssueTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>
              Course Unit Code <span className="required">*</span>
            </label>
            <input
              type="text"
              className="text-input"
              placeholder="Enter the course unit code"
              value={courseUnitCode}
              onChange={(e) => setCourseUnitCode(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>
              Course Unit Name <span className="required">*</span>
            </label>
            <input
              type="text"
              className="text-input"
              placeholder="Enter the course unit name"
              value={courseUnitName}
              onChange={(e) => setCourseUnitName(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="submit-button">Submit</button>
      </form>

      {errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}

      {submissionMessage && (
        <div className="submission-message">{submissionMessage}</div>
      )}
    </div>
  );
};

export default Issuemanagement;
