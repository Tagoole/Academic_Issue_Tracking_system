import React, { useState } from 'react';
import profilePic from '../assets/profile.png';
import settingsIcon from '../assets/settings.png';
import makerereLogo from '../assets/makerere.logo.png';
import issueIcon from '../assets/issue.png';
import dashboardIcon from '../assets/dashboard.png';
import './StudentDashboard.css';

const StudentDashboard = () => {
    const [activeTab, setActiveTab] = useState('Pending');
    const [issues, setIssues] = useState([
        {
            id: 1,
            studentName: 'Ssemuka Yasin',
            category: 'Missing Marks',
            submissionDate: '15/09/2025',
            status: 'Pending'
        }
    ]);

    return (
        <div className="tracker-container">
            <header className="tracker-header">
                <div className="student-dashboard-title">STUDENT'S DASHBOARD</div>
                <div className="header-content">
                    <div className="profile-section">
                        <div className="profile-pic">
                            <img src={profilePic} alt="Profile" />
                        </div>
                        <div className="profile-name">[First Name]</div>
                    </div>

                    <div className="search-container">
                        <input type="text" placeholder="Search for anything..." className="search-input" />
                        <button className="search-button">
                            <i className="search-icon">⚲</i>
                        </button>
                    </div>

                    <div className="notification-icon">
                        <i>🔔</i>
                    </div>

                    <div className="system-title">Academic Issue Tracking System</div>

                    <div className="logo">
                        <img src={makerereLogo} alt="University Logo" />
                    </div>
                </div>
            </header>

            <nav className="horizontal-navigation">
                <div className={`nav-item ${activeTab === 'Dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('Dashboard')}>
                    <img src={dashboardIcon} alt="Dashboard" className="nav-icon" />
                    <span>Dashboard</span>
                </div>
                <div className={`nav-item ${activeTab === 'Issues' ? 'active' : ''}`} onClick={() => setActiveTab('Issues')}>
                    <img src={issueIcon} alt="Issues" className="nav-icon" />
                    <span>Issues</span>
                </div>
                <div className={`nav-item ${activeTab === 'Profile' ? 'active' : ''}`} onClick={() => setActiveTab('Profile')}>
                    <img src={profilePic} alt="Profile" className="nav-icon" />
                    <span>Profile</span>
                </div>
                <div className={`nav-item ${activeTab === 'Settings' ? 'active' : ''}`} onClick={() => setActiveTab('Settings')}>
                    <img src={settingsIcon} alt="Settings" className="nav-icon" />
                    <span>Settings</span>
                </div>
                <div className={`nav-item ${activeTab === 'Help' ? 'active' : ''}`} onClick={() => setActiveTab('Help')}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Help & support</span>
                </div>
                <div className={`nav-item ${activeTab === 'Logout' ? 'active' : ''}`} onClick={() => setActiveTab('Logout')}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15M10 17L15 12M15 12L10 7M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Logout</span>
                </div>
            </nav>

            <main className="main-content">
                <div className="assigned-issues-section">
                    <h2 className="assigned-issues-title">
                        Assigned Issues <span className="subtitle">(Kindly click on the issue to open it.)</span>
                    </h2>

                    <div className="tabs">
                        {['Pending', 'In-progress', 'Resolved'].map(tab => (
                            <div
                                key={tab}
                                className={`tab ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </div>
                        ))}
                    </div>

                    <div className="issues-container">
                        <div className="issues-header">
                            <h3>Issues</h3>
                            <div className="issues-controls">
                                <div className="issues-search">
                                    <input type="text" placeholder="Search for issues..." />
                                    <button className="search-button">
                                        <i className="search-icon">⚲</i>
                                    </button>
                                </div>
                                <button className="filter-button">
                                    <i className="filter-icon">⊳</i>
                                    Filter
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
                                </tr>
                            </thead>
                            <tbody>
                                {issues
                                    .filter(issue => issue.status === activeTab)
                                    .map(issue => (
                                        <tr key={issue.id} className="issue-row">
                                            <td>{issue.id}</td>
                                            <td>{issue.studentName}</td>
                                            <td>{issue.category}</td>
                                            <td>{issue.submissionDate}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;