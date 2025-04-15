import React, { useState, useRef, useEffect } from 'react';
import './Lecturerdashboard.css';
import Navbar from './NavBar';
import Sidebar2 from './Sidebar2';
import backgroundImage from '../assets/backgroundimage.jpg';
import IssueSummary from './IssueSummary';

const Lecturerdashboard = () => {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const summaryRef = useRef(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample issues data
  const allIssues = [
    { 
      id: 1, 
      status: 'Resolved', 
      studentNo: '25/U0000/PS', 
      category: 'Missing Mark', 
      date: '01/01/2025', 
      title: 'Sample Issue', 
      submissionDate: '2025-01-01', 
      courseUnitName: 'Math 101', 
      courseUnitCode: 'MATH101', 
      assignedLecturer: 'Dr. John', 
      description: 'Description of the issue' 
    },
    { 
      id: 2, 
      status: 'Pending', 
      studentNo: '25/U0001/PS', 
      category: 'Grade Appeal', 
      date: '02/01/2025', 
      title: 'Grade Review Request', 
      submissionDate: '2025-01-02', 
      courseUnitName: 'Physics 101', 
      courseUnitCode: 'PHYS101', 
      assignedLecturer: 'Dr. Smith', 
      description: 'Student requesting grade review for midterm exam' 
    },
    { 
      id: 3, 
      status: 'In Progress', 
      studentNo: '25/U0002/PS', 
      category: 'Technical Issue', 
      date: '03/01/2025', 
      title: 'Assignment Submission Problem', 
      submissionDate: '2025-01-03', 
      courseUnitName: 'Computer Science 101', 
      courseUnitCode: 'CS101', 
      assignedLecturer: 'Dr. Johnson', 
      description: 'Unable to submit assignment due to technical issue' 
    },
    { 
      id: 4, 
      status: 'Resolved', 
      studentNo: '25/U0003/PS', 
      category: 'Missing Mark', 
      date: '04/01/2025', 
      title: 'Missing Final Exam Score', 
      submissionDate: '2025-01-04', 
      courseUnitName: 'Biology 101', 
      courseUnitCode: 'BIO101', 
      assignedLecturer: 'Dr. Green', 
      description: 'Final exam mark not appearing in the system' 
    },
    { 
      id: 5, 
      status: 'Pending', 
      studentNo: '25/U0004/PS', 
      category: 'Missing Mark', 
      date: '05/01/2025', 
      title: 'Assignment 2 Not Graded', 
      submissionDate: '2025-01-05', 
      courseUnitName: 'Chemistry 101', 
      courseUnitCode: 'CHEM101', 
      assignedLecturer: 'Dr. Adams', 
      description: 'Assignment submitted but not graded yet' 
    }
  ];

  // Apply filters to issues
  const filteredIssues = allIssues.filter(issue => {
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || issue.category === categoryFilter;
    const matchesSearch = searchTerm === '' || 
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.studentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesCategory && matchesSearch;
  });

  // Handle issue click
  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Handle category filter change
  const handleCategoryFilterChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Effect to handle clicks outside the issue summary
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (summaryRef.current && !summaryRef.current.contains(event.target)) {
        setSelectedIssue(null);
      }
    };

    if (selectedIssue) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedIssue]);

  // Get unique categories and statuses for filter dropdowns
  const uniqueCategories = [...new Set(allIssues.map(issue => issue.category))];
  const uniqueStatuses = [...new Set(allIssues.map(issue => issue.status))];

  // Handler to close the issue summary from within
  const handleCloseSummary = () => {
    setSelectedIssue(null);
  };

  // Update issue status in the dashboard
  const updateIssueStatus = (issueId, newStatus) => {
    const updatedIssues = allIssues.map(issue => {
      if (issue.id === issueId) {
        return { ...issue, status: newStatus };
      }
      return issue;
    });
    
    // If you're using a state setter for allIssues, you'd use it here
    // setAllIssues(updatedIssues);
    
    // For now we'll just log the update
    console.log(`Issue ${issueId} status updated to ${newStatus}`);
    console.log('Updated issues:', updatedIssues);
  };

  return (
    <div className="app-container">
    
      <Navbar />
      <div className="content-container">
        <Sidebar2 />
        <main className="main-content">
          {/* Dashboard header with search and filter options */}
          <div className="dashboard-header">
            <h1>Issue Dashboard</h1>
            <div className="filter-controls">
              <div className="select-wrapper"> 
                <select 
                  className="status-filter" 
                  value={statusFilter} 
                  onChange={handleStatusFilterChange}
                >
                  <option value="all">All Statuses</option>
                  {uniqueStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <span className="dropdown-arrow"></span>
              </div>
              <div className="select-wrapper">
                <select 
                  className="category-filter" 
                  value={categoryFilter} 
                  onChange={handleCategoryFilterChange}
                >
                  <option value="all">All Categories</option>
                  {uniqueCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <span className="dropdown-arrow"></span>
              </div>

              <input 
                type="text" 
                placeholder="Search issues..." 
                className="search-input" 
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* Issues table section */}
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
                  {filteredIssues.length > 0 ? (
                    filteredIssues.map(issue => (
                      <tr 
                        key={issue.id} 
                        className={selectedIssue && selectedIssue.id === issue.id ? 'selected-row' : ''}
                      >
                        <td onClick={() => handleIssueClick(issue)}>{issue.id}</td>
                        <td onClick={() => handleIssueClick(issue)}>
                          <span className={`status-badge ${issue.status.toLowerCase().replace(' ', '-')}`}>
                            {issue.status}
                          </span>
                        </td>
                        <td onClick={() => handleIssueClick(issue)}>{issue.studentNo}</td>
                        <td onClick={() => handleIssueClick(issue)}>{issue.category}</td>
                        <td onClick={() => handleIssueClick(issue)}>{issue.date}</td>
                        <td>
                          {issue.status !== 'Resolved' && (
                            <button 
                              className="resolve-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = `/LecturerIssueManagement?issueId=${issue.id}`;
                              }}
                            >
                              Resolve Issue
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="no-issues">No issues match the current filters. Please try another search term</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* Issue Summary with ref for click outside detection */}
        {selectedIssue && (
          <div className="issue-summary-overlay">
            <div ref={summaryRef} className="issue-summary-container">
              <IssueSummary 
                issue={selectedIssue} 
                onClose={handleCloseSummary}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lecturerdashboard;
