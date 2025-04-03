import React, { useState } from 'react';
import './signup.css';
import userIcon from '../assets/user.png';
import hiddenIcon from '../assets/hidden.png';
import visibleIcon from '../assets/visible.png';
import mailIcon from '../assets/mail.png';

// Updated API URL
const API_URL = 'http://127.0.0.1:8000/api';

const SignUp = () => {
    const [formData, setFormData] = useState({
        first_name:'a',
        last_name:'a',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        agreeToTerms: false,
    });
    
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setError(null);
        setSuccess(null);
        
        // Add this line here
        console.log("Submitting form data:", { username: formData.username, email: formData.email, password: formData.password, role: formData.role });
        
        try {
            const response = await fetch(`${API_URL}/register_student_user/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setSuccess("User registered successfully! Check your email for verification.");
                // Reset form after successful registration
                setFormData({
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    role: '',
                    agreeToTerms: false,
                });
            } else {
                setError(data.error || "Registration failed. Please try again.");
            }
        } catch (err) {
            console.error("API Error:", err);
            setError("Failed to connect to server. Please check your internet connection.");
        }
    };

    return (
        <div className="signup-page">
            <div className="left-side">
                <h2>Create an Account</h2>
                <h2>Please fill up this form</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Full Name</label>
                        <div className="input-container">
                            <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} placeholder="Enter your Full name" required />
                            <img src={userIcon} alt="User Icon" className="icon" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <div className="input-container">
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your Email" required />
                            <img src={mailIcon} alt="Mail Icon" className="icon" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-container">
                            <input type={passwordVisible ? "text" : "password"} id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required />
                            <img src={passwordVisible ? visibleIcon : hiddenIcon} alt="Toggle Password Visibility" className="icon" onClick={() => setPasswordVisible(!passwordVisible)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="input-container">
                            <input type={confirmPasswordVisible ? "text" : "password"} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" required />
                            <img src={confirmPasswordVisible ? visibleIcon : hiddenIcon} alt="Toggle Confirm Password Visibility" className="icon" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <div className="input-container">
                            <select id="role" name="role" value={formData.role} onChange={handleChange} required>
                                <option value="" disabled>Select your Role</option>
                                <option value="student">Student</option>
                                <option value="teacher">Lecturer</option>
                                <option value="other">Registrar</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group terms-group">
                        <input type="checkbox" id="terms" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} required />
                        <label htmlFor="terms">I have read and understood the ATIS terms and conditions.</label>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                    <button type="submit" className="sign-up-button">Sign Up</button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;