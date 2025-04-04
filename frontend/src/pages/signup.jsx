import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup.css';
import userIcon from '../assets/user.png';
import hiddenIcon from '../assets/hidden.png';
import visibleIcon from '../assets/visible.png';
import mailIcon from '../assets/mail.png';

// Updated API URL
const API_URL = 'http://127.0.0.1:8000/api';

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name:'a',
        last_name:'a',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        gender: '',
        program: '',
        city: '',
        token: '',
        agreeToTerms: false,
    });

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        // Special handling for role field to ensure we use consistent naming
        if (name === 'role') {
            let roleValue = value;
            // Update role value for consistency with login component
            if (value === 'other') {
                roleValue = 'registrar'; // Map 'other' to 'registrar' for consistency
            }
            
            setFormData({
                ...formData,
                [name]: roleValue,
            });
        } else {
            setFormData({
                ...formData,
                [name]: type === 'checkbox' ? checked : value,
            });
        }
        
        // Clear error for this field when it's changed
        if (errors[name]) {
            setErrors(prevErrors => {
                const updatedErrors = {...prevErrors};
                delete updatedErrors[name];
                return updatedErrors;
            });
        }

        // Clear success message when the user starts editing
        if (successMessage) {
            setSuccessMessage('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setErrors({confirmPassword: ['Passwords do not match']});
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

    // Debug view for development only
    const renderDebugView = () => {
        if (!debugResponse) return null;
        
        return (
            <div className="debug-panel" style={{
                padding: '15px',
                margin: '20px 0',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '4px',
                overflow: 'auto',
                maxHeight: '300px'
            }}>
                <h4>Debug Response Data:</h4>
                <pre style={{ whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(debugResponse, null, 2)}
                </pre>
            </div>
        );
    };

    return (
        <div className="signup-page">
            <div className="left-side">
                <h2>Create an Account</h2>
                <h2>Please fill up this form</h2>
                
                {/* Success message display */}
                {successMessage && (
                    <div className="success-message">
                        {successMessage}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="first_name">First Name</label>
                        <div className="input-container">
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                placeholder="Enter your First Name"
                                required
                            />
                        </div>
                        {errors.first_name && <p className="error-message">{errors.first_name.join(', ')}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="last_name">Last Name</label>
                        <div className="input-container">
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                placeholder="Enter your Last Name"
                                required
                            />
                        </div>
                        {errors.last_name && <p className="error-message">{errors.last_name.join(', ')}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <div className="input-container">
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter your Username"
                                required
                            />
                            <img src={userIcon} alt="User Icon" className="icon" />
                        </div>
                        {errors.username && <p className="error-message">{errors.username.join(', ')}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <div className="input-container">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your Email"
                                required
                            />
                            <img src={mailIcon} alt="Mail Icon" className="icon" />
                        </div>
                        {errors.email && <p className="error-message">{errors.email.join(', ')}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="city">City</label>
                        <div className="input-container">
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="Enter your City"
                                required
                            />
                        </div>
                        {errors.city && <p className="error-message">{errors.city.join(', ')}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="gender">Gender</label>
                        <div className="input-container">
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Select your Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="prefer_not_to_say">Prefer not to say</option>
                            </select>
                        </div>
                        {errors.gender && <p className="error-message">{errors.gender.join(', ')}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <div className="input-container">
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Select your Role</option>
                                <option value="student">Student</option>
                                <option value="teacher">Lecturer</option>
                                <option value="registrar">Registrar</option>
                            </select>
                        </div>
                        {errors.role && <p className="error-message">{errors.role.join(', ')}</p>}
                    </div>

                    {/* Program field that appears only for students */}
                    {showProgramField && (
                        <div className="form-group">
                            <label htmlFor="program">Program</label>
                            <div className="input-container">
                                <select
                                    id="program"
                                    name="program"
                                    value={formData.program}
                                    onChange={handleChange}
                                    required={formData.role === 'student'}
                                >
                                    <option value="" disabled>Select your Program</option>
                                    {programOptions.map(program => (
                                        <option key={program.id} value={program.id}>
                                            {program.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errors.program && <p className="error-message">{errors.program.join(', ')}</p>}
                        </div>
                    )}

                    {/* Token field that appears only for lecturer/registrar */}
                    {showTokenField && (
                        <div className="form-group">
                            <label htmlFor="token">Authorization Token</label>
                            <div className="input-container">
                                <input
                                    type="text"
                                    id="token"
                                    name="token"
                                    value={formData.token}
                                    onChange={handleChange}
                                    placeholder="Enter your authorization token"
                                    required
                                />
                            </div>
                            {errors.token && <p className="error-message">{errors.token.join(', ')}</p>}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-container">
                            <input
                                type={passwordVisible ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                            />
                            <img
                                src={passwordVisible ? visibleIcon : hiddenIcon}
                                alt="Toggle Password Visibility"
                                className="icon"
                                onClick={() => setPasswordVisible(!passwordVisible)}
                            />
                        </div>
                        {errors.password && <p className="error-message">{errors.password.join(', ')}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="input-container">
                            <input
                                type={confirmPasswordVisible ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                required
                            />
                            <img
                                src={confirmPasswordVisible ? visibleIcon : hiddenIcon}
                                alt="Toggle Confirm Password Visibility"
                                className="icon"
                                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                            />
                        </div>
                        {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.join(', ')}</p>}
                        {errors.confirm_password && <p className="error-message">{errors.confirm_password.join(', ')}</p>}
                    </div>
                    <div className="form-group terms-group">
                        <input
                            type="checkbox"
                            id="terms"
                            name="agreeToTerms"
                            checked={formData.agreeToTerms}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="terms" className="terms-text">I have read and understood the ATIS terms and conditions.</label>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                    <button type="submit" className="sign-up-button">Sign Up</button>
                </form>
                
                {/* Debug view in development mode */}
                {process.env.NODE_ENV === 'development' && renderDebugView()}
            </div>
        </div>
    );
};

export default SignUp;