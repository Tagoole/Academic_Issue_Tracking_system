import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import API from '../api.js'; 
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
        role: 'student', 
        registration_token: '',
        agreeToTerms: false,
    });
    
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [error, setError] = useState(null);
    const [errorFields, setErrorFields] = useState({});
    const [success, setSuccess] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [programs, setPrograms] = useState([]);
    const [isLoadingPrograms, setIsLoadingPrograms] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState(''); // 'success' or 'error'
    const [alertMessage, setAlertMessage] = useState('');

    // Fetch programs from backend when component mounts
    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                setIsLoadingPrograms(true);
                const response = await API.get('api/program/');
                setPrograms(response.data);
                setIsLoadingPrograms(false);
            } catch (error) {
                console.error("Failed to fetch programs:", error);
                showErrorAlert("Failed to load programs. Please refresh the page.");
                setIsLoadingPrograms(false);
            }
        };

        fetchPrograms();
    }, []);

    // Hide alert after 5 seconds
    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => {
                setShowAlert(false);
            }, 5000);
            
            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    const showSuccessAlert = (message) => {
        setAlertType('success');
        setAlertMessage(message);
        setShowAlert(true);
    };

    const showErrorAlert = (message) => {
        setAlertType('error');
        setAlertMessage(message);
        setShowAlert(true);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
        
        // Clear errors for this field when user makes changes
        if (errorFields[name]) {
            setErrorFields({
                ...errorFields,
                [name]: null
            });
        }
    };

    const validateForm = () => {
        const errors = {};
        
        // Password validation
        if (formData.password !== formData.confirm_password) {
            errors.confirm_password = "Passwords do not match";
        }
        
        if (formData.password.length < 8) {
            errors.password = "Password must be at least 8 characters long";
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            errors.email = "Please enter a valid email address";
        }
        
        // Username validation
        if (formData.username.length < 3) {
            errors.username = "Username must be at least 3 characters long";
        }
        
        // Program validation for students
        if (formData.role === 'student' && !formData.program) {
            errors.program = "Please select a program";
        }
        
        // Registration token validation for non-students
        if (formData.role !== 'student' && !formData.registration_token) {
            errors.registration_token = "Registration token is required";
        }
        
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrorFields(validationErrors);
            const firstError = Object.values(validationErrors)[0];
            showErrorAlert(firstError);
            return;
        }
        
        setError(null);
        setErrorFields({});
        setSuccess(null);
        setIsSubmitting(true);
        
        // Determine which endpoint to use based on role
        const endpoint = formData.role === 'student' 
            ? '/api/register_student_user/' 
            : '/api/register_lect_and_registrar/';
        
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
            const response = await API.post(endpoint, submitData);
            
            setSuccess("User registered successfully!");
            showSuccessAlert("Registration successful! Redirecting...");
            
            // Save email to localStorage for verification page
            localStorage.setItem('userEmail', formData.email);
            
            // Handle role-based redirection after successful registration
            if (formData.role === 'student') {
                setTimeout(() => {
                    // Pass email in navigation state for verification page
                    navigate('/verification', { 
                        state: { email: formData.email }
                    });
                }, 2000);
            } else {
                setTimeout(() => {
                    navigate('/signin');
                }, 2000);
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
            
            // Handle different types of API error responses
            if (error.response) {
                if (error.response.data) {
                    const serverErrors = error.response.data;
                    
                    // Check if the error is a detailed validation error object
                    if (typeof serverErrors === 'object' && !Array.isArray(serverErrors)) {
                        const fieldErrors = {};
                        let generalError = "";
                        
                        // Process each field error
                        Object.keys(serverErrors).forEach(key => {
                            if (key === 'error' || key === 'detail' || key === 'non_field_errors') {
                                generalError = serverErrors[key];
                            } else {
                                fieldErrors[key] = Array.isArray(serverErrors[key]) 
                                    ? serverErrors[key][0] 
                                    : serverErrors[key];
                            }
                        });
                        
                        if (Object.keys(fieldErrors).length > 0) {
                            setErrorFields(fieldErrors);
                            const firstFieldError = Object.values(fieldErrors)[0];
                            showErrorAlert(firstFieldError);
                        } else if (generalError) {
                            setError(generalError);
                            showErrorAlert(generalError);
                        } else {
                            setError("Registration failed. Please check your information and try again.");
                            showErrorAlert("Registration failed. Please check your information and try again.");
                        }
                    } else if (typeof serverErrors === 'string') {
                        setError(serverErrors);
                        showErrorAlert(serverErrors);
                    } else if (serverErrors.error) {
                        setError(serverErrors.error);
                        showErrorAlert(serverErrors.error);
                    } else {
                        setError("Registration failed. Please try again.");
                        showErrorAlert("Registration failed. Please try again.");
                    }
                } else {
                    setError(`Server error: ${error.response.status}`);
                    showErrorAlert(`Server error (${error.response.status}). Please try again later.`);
                }
            } else if (error.request) {
                // Request was made but no response received
                setError("No response from server. Please check your internet connection.");
                showErrorAlert("No response from server. Please check your internet connection.");
            } else {
                // Something happened in setting up the request
                setError("Request error. Please try again.");
                showErrorAlert("Request error. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Check if the selected role is student
    const isStudent = formData.role === 'student';

    return (
        <div className="signup-page">
            {/* Alert popup */}
            {showAlert && (
                <div className={`alert alert-${alertType}`}>
                    <span className="alert-message">{alertMessage}</span>
                    <button 
                        className="alert-close-btn" 
                        onClick={() => setShowAlert(false)}
                    >
                        &times;
                    </button>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="signup-form">
                <div className="left-side">
                    <h2>Create an Account</h2>
                    <h2>Please fill up this form</h2>
                    
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
                                className={errorFields.first_name ? 'input-error' : ''}
                            />
                            <img src={userIcon} alt="User Icon" className="icon" />
                        </div>
                        {errorFields.first_name && (
                            <p className="field-error-message">{errorFields.first_name}</p>
                        )}
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
                                className={errorFields.last_name ? 'input-error' : ''}
                            />
                            <img src={userIcon} alt="User Icon" className="icon" />
                        </div>
                        {errorFields.last_name && (
                            <p className="field-error-message">{errorFields.last_name}</p>
                        )}
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
                                className={errorFields.username ? 'input-error' : ''}
                            />
                            <img src={userIcon} alt="User Icon" className="icon" />
                        </div>
                        {errorFields.username && (
                            <p className="field-error-message">{errorFields.username}</p>
                        )}
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
                                className={errorFields.email ? 'input-error' : ''}
                            />
                            <img src={mailIcon} alt="Mail Icon" className="icon" />
                        </div>
                        {errorFields.email && (
                            <p className="field-error-message">{errorFields.email}</p>
                        )}
                    </div>
                </div>
                
                <div className="right-side">
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
                                className={errorFields.password ? 'input-error' : ''}
                            />
                            <img 
                                src={passwordVisible ? visibleIcon : hiddenIcon} 
                                alt="Toggle Password Visibility" 
                                className="icon" 
                                onClick={() => setPasswordVisible(!passwordVisible)} 
                            />
                        </div>
                        {errorFields.password && (
                            <p className="field-error-message">{errorFields.password}</p>
                        )}
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
                                className={errorFields.confirm_password ? 'input-error' : ''}
                            />
                            <img 
                                src={confirmPasswordVisible ? visibleIcon : hiddenIcon} 
                                alt="Toggle Confirm Password Visibility" 
                                className="icon" 
                                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)} 
                            />
                        </div>
                        {errorFields.confirm_password && (
                            <p className="field-error-message">{errorFields.confirm_password}</p>
                        )}
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
                                className={errorFields.gender ? 'input-error' : ''}
                            >
                                <option value="" disabled>Select your gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        {errorFields.gender && (
                            <p className="field-error-message">{errorFields.gender}</p>
                        )}
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
                                className={errorFields.role ? 'input-error' : ''}
                            >
                                <option value="student">Student</option>
                                <option value="lecturer">Lecturer</option>
                                <option value="academic_registrar">Academic Registrar</option>
                            </select>
                        </div>
                        {errorFields.role && (
                            <p className="field-error-message">{errorFields.role}</p>
                        )}
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
                                    disabled={isLoadingPrograms}
                                    className={errorFields.program ? 'input-error' : ''}
                                >
                                    <option value="" disabled>
                                        {isLoadingPrograms ? "Loading programs..." : "Select your program"}
                                    </option>
                                    {programs.map((program, index) => (
                                        <option key={index} value={program.id || ''}>
                                            {program.program_name || 'Unknown Program'}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errorFields.program && (
                                <p className="field-error-message">{errorFields.program}</p>
                            )}
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
                                    className={errorFields.registration_token ? 'input-error' : ''}
                                />
                            </div>
                            {errorFields.registration_token && (
                                <p className="field-error-message">{errorFields.registration_token}</p>
                            )}
                        </div>
                    )}
                </div>
                
                <div className="form-footer">
                    <div className="form-group terms-group">
                        <input 
                            type="checkbox" 
                            id="terms" 
                            name="agreeToTerms" 
                            checked={formData.agreeToTerms} 
                            onChange={handleChange} 
                            required 
                            className={errorFields.agreeToTerms ? 'input-error' : ''}
                        />
                        <label htmlFor="terms">I have read and understood the ATIS terms and conditions.</label>
                        {errorFields.agreeToTerms && (
                            <p className="field-error-message">{errorFields.agreeToTerms}</p>
                        )}
                    </div>
                    
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                    
                    <button 
                          type="submit" 
                           className="sign-up-button" 
                            disabled={isSubmitting || (isStudent && isLoadingPrograms)}
                             style={{ cursor: isSubmitting || (isStudent && isLoadingPrograms) ? 'not-allowed' : 'pointer' }}>
                              <span>{isSubmitting ? 'Signing Up...' : 'Sign Up'}</span>
                            </button>
                    
                    <div className="bottom-text">
                        <p>Already have an account? <a href="/signin">Sign In</a></p>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SignUp;