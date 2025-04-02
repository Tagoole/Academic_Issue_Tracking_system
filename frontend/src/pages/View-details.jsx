import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Navbar from './Navbar'; 

const Viewdetails = () => {
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('In-Progress');
  const navigate = useNavigate(); // Initialize useNavigate for navigation

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

  const handleSaveClick = () => {
    alert('Details saved successfully!');
    navigate('/dashboard'); // Navigate to the dashboard or another page after saving
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
            onClick={handleBackClick} // Navigate back when clicked
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
                1
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Student's Name</div>
              <div style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '10px', fontSize: '14px' }}>
                Kibuka Mark
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Issue Title</div>
              <div style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '10px', fontSize: '14px' }}>
                Wrong Marks
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Issue Category</div>
              <div style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '10px', fontSize: '14px' }}>
                Missing Marks
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Course Unit Code</div>
              <div style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '10px', fontSize: '14px' }}>
                CS 1100
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Course Unit Name</div>
              <div style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '10px', fontSize: '14px' }}>
                Software Development Project
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Issue Description</div>
              <div style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '10px', fontSize: '14px', minHeight: '60px' }}>
                You recorded an 80% yet I got a 95% in the operating systems test.
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
                  resize: 'none' 
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
              onClick={handleSaveClick} // Navigate to another page when clicked
              style={{ 
                width: '100%', 
                padding: '12px', 
                backgroundColor: '#4cd137', 
                color: 'white', 
                border: 'none', 
                borderRadius: '25px', 
                fontSize: '16px', 
                fontWeight: 'bold', 
                cursor: 'pointer' 
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Viewdetails;