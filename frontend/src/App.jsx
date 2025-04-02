import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NotificationSuccess from "./pages/NotificationSuccess";
import Messages from "./pages/Messages";
import Newchat from "./pages/New-Chat";

import Signin from "./pages/Signin";
import EmailVerification from "./pages/verification";
import ResetPassword from "./pages/reset";
import ProfileSetup from "./pages/ProfileSetup";
import ProfilePictureSetup from "./pages/profilepicture";
import Congragulation from "./pages/congragulation";
import IssueManagement from "./pages/IssueManagement";
import RegistraDashboard from "./pages/RegistraDashboard";
import Registraprofile from "./pages/Registraprofile";
import Help from "./pages/Help";
import Viewdetails from "./pages/View-details";


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          
          
      
          
        
          
          <Route path="/notificationsuccess" element={<NotificationSuccess />} />
          <Route path="/messages" element={<Messages />} />
          
          <Route path="/new-chat" element={<Newchat />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/verification" element={<EmailVerification />} />
          <Route path="/reset" element={<ResetPassword />} />
          
          
          
          <Route path="/profilesetup" element={<ProfileSetup />} />
          <Route path="/profilepicture" element={<ProfilePictureSetup />} />
          <Route path="/congragulation" element={<Congragulation />} />
          
          <Route path="/issuemanagement"element={<IssueManagement/>}/>
          <Route path ="/registradashboard"element={<RegistraDashboard/>}/>
          <Route path ="/registraprofile"element={<Registraprofile/>}/>
          <Route path ="/help" element={<Help/>}/>
          <Route path ="/view-details"element={<Viewdetails/>}/>
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;