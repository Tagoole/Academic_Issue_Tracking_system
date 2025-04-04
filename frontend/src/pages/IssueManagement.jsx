import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './NavBar';
import Sidebar from './Sidebar';
import './IssueManagement.css';
import backgroundimage from '../assets/backgroundimage.jpg';
import axios from 'axios'; // Import axios for API calls

const IssueManagement = () => {
  const [issueStatus, setIssueStatus] = useState('Pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLecturersDropdown, setShowLecturersDropdown] = useState(false);
  const [activeIssueId, setActiveIssueId] = useState(null);
  const [showActionsDropdown, setShowActionsDropdown] = useState(null);
  const [issues, setIssues] = useState([]); // Initialize as empty array to be populated by API
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const API_URL = 'http://127.0.0.1:8000/api/'; // Django API base URL

  // Sample lecturers data (static for now, could also be fetched from API if needed)
  const lecturers = [
    { id: 1, name: 'Dr. Sarah Johnson' },
    { id: 2, name: 'Prof. Michael Brown' },
    { id: 3, name: 'Dr. Elizabeth Taylor' },
    { id: 4, name: 'Prof. James Wilson' },
  ];

  // Fetch issues from the backend when the component mounts
  useEffect(() => {
    axios
      .get(`${API_URL}registrar_issue_management/`)
      .then((response) => {
        setIssues(response.data); // Set the fetched issues data
        console.log('Issues fetched successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error fetching issues:', error);
      });
  }, []); // Empty dependency array means it runs once on mount

  const filteredIssues = issues.filter((issue) =>
    issue.status === issueStatus &&
    (searchQuery === '' ||
      issue.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleStatusChange = (status) => {
    setIssueStatus(status);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleViewDetails = () => {
    navigate('/view-details');
  };

  const handleEscalateIssue = (issueId) => {
    setActiveIssueId(issueId);
    setShowLecturersDropdown(true);
    setShowActionsDropdown(null); // Close actions dropdown
  };

  const handleLecturerSelect = (lecturerId) => {
    const issue = issues.find((i) => i.id === activeIssueId);
    const lecturer = lecturers.find((l) => l.id === lecturerId);

    if (!issue || !lecturer) return;

    // Data to send to the backend (for escalation, assuming a separate endpoint exists)
    const escalationData = {
      issue_id: issue.id,
      student_name: issue.student_name,
      category: issue.category,
      submission_date: issue.submission_date,
      lecturer_name: lecturer.name,
      status: 'In-progress',
    };

    // Send POST request to escalate the issue (optional, not implemented here)
    axios
      .post(`${API_URL}escalate-issue/`, escalationData)
      .then((response) => {
        console.log('Issue escalated successfully:', response.data);
        setIssues((prevIssues) =>
          prevIssues.map((i) =>
            i.id === issue.id ? { ...i, status: 'In-progress' } : i
          )
        );
        setShowLecturersDropdown(false);
        navigate('/new-chat');
      })
      .catch((error) => {
        console.error('Error escalating issue:', error);
        setShowLecturersDropdown(false);
      });
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

  const mainContentStyle = {
    backgroundImage: `url(${backgroundimage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'relative',
  };

  return (
    <div className="app-container">
      <Navbar />
      <div className="content-container">
        <Sidebar />
        <div className="main-content" style={mainContentStyle}>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'transparent',
              zIndex: 1,
            }}
          ></div>
          <div className="issues-container" style={{ position: 'relative', zIndex: 2 }}>
            <h2 className="issues-title">
              Issues <span className="subtitle">(Kindly click on the issue to open it.)</span>
            </h2>

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
                    <td>{issue.student_name}</td>
                    <td>{issue.category}</td>
                    <td>{issue.submission_date}</td>
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
                            <button className="dropdown-item" onClick={handleViewDetails}>
                              <i className="view-icon"></i> View details
                            </button>
                            <button
                              className="dropdown-item"
                              onClick={() => handleEscalateIssue(issue.id)}
                            >
                              <i className="escalate-icon"></i> Escalate issue
                            </button>
                            <button className="dropdown-item">
                              <i className="edit-icon"></i> Edit issue
                            </button>
                            <button className="dropdown-item danger">
                              <i className="delete-icon"></i> Delete issue
                            </button>
                          </div>
                        )}

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
                                ×
                              </button>
                            </div>
                            <ul className="lecturers-list">
                              {lecturers.map((lecturer) => (
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