import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup.css';
import userIcon from '../assets/user.png';
import hiddenIcon from '../assets/hidden.png';
import visibleIcon from '../assets/visible.png';
import mailIcon from '../assets/mail.png';
import API from '../api.js';

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
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
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [debugResponse, setDebugResponse] = useState(null);

    // Define the program options directly in the component
    const programOptions = [
        { id: 5, name: 'Software' },
        { id: 4, name: 'Computer Science' },
        { id: 3, name: 'Nutrition' }
    ];

    // Determine if token field should be displayed
    const showTokenField = formData.role === 'teacher' || formData.role === 'other' || formData.role === 'registrar';

    // Determine if program field should be displayed
    const showProgramField = formData.role === 'student' || formData.role === '';

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

        // Reset errors and success message
        setErrors({});
        setSuccessMessage('');
        setIsLoading(true);

        try {
            // Choose endpoint based on role
            const endpoint = formData.role === 'student' 
                ? '/api/register_student_user/' 
                : '/api/register_lect_and_registrar/';

            // Create the data object to be sent
            const registrationData = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                username: formData.username,
                email: formData.email,
                password: formData.password,
                confirm_password: formData.confirmPassword,
                role: formData.role,
                gender: formData.gender,
                city: formData.city,
            };

            // Add program field only for students
            if (formData.role === 'student') {
                registrationData.program = formData.program;
            }

            // Add token field only when needed
            if (showTokenField) {
                registrationData.token = formData.token;
            }

            console.log("Sending registration data:", JSON.stringify(registrationData, null, 2));
            const response = await API.post(endpoint, registrationData);
            
            // Store the response for debugging
            setDebugResponse(response.data);
            console.log("Registration response:", JSON.stringify(response.data, null, 2));

            // Check if the response is successful
            if (response.status === 200 || response.status === 201) {
                // Save the current role before clearing the form
                const currentRole = formData.role;
                const currentEmail = formData.email;
                
                // Set different success messages based on role
                if (currentRole === 'student') {
                    setSuccessMessage("Registration successful! Redirecting to verification page...");
                } else {
                    setSuccessMessage("Registration successful! Redirecting to login page...");
                }
                
                // Clear the form after successful registration
                setFormData({
                    first_name: '',
                    last_name: '',
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
                
                // Set a short timeout before redirecting
                setTimeout(() => {
                    // Redirect based on role
                    if (currentRole === 'student') {
                        // Students go to verification page
                        navigate('/verification', { 
                            state: { 
                                email: currentEmail,
                                role: currentRole 
                            } 
                        });
                    } else {
                        // Teachers and registrars go straight to login
                        navigate('/signin', {
                            state: {
                                message: "Your account has been created. Please login with your credentials."
                            }
                        });
                    }
                }, 2000);
            } else {
                setErrors(response.data || {});
            }
        } catch (err) {
            if (err.response && err.response.data) {
                console.error("Error during API call:", JSON.stringify(err.response.data, null, 2));
                setErrors(err.response.data);
            } else if (err.request) {
                console.error("No response received:", err.request);
                setErrors({general: ['No response from server']});
            } else {
                console.error("Error:", err.message);
                setErrors({general: ['Failed to connect to server']});
            }
        } finally {
            setIsLoading(false);
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

                    {/* Display general errors */}
                    {errors.general && <p className="error-message">{errors.general.join(', ')}</p>}

                    <button type="submit" className="sign-up-button" disabled={isLoading}>
                        {isLoading ? 'Please wait...' : 'Sign Up'}
                    </button>
                </form>
                
                {/* Debug view in development mode */}
                {process.env.NODE_ENV === 'development' && renderDebugView()}
            </div>
        </div>
    );
};

export default SignUp;