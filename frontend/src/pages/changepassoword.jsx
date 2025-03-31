import React, { useState } from 'react';
import './changepassword.css';

const ChangePassword = () => {
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate old password
    if (!passwordData.oldPassword.trim()) {
      newErrors.oldPassword = 'Old password is required';
    }
    
    // Validate new password
    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    // Validate confirm password
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage('');
    
    if (validateForm()) {
      // Simulate API call to change password
      console.log('Password change submitted:', passwordData);
      
      // Show success message
      setSuccessMessage('Password changed successfully!');
      
      // Reset form
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  return (
    <div className="change-password-container">
      <div className="change-password-form">
        <h1 className="form-title">Change Password</h1>
        <p className="form-subtitle">You will make permanent changes to your password</p>
        
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="oldPassword" className="form-label">Old Password</label>
            <div className="password-input-container">
              <input
                type={showPassword.oldPassword ? "text" : "password"}
                id="oldPassword"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handleChange}
                className={`form-input ${errors.oldPassword ? 'input-error' : ''}`}
                placeholder="Enter your current password"
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => togglePasswordVisibility('oldPassword')}
              >
                {showPassword.oldPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.oldPassword && <p className="error-text">{errors.oldPassword}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">New Password</label>
            <div className="password-input-container">
              <input
                type={showPassword.newPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handleChange}
                className={`form-input ${errors.newPassword ? 'input-error' : ''}`}
                placeholder="Enter new password"
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => togglePasswordVisibility('newPassword')}
              >
                {showPassword.newPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.newPassword && <p className="error-text">{errors.newPassword}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <div className="password-input-container">
              <input
                type={showPassword.confirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handleChange}
                className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                placeholder="Confirm new password"
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => togglePasswordVisibility('confirmPassword')}
              >
                {showPassword.confirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
          </div>
          
          <div className="help-section">
            <span className="help-text">Need Help?</span>
            <a href="/password-help" className="create-link">[Create]</a>
          </div>
          
          <button type="submit" className="submit-button">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
