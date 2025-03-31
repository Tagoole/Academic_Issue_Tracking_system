import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './IssueManagement.css';
import NavBar from './Navbar';
import Sidebar from './Sidebar';

const IssueMangement = () => {
  const [activeTab, setActiveTab] = useState('Pending');
  const [activeDropdown, setActiveDropdown] = useState(null); // Track which dropdown is active
  const [showLecturerList, setShowLecturerList] = useState(false); // Track if lecturer list is shown
  const navigate = useNavigate(); // Initialize useNavigate

  const issues = [
    {
      id: 1,
      studentName: "Kibuka Mark",
      category: "Missing Marks",
      submissionDate: "14/02/2025",
    },
  ];

  const lecturers = [
    "Muzafaru Benard",
    "Nakimuli Sharon",
    "Walukaga Jacob",
    "Shadrick Kimera",
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id); 
  };

  const handleViewDetails = () => {
    navigate('/view-details'); 
  };

  const handleEscalateIssue = () => {
    setShowLecturerList(true); 
  };

  const handleSelectLecturer = (lecturer) => {
    navigate('/new-chat', { state: { lecturer } }); 
  };

  return (
    <div className="app-container">
      <NavBar />
      <div className="content-wrapper">
        <Sidebar />
        <div className="issue-tracker-container">
          <h1 className="issue-title">
            Issues <span className="issue-subtitle">(Kindly click on the issue to open it.)</span>
          </h1>

          {/* Tab navigation */}
          <div className="tab-container">
            {['Pending', 'In-progress', 'Resolved'].map((tab) => (
              <button
                key={tab}
                className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="issues-container">
            <div className="issues-header">
              <h2 className="issues-title">Issues</h2>

              <div className="search-filter-container">
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Search for issues..."
                    className="search-input"
                  />
                  <div className="search-icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                <button className="filter-button">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 4H21M3 12H21M3 20H21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Filter</span>
                </button>
              </div>
            </div>

            <table className="issues-table">
              <thead>
                <tr>
                  <th>ISSUE ID</th>
                  <th>STUDENT NAME</th>
                  <th>CATEGORY</th>
                  <th>SUBMISSION DATE</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
                  <tr key={issue.id} className="issue-row">
                    <td>{issue.id}</td>
                    <td>{issue.studentName}</td>
                    <td>{issue.category}</td>
                    <td>{issue.submissionDate}</td>
                    <td className="actions-cell">
                      <button
                        className="more-button"
                        onClick={() => toggleDropdown(issue.id)}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 12.5C12.2761 12.5 12.5 12.2761 12.5 12C12.5 11.7239 12.2761 11.5 12 11.5C11.7239 11.5 11.5 11.7239 11.5 12C11.5 12.2761 11.7239 12.5 12 12.5Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 5.5C12.2761 5.5 12.5 5.27614 12.5 5C12.5 4.72386 12.2761 4.5 12 4.5C11.7239 4.5 11.5 4.72386 11.5 5C11.5 5.27614 11.7239 5.5 12 5.5Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 19.5C12.2761 19.5 12.5 19.2761 12.5 19C12.5 18.7239 12.2761 18.5 12 18.5C11.7239 18.5 11.5 18.7239 11.5 19C11.5 19.2761 11.7239 19.5 12 19.5Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>

                      {activeDropdown === issue.id && (
                        <div className="dropdown-menu">
                          <button
                            className="dropdown-item"
                            onClick={handleViewDetails} // Navigate to ViewDetails page
                          >
                            <span>View details</span>
                          </button>
                          <button
                            className="dropdown-item"
                            onClick={handleEscalateIssue} // Show lecturer list
                          >
                            <span>Escalate Issue</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Lecturer List */}
            {showLecturerList && (
              <div className="lecturer-list">
                <h3>Select the Lecturer</h3>
                <ul>
                  {lecturers.map((lecturer, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelectLecturer(lecturer)}
                      className="lecturer-item"
                    >
                      {lecturer}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueMangement;