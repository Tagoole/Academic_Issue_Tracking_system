import React from "react";
import { BrowserRouter as Router, Routes, Route , Navigate} from "react-router-dom";



import Signin from "./pages/Signin"; 
import EmailVerification from "./pages/verification"; 
import ResetPassword from "./pages/reset"; 
import Dashboard from "./pages/Dashboard"; 
import ProfileSetup from "./pages/ProfileSetup";
import ProfilePictureSetup from "./pages/profilepicture";
import LandingPage from "./pages/landingpage";
import SignUp from "./pages/singup";
import AuthScreen from "./pages/authscreen";

function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" index element={<Navigate to ="landingpage" />}/>
        <Route path="landingpage" element={<LandingPage />} />
        <Route path="/signup" Component={SignUp} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/verification" element={<EmailVerification />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profilesetup" element={<ProfileSetup />} />
        <Route path="/profilepicture" element={<ProfilePictureSetup />} />
        <Route path="/authscreen" element={<AuthScreen />} />
      </Routes>
    </Router>
  )
}

export default App;
