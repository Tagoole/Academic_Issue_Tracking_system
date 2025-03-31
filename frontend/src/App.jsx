import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";



import Signin from "./pages/Signin"; 
import EmailVerification from "./pages/verification"; 
import ResetPassword from "./pages/reset"; 
import Dashboard from "./pages/Dashboardsetup"; 
import ProfileSetup from "./pages/ProfileSetup";
import ProfilePictureSetup from "./pages/profilepicture";
import Congragulation from "./pages/congragulation";
import PersonalProfile from "./pages/PersonalProfile";
import DeleteAccount from "./pages/DeleteAccount"; 
import ProfilePicture from "./pages/ProfilePictureSetup";
import AccountSetupComplete from "./pages/accountcomplete"; 
import ChangePassword from "./pages/changepassoword";

function App() {
  

  return (
    <Router>
      <Routes>
        
      
       
        <Route path="/signin" element={<Signin />} />
        <Route path="/verification" element={<EmailVerification />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/dashboardsetup" element={<Dashboard />} />
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
