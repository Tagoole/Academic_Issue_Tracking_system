import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";



import Signin from "./pages/Signin"; // New component
import EmailVerification from "./pages/verification"; // New component
import ResetPassword from "./pages/reset"; // New component
import Dashboard from "./pages/Dashboard"; // New component
import ProfileSetup from "./pages/ProfileSetup";
import ProfilePictureSetup from "./pages/profilepicture";
import Congragulation from "./pages/congragulation";
import Changepassword from "./pages/Changepassword";
import Changepasswordcomfirmation from "./pages/Changepasswordconfirmation";
import Preferences from "./pages/Preferences";
import Help from "./pages/Help";
import Deleteaccount from "./pages/Deleteaccount";
import Issuemanagement from "./pages/Issuemanagement";
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
        <Route path="/changepassword" element={<Changepassword />} />
        <Route path="/changepasswordconfirmation" element={<Changepasswordcomfirmation />} />
        <Route path="/preferences" element={<Preferences />} />
        <Route path="/help" element={<Help />} />
        <Route path="/deleteaccount" element={<Deleteaccount />} />
        <Route path="/issuemanagement" element={<Issuemanagement />} />
       
        
      </Routes>
    </Router>
  )
}

export default App;
