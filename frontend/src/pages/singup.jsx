import React from 'react';
import './signup.css';
import introImage from '../assets/introimages.png';
import mailIcon from '../assets/mail.png';
import userIcon from '../assets/user.png';
import hiddenIcon from '../assets/hidden.png';
import visibleIcon from '../assets/visible.png';

const SignUp = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };
    return (
        <div className="signup-page">
            <div className="left-side">
                <img src={introImage} alt="Intro" className="intro-image" />
            </div>
            <div className="right-side">
                <h1>Create an Account</h1>
                <h2>Please fill up this form</h2>
                <form>
                    <div className="form-group">
                        <label htmlFor="username">Full Name</label>
                        <div className="input-container">
                            <input type="text" id="username" name="username" required />
                            <img src={userIcon} alt="User Icon" className="icon" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-container">
                            <input type="email" id="email" name="email" required />
                            <img src={mailIcon} alt="Mail Icon" className="icon" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-container">
                            <input type="password" id="password" name="password" required />
                            <img scr={hiddenIcon} alt="Hide Password" className="icon" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm-password">Confirm Password</label>
                        <div className="input-container">
                            <input type="password" id="confirm-password" name="confirm-password" required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <div className="input-container">
                            <select id="role" name="role" required>
                                <option value="student">Student</option>
                                <option value="teacher">Lecturer</option>
                                <option value="other">Registrar</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit">Sign Up</button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;