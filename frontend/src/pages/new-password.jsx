import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./new-password.css";
import API from "../api"; // Import the API instance from api.js

const NewPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Get email from localStorage
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setError("Email address not found. Please restart the password reset process.");
      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validate passwords
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!email) {
      setError("Email address is required");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call API to reset password with new password fields and email
      const response = await API.post("/api/final_password_reset/", {
        password: password,
        confirm_password: confirmPassword,
        email: email
      });
      
      setSuccess(true);
      
      // Clear localStorage
      localStorage.removeItem('userEmail');
      
      // Redirect to sign-in page after successful password reset
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
      
    } catch (err) {
      if (err.response && err.response.data) {
        // Handle detailed error messages from the backend
        if (typeof err.response.data === 'string') {
          setError(err.response.data);
        } else if (err.response.data.non_field_errors) {
          setError(err.response.data.non_field_errors.join(', '));
        } else if (typeof err.response.data === 'object') {
          const errorMessages = Object.values(err.response.data)
            .flat()
            .filter(val => val)
            .join('. ');
          setError(errorMessages || "Failed to reset password. Please try again.");
        } else {
          setError("Failed to reset password. Please try again.");
        }
      } else {
        setError("Failed to connect to the server. Please check your internet connection.");
      }
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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