import React from "react";
import { BrowserRouter as Router, Routes, Route , Navigate} from "react-router-dom";



import Signin from "./pages/Signin"; // New component
import EmailVerification from "./pages/verification"; // New component
import ResetPassword from "./pages/reset"; // New component
import Dashboard from "./pages/Dashboard"; // New component
import ProfileSetup from "./pages/ProfileSetup";
import ProfilePictureSetup from "./pages/profilepicture";
import LandingPage from "./pages/landingpage";

function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" index element={<Navigate to ="landingpage" />}/>
        <Route path="landingpage" element={<LandingPage />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/verification" element={<EmailVerification />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profilesetup" element={<ProfileSetup />} />
        <Route path="/profilepicture" element={<ProfilePictureSetup />} />
      </Routes>
    </Router>
  )
}

export default App;
