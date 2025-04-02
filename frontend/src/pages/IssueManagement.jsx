import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from "./Sidebar";
import './IssueManagement.css';
import backgroundimage from '../assets/backgroundimage.jpg';

const IssueManagement = () => {
  const [issueStatus, setIssueStatus] = useState('Pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLecturersDropdown, setShowLecturersDropdown] = useState(false);
  const [activeIssueId, setActiveIssueId] = useState(null);
  const [showActionsDropdown, setShowActionsDropdown] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  
  // Sample issues data
  const issues = [
    {
      id: 1,
      studentName: 'Kibuka Mark',
      category: 'Missing Marks',
      submissionDate: '14/02/2025',
      status: 'Pending'
    },
    // Add more sample issues here if needed
  ];

  // Sample lecturers data
  const lecturers = [
    { id: 1, name: 'Dr. Sarah Johnson' },
    { id: 2, name: 'Prof. Michael Brown' },
    { id: 3, name: 'Dr. Elizabeth Taylor' },
    { id: 4, name: 'Prof. James Wilson' }
  ];

  const filteredIssues = issues.filter(issue => 
    issue.status === issueStatus &&
    (searchQuery === '' || 
     issue.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
     issue.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleStatusChange = (status) => {
    setIssueStatus(status);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleViewDetails = () => {
    // Simply navigate to the view-details page without any parameters
    navigate('/view-details');
  };

  const handleEscalateIssue = (issueId) => {
    // Show the dropdown and set the active issue
    setActiveIssueId(issueId);
    setShowLecturersDropdown(true);
    setShowActionsDropdown(null); // Close actions dropdown
  };

  const handleLecturerSelect = (lecturerId) => {
    // Hide the dropdown
    setShowLecturersDropdown(false);
    // Navigate to the new-chat page
    navigate('/new-chat');
  };

  const toggleActionsDropdown = (issueId) => {
    if (showActionsDropdown === issueId) {
      setShowActionsDropdown(null);
    } else {
      setShowActionsDropdown(issueId);
      setShowLecturersDropdown(false);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowActionsDropdown(null);
        setShowLecturersDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Style object for the background image
  const mainContentStyle = {
    backgroundImage: `url(${backgroundimage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'relative'
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="content-container">
        <Sidebar />
        <div className="main-content" style={mainContentStyle}>
          {/* Semi-transparent overlay to ensure text readability */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'transparent',
            zIndex: 1
          }}></div>
          
          {/* Content container with higher z-index to appear above the overlay */}
          <div className="issues-container" style={{ position: 'relative', zIndex: 2 }}>
            <h2 className="issues-title">Issues <span className="subtitle">(Kindly click on the issue to open it.)</span></h2>
            
            <div className="status-tabs">
              <button 
                className={`status-tab ${issueStatus === 'Pending' ? 'active' : ''}`}
                onClick={() => handleStatusChange('Pending')}
              >
                Pending
              </button>
              <button 
                className={`status-tab ${issueStatus === 'In-progress' ? 'active' : ''}`}
                onClick={() => handleStatusChange('In-progress')}
              >
                In-progress
              </button>
              <button 
                className={`status-tab ${issueStatus === 'Resolved' ? 'active' : ''}`}
                onClick={() => handleStatusChange('Resolved')}
              >
                Resolved
              </button>
            </div>
            
            <div className="issues-list-header">
              <h3>Issues</h3>
              <div className="search-filter-container">
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Search for issues..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="search-input"
                  />
                  <button className="search-button">
                    <i className="search-icon"></i>
                  </button>
                </div>
                <button className="filter-button">
                  <i className="filter-icon"></i> Filter
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
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.map((issue) => (
                  <tr key={issue.id} className="issue-row">
                    <td>{issue.id}</td>
                    <td>{issue.studentName}</td>
                    <td>{issue.category}</td>
                    <td>{issue.submissionDate}</td>
                    <td className="actions-cell" ref={dropdownRef}>
                      <div className="actions-dropdown-container">
                        <button 
                          className="actions-dropdown-toggle"
                          onClick={() => toggleActionsDropdown(issue.id)}
                        >
                          Actions <i className="dropdown-arrow"></i>
                        </button>
                        
                        {showActionsDropdown === issue.id && (
                          <div className="actions-dropdown-menu">
                            <button 
                              className="dropdown-item"
                              onClick={handleViewDetails}
                            >
                              <i className="view-icon"></i> View details
                            </button>
                            <button 
                              className="dropdown-item"
                              onClick={() => handleEscalateIssue(issue.id)}
                            >
                              <i className="escalate-icon"></i> Escalate issue
                            </button>
                            {/* You can add more action items here */}
                            <button className="dropdown-item">
                              <i className="edit-icon"></i> Edit issue
                            </button>
                            <button className="dropdown-item danger">
                              <i className="delete-icon"></i> Delete issue
                            </button>
                          </div>
                        )}
                        
                        {/* Lecturers dropdown - keep this separate */}
                        {showLecturersDropdown && activeIssueId === issue.id && (
                          <div className="lecturers-dropdown">
                            <div className="dropdown-header">
                              <h4>Select a Lecturer</h4>
                              <button 
                                className="close-dropdown"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowLecturersDropdown(false);
                                }}
                              >
                                &times;
                              </button>
                            </div>
                            <ul className="lecturers-list">
                              {lecturers.map(lecturer => (
                                <li 
                                  key={lecturer.id}
                                  onClick={() => handleLecturerSelect(lecturer.id)}
                                >
                                  {lecturer.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueManagement;