import React from 'react';
import Navbar from './Navbar';
import Sidebar from './sidebar';
import './StudentsProfile.css';

const StudentsProfile = ({ userData }) => {
  
  const {
    fullName = '[Full Name]',
    role = '[Role]',
    phoneNumber = '[Phone Number]',
    email = '[Email Address]',
    gender = '[Gender]',
    registrationNumber = '[Registration]',
    studentNumber = '[Student Number]',
    course = '[Course]',
    semester = '[Semester]'
  } = userData || {};

  return (
    <div className="app-container">
      <Navbar />
      <div className="content-wrapper">
        <Sidebar />
        <main className="main-content">
          <div className="profile-container">
            <section className="profile-header">
              <h2>Profile</h2>
              <div className="profile-card">
                <div className="profile-image-container">
                  <img src="/avatar-placeholder.png" alt="Profile" className="profile-image" />
                </div>
                <div className="profile-info">
                  <div className="profile-name">{fullName}</div>
                  <div className="profile-role">{role}</div>
                </div>
                <button className="edit-button">Edit</button>
              </div>
            </section>

            <section className="info-section">
              <div className="section-header">
                <h3>Personal Information</h3>
                <button className="edit-button">Edit</button>
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <label>Full Name</label>
                  <div className="info-value">{fullName}</div>
                </div>
                <div className="info-item">
                  <label>Phone Number</label>
                  <div className="info-value">{phoneNumber}</div>
                </div>
                <div className="info-item">
                  <label>Email Address</label>
                  <div className="info-value">{email}</div>
                </div>
                <div className="info-item">
                  <label>Gender</label>
                  <div className="info-value">{gender}</div>
                </div>
              </div>
            </section>

            <section className="info-section">
              <div className="section-header">
                <h3>Academic Information</h3>
                <button className="edit-button">Edit</button>
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <label>Registration Number</label>
                  <div className="info-value">{registrationNumber}</div>
                </div>
                <div className="info-item">
                  <label>Course</label>
                  <div className="info-value">{course}</div>
                </div>
                <div className="info-item">
                  <label>Student Number</label>
                  <div className="info-value">{studentNumber}</div>
                </div>
                <div className="info-item">
                  <label>Semester</label>
                  <div className="info-value">{semester}</div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentsProfile;