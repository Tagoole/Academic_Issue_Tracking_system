import React from 'react';
import './congs.css';
import partyIcon from '../assets/party.png'; 
import helpIcon from '../assets/query.png'; 
import { useNavigate } from 'react-router-dom';

const CONGS = () => {
    const navigate = useNavigate();

    const handleSignIn = () => {
        navigate('/signin'); 
    };

    const handleHelp = () => {
        console.log("Help button clicked"); 
    };

    return (
        <div className="congs-page">
            <header className="congs-header">
                <div className="logo">AITS</div>
                <button className="help-button" onClick={handleHelp}>
                    <img src={helpIcon} alt="Help" className="help-icon" />
                    Help?
                </button>
            </header>

            <div className="congs-card">
                <img src={partyIcon} alt="Success" className="party-icon" />
                <h1 className="congs-title">Congratulations</h1>
                <p className="congs-message">
                    You have successfully created your Academic Issue Tracking System account.
                </p>
                <p className="congs-submessage">Sign In to access your account.</p>
                <button className="signin-button" onClick={handleSignIn}>
                    Sign In
                </button>
            </div>
        </div>
    );
};

export default CONGS;