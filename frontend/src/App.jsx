import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NotificationSuccess from "./pages/NotificationSuccess";
import Messages from "./pages/Messages";
import NewIssue from "./pages/New-Issue";
import Signin from "./pages/Signin";
import EmailVerification from "./pages/verification";
import ResetPassword from "./pages/reset";
import ProfileSetup from "./pages/ProfileSetup";
import ProfilePictureSetup from "./pages/profilepicture";
import Congragulation from "./pages/congragulation";
import RegistraDashboard from "./pages/RegistraDashboard";
//import IssueManagement  from "./pages/IssueManagement";
import Viewdetails from "./pages/View-details";
import Changepassword from "./pages/Changepassword";
import Preferences from "./pages/Preferences";
import Help from "./pages/Help";
import Deleteaccount from "./pages/Deleteaccount";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          
          
          <Route path="/createissueform" element={<CreateIssueForm />} />
          <Route path="/notificationsuccess" element={<NotificationSuccess />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/verification" element={<EmailVerification />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/issues" element={<Issues />} />
          <Route path="/profilesetup" element={<ProfileSetup />} />
          <Route path="/profilepicture" element={<ProfilePictureSetup />} />
          <Route path="/congragulation" element={<Congragulation />} />
          <Route path="/new-issue" element={<NewIssue />} />
          <Route path="/RegistraDashboard"element={<RegistraDashboard/>}/>
          {/*<Route path ="/issuemanagement"element={<IssueManagement/>}/>*/}
          <Route path ="/view-details"element={<Viewdetails/>}/>
          <Route path="/changepassword"element={<Changepassword/>}/>
          <Route path="/Preferences"element={<Preferences/>}/>
          <Route path="/Help"element={<Help/>}/>
          <Route path="/Deleteaccount"element={<Deleteaccount/>}/>
          

          
        </Routes>
      </div>
    </Router>
  );
}

export default App;