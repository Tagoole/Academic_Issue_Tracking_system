import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./new-password.css";
import API from "../api"; // Import the API instance from api.js

const NewPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get verification code from URL parameters
  const queryParams = new URLSearchParams(window.location.search);
  const verificationCode = queryParams.get("code");
  
  const navigate = useNavigate();

  useEffect(() => {
    // Get email from localStorage
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setError("Email address not found");
    }

    // Redirect to sign-in page if no verification code is provided
    if (!verificationCode) {
      setError("Invalid or missing verification code");
      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    }
  }, [verificationCode, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validate passwords
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!email) {
      setError("Email address is required");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call API to reset password with code, new password and email
      const response = await API.post("/api/final_password_reset/", {
        code: verificationCode,
        new_password: newPassword,
        email: email
      });
      
      setSuccess(true);
      
      // Redirect to sign-in page after successful password reset
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="new-password-container">
      <div className="new-password-form-container">
        <h1>Reset Your Password</h1>
        <p>Please enter your new password below</p>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Password reset successful! Redirecting to sign in...</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="new-password">New Password</label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
              disabled={isLoading || success}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              disabled={isLoading || success}
            />
          </div>
          
          <button 
            type="submit" 
            className="reset-button"
            disabled={isLoading || success}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        
        <div className="back-to-signin">
          <p>Remember your password? <span onClick={() => navigate("/signin")}>Sign In</span></p>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;