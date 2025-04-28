import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import makerereLogo from '../assets/makererelogo.png';
import './Deleteaccount.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DeleteAccount = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [pageLoadError, setPageLoadError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      // Check authentication on page load
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        navigate('/signin');
        return;
      }
      
      // Simulate successful page load
      toast.success('Delete Account page loaded successfully!', {
        autoClose: 3000,
      });
    } catch (error) {
      // Handle page load failure
      setPageLoadError(true);
      toast.error('Failed to load Delete Account page. Please try again later.', {
        autoClose: 3000,
      });
    }
  }, [navigate]);

  const handleDeleteAccount = () => {
    setShowConfirmModal(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      
      // Get user ID from local storage
      const userId = localStorage.getItem('userId');
      const accessToken = localStorage.getItem('accessToken');
      
      if (!userId || !accessToken) {
        throw new Error('Authentication information not found. Please log in again.');
      }
      
      // Set the authorization header
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      // Send delete request to Django backend using the correct endpoint
      // and passing userId in the request body as expected by the view
      await API.delete('/api/delete_account/', {
        data: { userId: userId }  // This is important for DELETE requests with a body
      });
      
      // Clear all data from local storage
      localStorage.removeItem('userId');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user'); // Remove any other user-related data
      
      setShowConfirmModal(false);
      
      // Show success message
      toast.success('Account deleted successfully', {
        autoClose: 2000,
        onClose: () => {
          // Navigate to the landing page after toast is closed or times out
          navigate('/');
        }
      });
      
    } catch (err) {
      // Handle errors, including token refresh if necessary
      if (err.response && err.response.status === 401) {
        // Try refreshing the token
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          
          if (refreshToken) {
            const refreshResponse = await API.post('/api/refresh_token/', {
              refresh: refreshToken
            });
            
            // Store the new access token
            const newAccessToken = refreshResponse.data.access;
            localStorage.setItem('accessToken', newAccessToken);
            
            // Retry the delete operation with new token
            API.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            
            // Retry the delete request with refreshed token
            await API.delete('/api/delete_account/', {
              data: { userId: localStorage.getItem('userId') }
            });
            
            // Clear local storage and navigate away
            localStorage.clear();
            setShowConfirmModal(false);
            
            toast.success('Account deleted successfully', {
              autoClose: 2000,
              onClose: () => navigate('/')
            });
            
            return;
          }
        } catch (refreshErr) {
          console.error('Error refreshing token:', refreshErr);
          setError('Your session has expired. Please log in again.');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          
          // Give user time to see the error before redirecting
          setTimeout(() => navigate('/signin'), 3000);
          return;
        }
      }
      
      // Handle other error cases
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          err.response?.data?.detail || 
                          err.message || 
                          'Failed to delete account';
      setError(errorMessage);
      console.error('Error deleting account:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDeleteAccount = () => {
    setShowConfirmModal(false);
    setError(null);
  };

  return (
    <div className="settings-container" style={{
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              minHeight: '100vh',
              width: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
     }}>
      <div className="settings-sidebar glass-effect">
        <div className="university-logo-sidebar">
          <img src={makerereLogo} alt="Makerere University Logo" className="logo-sidebar" />
        </div>

        {/* Back to Dashboard Button */}
        <Link to="/lecturerdashboard" className="menu-item">
          Back to Dashboard
          <svg viewBox="0 0 24 24" className="arrow-icon">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </Link>

        <Link to="/changepassword" className="menu-item">
          Change Password
          <svg viewBox="0 0 24 24" className="arrow-icon">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </Link>

        <Link to="/preferences" className="menu-item">
          Preferences
          <svg viewBox="0 0 24 24" className="arrow-icon">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </Link>

        <Link to="/help" className="menu-item">
          Support/Help
          <svg viewBox="0 0 24 24" className="arrow-icon">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </Link>

        <Link to="/deleteaccount" className="menu-item active">
          Delete Account
          <svg viewBox="0 0 24 24" className="arrow-icon">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </Link>
      </div>

      <div className="main-content glass-effect">
        <h1 className="delete-account-title">Delete Account</h1>

        <div className="delete-account-content">
          <div className="trash-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#ff3333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </div>

          <div className="delete-account-description">
            <p>You are about to delete your account permanently. This action cannot be undone.</p>
            <p>All your data, including personal information, saved preferences, and history will be removed from our system.</p>
          </div>

          <div className="delete-account-button-container">
            <button
              className="delete-account-button pulse"
              onClick={handleDeleteAccount}
            >
              Delete My Account
            </button>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-effect">
            <h2>Are you absolutely sure?</h2>
            <p>This action cannot be undone. This will permanently delete your account and remove all data associated with it.</p>
            {error && <p className="error-message">{error}</p>}
            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={cancelDeleteAccount}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="confirm-delete-btn"
                onClick={confirmDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'I understand, delete my account'}
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default DeleteAccount;