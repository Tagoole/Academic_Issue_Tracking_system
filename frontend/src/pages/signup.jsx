import React, { useState } from 'react';
import './signup.css';
import userIcon from '../assets/user.png';
import hiddenIcon from '../assets/hidden.png';
import visibleIcon from '../assets/visible.png';
import mailIcon from '../assets/mail.png';
import API from '../api.js'; 

const SignUp = () => {
    const [formData, setFormData] = useState({
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
        
        try {
            const response = await fetch(`${API}/register_student_user/`, {
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
                alert("User registered successfully! Check your email for verification.");
            } else {
                setError(data.error || "Something went wrong");
            }
        } catch (err) {
            setError("Failed to connect to server");
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
                    <button type="submit" className="sign-up-button">Sign Up</button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
