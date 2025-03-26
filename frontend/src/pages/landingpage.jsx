import React from 'react';
import './landingpage.css';
import { useNavigate } from 'react-router-dom';
import makererelogo from '../assets/makerere.logo.png';
import landingimage from '../assets/landingimage.png';

const LandingPage = () => {
    const navigate = useNavigate();

    const handlesignup = useNavigate();
        function navigateToSignup() {
            navigate('/signup');
    };

        function navigateToSignnin() {
            navigate('/signin');
        };
    return(
        <div className="landingpage">
            <img src={landingimage} alt="Landing Image" className="landing-image" />  
            <div clasName="logo">
                <h1 className='logo-name'>AITS</h1>
            </div>  
            <div className="overlay">
                <img src={makererelogo} alt="Makerere University Logo" className="makerere-logo" />
                <div className="welcome-text">WELCOME TO THE ISSUE ACADEMIC TRACKING SYSTEM</div>   
            </div>   
             
            <div className="header">
                <div className="buttons">
                <button className='signup-button' onClick={navigateToSignup}>Sign Up</button>
                <div className='separator'></div>
                <button className='signin-button' onClick={navigateToSignnin}>Sign In</button>
                </div>
            </div>
           
        </div>
    );

};

export default LandingPage;