import React, { useState, useRef } from 'react';
import './authscreen.css';
import authIcon from '../assets/auth.png';
import querieIcon from '../assets/query.png';
import resendIcon from '../assets/resend.png';

const AuthScreen = ({ userEmail = "user@example.com" }) => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [isVerifying, setIsVerifying] = useState(false);
    const inputRefs = useRef([]);

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (/^\d$/.test(value) || value === '') {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value !== '' && index < 3) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleVerify = () => {
        if (otp.every(digit => digit !== '')) {
            setIsVerifying(true);
            
            setTimeout(() => {
                setIsVerifying(false);
            }, 1500);
        }
    };

    const handleResendCode = () => {
        console.log("Resending code to", userEmail);
    };

    const handleHelp = () => {
        console.log("Help requested");
    };

    return (
        <div className="auth-screen">
            <div className="logo">AITS</div>
            <header className="auth-header">
                <button className="help-button" onClick={handleHelp}>
                    <img src={querieIcon} alt="Help" className="help-icon" />
                    Help?
                </button>
            </header>

            <div className="auth-card">
                <img src={authIcon} alt="Authentication" className="auth-icon" />
                <h1 className="auth-title">Authenticate Your Account</h1>
                <p className="auth-subtitle">
                    Protecting your account is our top priority. Please confirm your account by entering the authorization code we sent to {userEmail}
                </p>

                <div className="otp-inputs">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            className="otp-input"
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleChange(e, index)}
                            ref={(el) => (inputRefs.current[index] = el)}
                        />
                    ))}
                </div>

                <button 
                    className={`verify-button ${otp.every(digit => digit !== '') ? 'active' : 'disabled'}`}
                    onClick={handleVerify}
                    disabled={!otp.every(digit => digit !== '') || isVerifying}
                >
                    {isVerifying ? 'VERIFYING...' : 'VERIFY'}
                </button>

                <div className="resend-code" onClick={handleResendCode}>
                    <img src={resendIcon} alt="Resend" className="resend-icon" />
                    <span>Resend Code</span>
                </div>
            </div>
        </div>
    );
};

export default AuthScreen;