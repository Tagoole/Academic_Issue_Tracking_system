import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import backgroundImage from "../assets/backgroundimage.jpg"; 
import './IssueManagement.css';

function IssueManagement() {
  const navigate = useNavigate(); // Initialize useNavigate for navigation
  const [activeTab, setActiveTab] = useState('pending');
  const [issues, setIssues] = useState([
    {
      id: 1,
      studentName: 'Kibuka Mark',
      category: 'Missing Marks',
      submissionDate: '14/03/2024',
      status: 'pending'
    }
  ]);

  const [showLecturerList, setShowLecturerList] = useState(false); // State to show/hide lecturer list
  const [lecturers] = useState([
    'Muzafaru Benard',
    'Nakimuli Sharon',
    'Walukaga Jacob',
    'Shadrick Kimera'
  ]); // List of lecturers

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleActionClick = (action) => {
    if (action === 'view-details') {
      navigate('/view-details'); 
    } else if (action === 'escalate-issue') {
      setShowLecturerList(true); // Show the lecturer list
    }
  };

  const handleLecturerSelect = (lecturer) => {
    console.log(`Escalating issue to: ${lecturer}`);
    navigate('/new-chat'); // Navigate to the new-chat page
  };

  return (
    <div
      className="app-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
    >
      <Navbar />
      <div className="main-content">
        <h2 className="issues-title">Issues <span className="issues-subtitle">(Kindly click on the issue to open it.)</span></h2>
        <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
        <div className="issues-container">
          <div className="issues-header">
            <h3>Issues</h3>
          </div>
          <table className="issues-table">
            <thead>
              <tr>
                <th colSpan="3">
                  <div className="search-container">
                    <input type="text" placeholder="Search for issues..." className="search-input" />
                    <button className="search-button">
                      
                    </button>
                  </div>
                </th>
                <th colSpan="2">
                  <button className="filter-button">
                    <i className="filter-icon"></i> Filter
                  </button>
                </th>
              </tr>
              <tr>
                <th>ISSUE ID</th>
                <th>STUDENT NAME</th>
                <th>CATEGORY</th>
                <th>SUBMISSION DATE</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {issues.map(issue => (
                <tr key={issue.id}>
                  <td>{issue.id}</td>
                  <td>{issue.studentName}</td>
                  <td>{issue.category}</td>
                  <td>{issue.submissionDate}</td>
                  <td>
                    <div className="dropdown">
                      <button className="dropdown-button">:</button>
                      <div className="dropdown-content">
                        <button onClick={() => handleActionClick('view-details')}>View Details</button>
                        <button onClick={() => handleActionClick('escalate-issue')}>Escalate Issue</button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lecturer List Modal */}
      {showLecturerList && (
        <div className="modal">
          <div className="modal-content">
            <h3>Select the Lecturer</h3>
            <ul className="lecturer-list">
              {lecturers.map((lecturer, index) => (
                <li
                  key={index}
                  className="lecturer-item"
                  onClick={() => handleLecturerSelect(lecturer)}
                >
                  {lecturer}
                </li>
              ))}
            </ul>
            <button className="close-button" onClick={() => setShowLecturerList(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default IssueManagement;