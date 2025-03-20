import React from 'react';
import './signup.css';
import introImage from '../assets/introimages.png';

const SignUp = () => {
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
                        <input type="text" id="username" name="username" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input type="email" id="email" name="email" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Confirm Password</label>
                        <input type="password" id="password" name="password" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <input type="text" id="role" name="role" required />
                        <select id="role" name='role' required>
                            <option value="student">Student</option>
                            <option value="teacher">Lecturer</option>
                            <option value="other">Registrar</option>
                        </select>
                    
                    </div>
                    <button type="submit">Sign Up</button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
