import React, { useState } from "react";
import NavBar from "./NavBar"; 
import HorizontalSideBar from "./HorizontalSideBar";
import "./CreateIssueForm.css";

const CreateIssueForm= () => {
  const [formData, setFormData] = useState({
    registrarName: "Nassuna Annet",
    lecturerName: "",
    studentName: "",
    issueCategory: "Missing marks",
    issueTitle: "Wrong Marks",
    issueDescription: "I have no marks for OS test yet I merged 86% in it.",
    courseUnitCode: "CSS 11001",
    courseUnitName: "Operating Systems",
    status: "Pending ........",
    attachment: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e) => {
    setFormData({ ...formData, attachment: e.target.files[0] });
  };

  return (
    <div className="app-container">
      <NavBar />
      <div className="main-content">
        <HorizontalSideBar />
        <div className="form-container">
          <h2>Create a new issue</h2>
          <form>
            <div className="form-group">
              <label>Registrar's Name</label>
              <input type="text" value={formData.registrarName} readOnly />
            </div>

            <div className="form-group">
              <label>Lecturer's Name</label>
              <input
                type="text"
                name="lecturerName"
                value={formData.lecturerName}
                onChange={handleChange}
                placeholder="Enter lecturer's name"
              />
            </div>

            <div className="form-group">
              <label>Student's Name</label>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label>Issue Category</label>
              <input type="text" value={formData.issueCategory} readOnly />
            </div>

            <div className="form-group">
              <label>Issue Title</label>
              <input type="text" value={formData.issueTitle} readOnly />
            </div>

            <div className="form-group">
              <label>Issue Description</label>
              <textarea
                name="issueDescription"
                value={formData.issueDescription}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Course Unit Code</label>
              <input type="text" value={formData.courseUnitCode} readOnly />
            </div>

            <div className="form-group">
              <label>Course Unit Name</label>
              <input type="text" value={formData.courseUnitName} readOnly />
            </div>

            <div className="form-group">
              <label>Status</label>
              <input type="text" value={formData.status} readOnly />
            </div>

            <div className="form-group">
              <label>Attachments</label>
              <input type="file" onChange={handleFileUpload} />
              {formData.attachment && (
                <p>Uploaded: {formData.attachment.name}</p>
              )}
            </div>

            <button type="submit">Submit Issue</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateIssueForm;
