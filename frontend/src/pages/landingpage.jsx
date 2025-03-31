import React from 'react';
import { useHistory} from 'react-router-dom';
import './landingpage.css';
import welcome from '../assets/welcome.png';
import makerereLogo from '../assets/makerere.logo.png';

const LandingPage = () => {
    const history = useHistory();

    const handleSignIn = () => {
        history.push('/signin');
    };
    const handleSignUp = () => {
        history.push('/signup');
    };
    return (
        <div className='landing-page'>
            <div className="logo">AITS</div>
            <img src={welcome} alt='welcome' className='welcome-image' />
            <img src={makerereLogo} alt="Makerere University Logo" className="makerere-logo" />
            <div className="welcome-text"> WELCOME TO THE ACADEMIC ISSUE TRACKING SYSTEM</div>
            <button onclick={handleSignIn} className="sign-in-button">Sign In</button>
            <button onclick={handleSignUp} className='sign-up-button'>Sign Up</button> 
        </div>
    );
};

export default LandingPage;