import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import API from '../api.js'; // Import API from your api.js file
import './signup.css';
import userIcon from '../assets/user.png';
import hiddenIcon from '../assets/hidden.png';
import visibleIcon from '../assets/visible.png';
import mailIcon from '../assets/mail.png';

const SignUp = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        confirm_password: '',
        gender: '',
        program: '',
        role: 'student', // Default role is student
        registration_token: '',
        agreeToTerms: false,
    });
    
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // List of available programs for the dropdown
    const programs = [
        "BSc Computer Science",
        "BSc Information Technology",
        "BSc Software Engineering",
        "BSc Data Science",
        "BSc Cybersecurity",
        "BSc Artificial Intelligence",
        "BA Business Information Systems",
        "BSc Computer Engineering",
        "BSc Network Administration",
        "MSc Computer Science",
        "MSc Information Technology",
        "MSc Data Science",
        "MSc Cybersecurity",
        "PhD Computer Science"
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirm_password) {
            setError("Passwords do not match");
            return;
        }
        
        setError(null);
        setSuccess(null);
        setIsSubmitting(true);
        
        // Determine which endpoint to use based on role
        const endpoint = formData.role === 'student' 
            ? `${API}/api/register_student_user/` 
            : `${API}/register_lect_and_registrar/`;
        
        // Prepare the form data based on role
        const submitData = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            username: formData.username,
            email: formData.email,
            password: formData.password,
            confirm_password: formData.confirm_password,
            gender: formData.gender,
            role: formData.role,
        };
        
        // Add role-specific fields
        if (formData.role === 'student') {
            submitData.program = formData.program;
        } else {
            submitData.registration_token = formData.registration_token;
        }
        
        console.log("Submitting form data to:", endpoint);
        
        try {
            const response = await axios.post(endpoint, submitData);
            
            setSuccess("User registered successfully!");
            
            // Handle role-based redirection after successful registration
            if (formData.role === 'student') {
                setTimeout(() => {
                    navigate('/verification');
                }, 1500);
            } else {
                setTimeout(() => {
                    navigate('/signin');
                }, 1500);
            }
            
            // Reset form after successful registration
            setFormData({
                first_name: '',
                last_name: '',
                username: '',
                email: '',
                password: '',
                confirm_password: '',
                gender: '',
                program: '',
                role: 'student',
                registration_token: '',
                agreeToTerms: false,
            });
        } catch (error) {
            console.error("API Error:", error);
            if (error.response && error.response.data) {
                setError(error.response.data.error || "Registration failed. Please try again.");
            } else {
                setError("Failed to connect to server. Please check your internet connection.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Check if the selected role is student
    const isStudent = formData.role === 'student';

    return (
        <div className="signup-page">
            <div className="left-side">
                <h2>Create an Account</h2>
                <h2>Please fill up this form</h2>
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
                                placeholder="Enter your first name" 
                                required 
                            />
                            <img src={userIcon} alt="User Icon" className="icon" />
                        </div>
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
                                placeholder="Enter your last name" 
                                required 
                            />
                            <img src={userIcon} alt="User Icon" className="icon" />
                        </div>
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
                                placeholder="Choose a username" 
                                required 
                            />
                            <img src={userIcon} alt="User Icon" className="icon" />
                        </div>
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
                    </div>
                    
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
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="confirm_password">Confirm Password</label>
                        <div className="input-container">
                            <input 
                                type={confirmPasswordVisible ? "text" : "password"} 
                                id="confirm_password" 
                                name="confirm_password" 
                                value={formData.confirm_password} 
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
                                <option value="" disabled>Select your gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
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
                                <option value="student">Student</option>
                                <option value="lecturer">Lecturer</option>
                                <option value="academic_registrar">Academic Registrar</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* Program dropdown for students only */}
                    {isStudent && (
                        <div className="form-group">
                            <label htmlFor="program">Program</label>
                            <div className="input-container">
                                <select 
                                    id="program" 
                                    name="program" 
                                    value={formData.program} 
                                    onChange={handleChange} 
                                    required
                                >
                                    <option value="" disabled>Select your program</option>
                                    {programs.map((program, index) => (
                                        <option key={index} value={program}>
                                            {program}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                    
                    {/* Registration token for non-students */}
                    {!isStudent && (
                        <div className="form-group">
                            <label htmlFor="registration_token">Registration Token</label>
                            <div className="input-container">
                                <input 
                                    type="text" 
                                    id="registration_token" 
                                    name="registration_token" 
                                    value={formData.registration_token} 
                                    onChange={handleChange} 
                                    placeholder="Enter registration token" 
                                    required 
                                />
                            </div>
                        </div>
                    )}
                    
                    <div className="form-group terms-group">
                        <input 
                            type="checkbox" 
                            id="terms" 
                            name="agreeToTerms" 
                            checked={formData.agreeToTerms} 
                            onChange={handleChange} 
                            required 
                        />
                        <label htmlFor="terms">I have read and understood the ATIS terms and conditions.</label>
                    </div>
                    
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                    
                    <button 
                        type="submit" 
                        className="sign-up-button" 
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;