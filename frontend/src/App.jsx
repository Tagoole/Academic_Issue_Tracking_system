import React from "react";
<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistraDashboard from "./pages/RegistraDashboard";
import Notifications from "./pages/Notifications";
import Messages from "./pages/Messages";
import Newchat from "./pages/New-Chat";
import IssueManagement from "./pages/IssueManagement";
import Viewdetails from "./pages/View-details";
=======
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
>>>>>>> a629dc63c1883467e8101ac4ad5f4f8f3a46ad40



import Signin from "./pages/Signin"; // New component
import EmailVerification from "./pages/verification"; // New component
import ResetPassword from "./pages/reset"; // New component
import Dashboard from "./pages/Dashboard"; // New component
import ProfileSetup from "./pages/ProfileSetup";
import ProfilePictureSetup from "./pages/profilepicture";
import Congragulation from "./pages/congragulation";
function App() {
  

  return (
    <Router>
<<<<<<< HEAD
      <div className="App">
        <Routes>
          <Route path="/registradashboard" element={<RegistraDashboard />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/new-chat" element={<Newchat />} />
          <Route path="/issuemanagement" element={<IssueManagement />} />
          <Route path="/view-details" element={<Viewdetails/>} />      
          
        </Routes>
      </div>
    </Router>
  );
=======
      <Routes>
        
      
       
        <Route path="/signin" element={<Signin />} />
        <Route path="/verification" element={<EmailVerification />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profilesetup" element={<ProfileSetup />} />
        <Route path="/profilepicture" element={<ProfilePictureSetup />} />
        <Route path="/congragulation" element={<Congragulation />} />

        
      </Routes>
    </Router>
  )
>>>>>>> a629dc63c1883467e8101ac4ad5f4f8f3a46ad40
}

export default App;
