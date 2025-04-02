import React, { useState } from 'react';
import './signup.css';
import introImage from '../assets/introimages.png';
import userIcon from '../assets/user.png';
import hiddenIcon from '../assets/hidden.png';
import visibleIcon from '../assets/visible.png';
import mailIcon from '../assets/mail.png'

const SignUp = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    return (
        <div className="signup-page">
            <div className="left-side">
                <h2>Create an Account</h2>
                <h2>Please fill up this form</h2>
                <form>
                    <div className="form-group">
                        <label htmlFor="username">Full Name</label>
                        <div className="input-container">
                            <input type="text" id="username" name="username" placeholder="Enter your Full name" required />
                            <img src={userIcon} alt="User Icon" className="icon" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="useremail">Email</label>
                        <div className="input-container">
                            <input type="text" id="useremail" name="useremail" placeholder="Enter your Email" required />
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
                                placeholder="Enter your password"
                                required
                            />
                            <img
                                src={passwordVisible ? visibleIcon : hiddenIcon}
                                alt="Toggle Password Visibility"
                                className="icon"
                                onClick={togglePasswordVisibility}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm-password">Confirm Password</label>
                        <div className="input-container">
                            <input
                                type={confirmPasswordVisible ? "text" : "password"}
                                id="confirm-password"
                                name="confirm-password"
                                placeholder="Confirm your password"
                                required
                            />
                            <img
                                src={confirmPasswordVisible ? visibleIcon : hiddenIcon}
                                alt="Toggle Confirm Password Visibility"
                                className="icon"
                                onClick={toggleConfirmPasswordVisibility}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <div className="input-container">
                            <select id="role" name="role" required>
                                <option value="" disabled selected>Select your Role</option>
                                <option value="student">Student</option>
                                <option value="teacher">Lecturer</option>
                                <option value="other">Registrar</option>
                            </select>

                        </div>
                    </div>
                    <div className="form-group terms-group">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={agreeToTerms}
                            onChange={(e) => setAgreeToTerms(e.target.checked)}
                            required
                        />
                        <label htmlFor="terms">I have read and understood the ATIS terms and conditions.</label>
                    </div>
                    <button type="submit" className="sign-up-button">Sign Up</button>
                </form>
            </div>
            <div className="right-side">
                <img src={introImage} alt="Intro" className="intro-image" />
            </div>
        </div>
    );
};

export default SignUp;