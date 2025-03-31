import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";



import Signin from "./pages/Signin"; // New component
import EmailVerification from "./pages/verification"; // New component
import ResetPassword from "./pages/reset"; // New component
import Dashboard from "./pages/Dashboard"; // New component
import ProfileSetup from "./pages/ProfileSetup";
import ProfilePictureSetup from "./pages/profilepicture";
import Congragulation from "./pages/congragulation";
import PersonalProfile from "./pages/PersonalProfile";
import DeleteAccount from "./pages/DeleteAccount"; // New component
import ProfilePicture from "./pages/ProfilePictureSetup";
import AccountSetupComplete from "./pages/accountcomplete"; // New component
import ChangePassword from "./pages/changepassoword";

function App() {
  

  return (
    <Router>
      <Routes>
        
      
       
        <Route path="/signin" element={<Signin />} />
        <Route path="/verification" element={<EmailVerification />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profilesetup" element={<ProfileSetup />} />
        <Route path="/profilepicture" element={<ProfilePictureSetup />} />
        <Route path="/congragulation" element={<Congragulation />} />
        <Route path="/personalprofile" element={<PersonalProfile />} />
        <Route path="/deleteaccount" element={<DeleteAccount />} />
        <Route path="/profilepic" element={<ProfilePicture />} />
        <Route path="/accountcomplete" element={<AccountSetupComplete />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        {/* Add more routes as needed */}
        
        

        
      </Routes>
    </Router>
  )
}

export default App;
