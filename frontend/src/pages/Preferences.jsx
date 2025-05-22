import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import makerereLogo from '../assets/makererelogo.png';
import './Preferences.css';
import NavBar from './NavBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Preferences = () => {
  const navigate = useNavigate();
  const [inAppMessaging, setInAppMessaging] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [userRole, setUserRole] = useState('');
  const [countdown, setCountdown] = useState(5);
  const [isRedirectCanceled, setIsRedirectCanceled] = useState(false);

  // Determine user role on component mount
  useEffect(() => {
    // Get user role from localStorage or any other source where you store user information
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  // Function to handle dashboard navigation based on user role
  const handleDashboardNavigation = (e) => {
    e.preventDefault();
    
    // Navigate based on user role
    switch(userRole?.toLowerCase()) {
      case 'student':
        navigate('/studentDashboard');
        break;
      case 'lecturer':
        navigate('/lecturerdashboard');
        break;
      case 'registrar':
        navigate('/registrarDashboard');
        break;
      default:
        // Default fallback if role is not found or recognized
        navigate('/dashboard');
        break;
    }
  };

  const toggleInAppMessaging = () => {
    setInAppMessaging(!inAppMessaging);

    // Show toast notification
    toast.info(
      `You have chosen to ${!inAppMessaging ? 'enable' : 'disable'} In-App Messaging. ${
        !inAppMessaging ? 'Messages will now be received in the app.' : ''
      }`,
      {
        autoClose: 3000,
      }
    );

    // Start countdown for redirection
    let countdownValue = 5;
    setCountdown(countdownValue);
    setIsRedirectCanceled(false);

    const interval = setInterval(() => {
      if (countdownValue > 0) {
        countdownValue -= 1;
        setCountdown(countdownValue);
      } else {
        clearInterval(interval);
        if (!isRedirectCanceled) {
          toast.info('Redirecting to the settings page...', {
            autoClose: 3000,
          });
          navigate('/settings');
        }
      }
    }, 1000);

    // Show toast with cancel button
    toast.info(
      <div>
        Redirecting to the settings page in <strong>{countdown}</strong> seconds.
        <button
          onClick={() => {
            clearInterval(interval);
            setIsRedirectCanceled(true);
            toast.dismiss(); // Dismiss the toast
          }}
          style={{
            marginLeft: '10px',
            padding: '5px 10px',
            background: '#ff3333',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>,
      {
        autoClose: false, // Keep the toast open until manually dismissed
      }
    );
  };

  const toggleEmailUpdates = () => {
    setEmailUpdates(!emailUpdates);

    // Show toast notification
    toast.info(
      `You have chosen to ${!emailUpdates ? 'enable' : 'disable'} Email Updates. ${
        !emailUpdates ? 'Messages will now be sent to your email.' : ''
      }`,
      {
        autoClose: 3000,
      }
    );

    // Start countdown for redirection
    let countdownValue = 5;
    setCountdown(countdownValue);
    setIsRedirectCanceled(false);

    const interval = setInterval(() => {
      if (countdownValue > 0) {
        countdownValue -= 1;
        setCountdown(countdownValue);
      } else {
        clearInterval(interval);
        if (!isRedirectCanceled) {
          toast.info('Redirecting to the settings page...', {
            autoClose: 3000,
          });
          navigate('/settings');
        }
      }
    }, 1000);

    // Show toast with cancel button
    toast.info(
      <div>
        Redirecting to the settings page in <strong>{countdown}</strong> seconds.
        <button
          onClick={() => {
            clearInterval(interval);
            setIsRedirectCanceled(true);
            toast.dismiss(); // Dismiss the toast
          }}
          style={{
            marginLeft: '10px',
            padding: '5px 10px',
            background: '#ff3333',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>,
      {
        autoClose: false, // Keep the toast open until manually dismissed
      }
    );
  };

  useEffect(() => {
    try {
      // Simulate successful page load
      toast.success('Preferences page loaded successfully!', {
        autoClose: 3000,
      });
    } catch (error) {
      // Redirect to dashboard if page fails to load
      toast.error('Failed to load preferences page. Redirecting to dashboard...', {
        autoClose: 3000,
      });
      setTimeout(() => navigate('/dashboard'), 3000); // Redirect after 3 seconds
    }
  }, [navigate]);

  return (
    <div
      className="settings-container"
      style={{
        background:'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    >
      {/* NavBar */}
      <NavBar />

      {/* Sidebar */}
      <div
        className="settings-sidebar"
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          padding: '25px 20px',
          zIndex: 10,
        }}
      >
        <div className="university-logo-sidebar">
          <img src={makerereLogo} alt="University Logo" className="logo-sidebar" />
        </div>

        {/* Back to Dashboard Button - Updated with role-based navigation */}
        <a href="#" className="menu-item back-to-dashboard" onClick={handleDashboardNavigation}>
          Back to Dashboard
          <svg viewBox="0 0 24 24" className="arrow-icon">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </a>

        {/* Change Password Button */}
        <a href="/changepassword" className="menu-item">
          Change Password
          <svg viewBox="0 0 24 24" className="arrow-icon">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </a>

        <a href="/preferences" className="menu-item active">
          Preferences
          <svg viewBox="0 0 24 24" className="arrow-icon">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </a>

        <a href="/help" className="menu-item">
          Support/Help
          <svg viewBox="0 0 24 24" className="arrow-icon">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </a>

        <a href="/delete-account" className="delete-account">
          Delete Account
          <svg viewBox="0 0 24 24" className="arrow-icon">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </a>
      </div>

      {/* Main Content */}
      <div
        className="main-content"
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          borderRadius: '15px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(5, 5, 5, 0.37)',
          padding: '30px',
          marginTop: '20px',
          maxWidth: '800px',
          width: '100%',
          zIndex: 5,
          marginLeft: '300px',
        }}
      >
        <div className="preferences-container">
          <div className="preferences-title">Preferences</div>
          <div className="user-role-info">
            Current User Role: {userRole || 'Not specified'}
          </div>

          <div className="menu-options">
            <div className="preference-section" style={{
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <div className="preference-title">In-App Messaging</div>
              <div className="preference-description">
                Click the toggle button to deactivate that field.
              </div>
              <div
                className={`toggle-switch ${inAppMessaging ? 'active' : ''}`}
                onClick={toggleInAppMessaging}
              >
                <div className="toggle-slider"></div>
              </div>
            </div>

            <div className="preference-section" style={{
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <div className="preference-title">Email Updates</div>
              <div className="preference-description">
                Click the toggle button to deactivate that field.
              </div>
              <div
                className={`toggle-switch ${emailUpdates ? 'active' : ''}`}
                onClick={toggleEmailUpdates}
              >
                <div className="toggle-slider"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
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

export default Preferences;