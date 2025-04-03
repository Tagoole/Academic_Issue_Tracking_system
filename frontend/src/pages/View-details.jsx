import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Added useParams to get the issue ID from URL
import Navbar from './NavBar'; 
import API from '../api.js'; // Assuming you have an API service similar to the signup component

const Viewdetails = () => {
  const { id } = useParams(); // Get the issue ID from URL params
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('In-Progress');
  const [isLoading, setIsLoading] = useState(false);
  const [issueDetails, setIssueDetails] = useState({
    id: '1',
    studentName: 'Kibuka Mark',
    issueTitle: 'Wrong Marks',
    issueCategory: 'Missing Marks',
    courseUnitCode: 'CS 1100',
    courseUnitName: 'Software Development Project',
    description: 'You recorded an 80% yet I got a 95% in the operating systems test.',
    lecturerName: 'Dr. Sarah Johnson',
    attachment: null
  });
  const navigate = useNavigate();

  // Fetch issue details on component mount
  useEffect(() => {
    // This would be implemented to fetch actual data from your backend
    // const fetchIssueDetails = async () => {
    //   try {
    //     const response = await API.get(`/api/issues/${id}`);
    //     setIssueDetails(response.data);
    //   } catch (error) {
    //     console.error("Error fetching issue details:", error);
    //   }
    // };
    
    // fetchIssueDetails();
  }, [id]);

  const backgroundStyle = {
    backgroundImage: "url('../assets/backgroundimage.jpg')", 
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    padding: '20px'
  };

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleSaveClick = async () => {
    setIsLoading(true);
    try {
      // Prepare the update data
      const updateData = {
        id: issueDetails.id, // Include the issue ID
        status: status,
        registrarComment: comment
        // Include any attachment data if implemented
      };

      // Make API call to update the issue
      const response = await API.put(`/api/issues/${issueDetails.id}`, updateData);
      
      if (response.status === 200) {
        alert('Issue details updated successfully!');
        navigate('/dashboard'); // Navigate to the dashboard after saving
      } else {
        alert('Failed to update issue. Please try again.');
      }
    } catch (error) {
      console.error("Error updating issue:", error);
      alert('An error occurred while updating the issue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={backgroundStyle}>
      {/* Include the Navbar component */}
      <Navbar />
      
      <div style={{ 
        maxWidth: '650px', 
        margin: '20px auto', 
        borderRadius: '15px', 
        overflow: 'hidden', 
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', 
        backgroundColor: 'white'
      }}>
        {/* Header Bar */}
        <div style={{ display: 'flex', width: '100%', borderBottom: '1px solid #e0e0e0', alignItems: 'center', padding: '10px' }}>
          <div 
            style={{ display: 'flex', alignItems: 'center', borderRight: '1px solid #e0e0e0', paddingRight: '15px', cursor: 'pointer' }}
            onClick={handleBackClick}
          >
            <span style={{ color: 'green', fontSize: '20px', marginRight: '5px' }}>←</span>
            <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Back</span>
          </div>
          <div style={{ marginLeft: '15px', fontSize: '14px' }}>
            This issue has been escalated!
          </div>
          <div style={{ marginLeft: 'auto', fontSize: '20px' }}>
            ↗
          </div>
        </div>

        <div style={{ display: 'flex', width: '100%' }}>
          {/* Left Column - Issue Details */}
          <div style={{ flex: 1, padding: '15px', borderRight: '1px solid #e0e0e0' }}>
            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Issue ID</div>
              <div style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '10px', fontSize: '14px' }}>
                {issueDetails.id}
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Student's Name</div>
              <div style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '10px', fontSize: '14px' }}>
                {issueDetails.studentName}
              </div>
            </div>

            {/* New field for Lecturer's Name */}
            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Lecturer's Name</div>
              <div style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '10px', fontSize: '14px' }}>
                {issueDetails.lecturerName}
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Issue Title</div>
              <div style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '10px', fontSize: '14px' }}>
                {issueDetails.issueTitle}
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Issue Category</div>
              <div style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '10px', fontSize: '14px' }}>
                {issueDetails.issueCategory}
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Course Unit Code</div>
              <div style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '10px', fontSize: '14px' }}>
                {issueDetails.courseUnitCode}
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Course Unit Name</div>
              <div style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '10px', fontSize: '14px' }}>
                {issueDetails.courseUnitName}
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Issue Description</div>
              <div style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '10px', fontSize: '14px', minHeight: '60px' }}>
                {issueDetails.description}
              </div>
            </div>
          </div>

          {/* Right Column - Registrar Section */}
          <div style={{ flex: 1, padding: '15px' }}>
            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Attachments</div>
              <div style={{ border: '1px solid #ddd', borderRadius: '5px', overflow: 'hidden' }}>
                <img 
                  src="/api/placeholder/320/240" 
                  alt="Test paper with marks" 
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '10px', fontSize: '14px', color: '#666' }}>
              (Registrar's Use)
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Registrar's Comment</div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter your comment about this issue."
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #ddd', 
                  borderRadius: '8px', 
                  fontSize: '14px', 
                  resize: 'none',
                  minHeight: '100px'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Status Update</div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  border: '1px solid #ddd', 
                  borderRadius: '8px' 
                }}
              >
                <option value="In-Progress">In-Progress</option>
                <option value="Pending">Pending</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Attachments</div>
              <div style={{ 
                border: '1px dashed #ddd', 
                borderRadius: '5px', 
                padding: '20px', 
                textAlign: 'center' 
              }}>
                <div style={{ fontSize: '24px', color: '#666', marginBottom: '10px' }}>
                  ↑
                </div>
                <div style={{ fontSize: '12px', color: 'red', marginBottom: '5px' }}>
                  Upload a file or drag and drop
                </div>
                <div style={{ fontSize: '10px', color: '#999' }}>
                  PNG, JPG up to 10MB
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveClick}
              disabled={isLoading}
              style={{ 
                width: '100%', 
                padding: '12px', 
                backgroundColor: '#4cd137', 
                color: 'white', 
                border: 'none', 
                borderRadius: '25px', 
                fontSize: '16px', 
                fontWeight: 'bold', 
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? 'Updating...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Viewdetails;