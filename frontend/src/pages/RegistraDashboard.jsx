import React from 'react';
import './RegistraDashboard.css';
import Navbar from './NavBar'; 
import Sidebar from './Sidebar';

const RegistraDashboard = () => {
  const issues = [
    { id: 1, status: 'Resolved', studentNo: '25/U0000/PS', category: 'Missing Mark', date: '01/01/2025' }
  ];

  return (
    <div className="app-container" style={{ width: '1000px' }}>
      <Navbar />
      <div className="content-container">
        <Sidebar />
        <main className="main-content">
          
          <div className="dashboard-cards">
            <DashboardCard
              title="Pending issues"
              count={0}
              description="You currently have 0 pending issues"
            />
            <DashboardCard
              title="In-progress issues"
              count={0}
              description="You currently have 0 in-progress issues"
            />
            <DashboardCard
              title="Resolved issues"
              count={1}
              description="You currently have 1 resolved issue"
            />
          </div>

          <div className="issues-section">
            <div className="issues-header">
              <h2>My issues</h2>
              <div className="search-container">
                <input type="text" placeholder="search for issues" className="search-input" />
                <span className="search-icon"></span>
              </div>
              <button className="filter-button">
                <span>Filter</span>
                <span className="filter-icon">▼</span>
              </button>
            </div>

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
                    <tr key={issue.id}>
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
      </div>
    </div>
  );
};

// Dashboard Card Component
const DashboardCard = ({ title, count, description }) => {
  return (
    <div className="dashboard-card">
      <h3>{title}</h3>
      <div className="card-count">{count}</div>
      <p>{description}</p>
    </div>
  );
};

export default RegistraDashboard;