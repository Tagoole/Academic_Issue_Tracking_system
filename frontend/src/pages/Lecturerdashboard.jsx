import React, { useState } from 'react';
import './Lecturerdashboard.css';
import Navbar from './NavBar'; 
import Sidebar2 from './Sidebar2';
import backgroundimage from "../assets/backgroundimage.jpg"; 
import backgroundImage from '../assets/backgroundimage.jpg'; 
import IssueSummary from './IssueSummary'; // Import IssueSummary component

const Lecturerdashboard = () => {
  const [selectedIssue, setSelectedIssue] = useState(null); // State to track selected issue

  const issues = [
    { id: 1, status: 'Resolved', studentNo: '25/U0000/PS', category: 'Missing Mark', date: '01/01/2025', title: 'Sample Issue', submissionDate: '2025-01-01', courseUnitName: 'Math 101', courseUnitCode: 'MATH101', assignedLecturer: 'Dr. John', description: 'Description of the issue' }
  ];

  const handleIssueClick = (issue) => {
    setSelectedIssue(issue); // Set the selected issue when clicked
  };

  return (
    <div
      className="app-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width:'1000px',
      }}
    >
      <Navbar />
      <div className="content-container">
        <Sidebar2 />
        <main className="main-content">
          {/* Your dashboard cards and issue table */}
          <div className="issues-section">
            <div className="issues-table">
              <table>
                <thead>
                  <tr>
                    <th>Issue ID</th>
                    <th>Status</th>
                    <th>Student No</th>
                    <th>Category</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map(issue => (
                    <tr key={issue.id} onClick={() => handleIssueClick(issue)}>
                      <td>{issue.id}</td>
                      <td>{issue.status}</td>
                      <td>{issue.studentNo}</td>
                      <td>{issue.category}</td>
                      <td>{issue.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
        {/* Conditionally render IssueSummary when an issue is clicked */}
        {selectedIssue && <IssueSummary issue={selectedIssue} />}
      </div>
    </div>
  );
};

export default Lecturerdashboard;
