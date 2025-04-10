import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NotificationSuccess from "./pages/NotificationSuccess";
import Messages from "./pages/Messages";
import NewIssue from "./pages/New-issue";
import Signin from "./pages/Signin";
import EmailVerification from "./pages/verification";
import ResetPassword from "./pages/reset";
import ProfileSetup from "./pages/ProfileSetup";
import ProfilePictureSetup from "./pages/profilepicture";
import Congragulation from "./pages/congragulation";
import RegistraDashboard from "./pages/RegistraDashboard";
import IssueManagement from "./pages/IssueManagement";
import Viewdetails from "./pages/View-details";
import Changepassword from "./pages/Changepassword";
import Preferences from "./pages/Preferences";
import Help from "./pages/Help";
import Deleteaccount from "./pages/Deleteaccount";
import Issues from "./pages/Issues";
import StudentDashboard from "./pages/StudentDashboard";
import SignUp from "./pages/signup";
import ProfileScreen from "./pages/StudentsProfile";
import Notifications from "./pages/Notifications";
import LandingPage from "./pages/landingpage";
import CONGS from "./pages/congs";
import Lecturerdashboard from "./pages/Lecturerdashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Set LandingPage as the default route */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/landingpage" element={<LandingPage />} />
        
        {/* Authentication routes */}
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verification" element={<EmailVerification />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/changepassword" element={<Changepassword />} />
        <Route path="/congs" element={<CONGS />} />
        
        {/* Profile setup routes */}
        <Route path="/profilesetup" element={<ProfileSetup />} />
        <Route path="/profilepicture" element={<ProfilePictureSetup />} />
        <Route path="/congratulation" element={<Congragulation />} />
        <Route path="/profile" element={<ProfileScreen />} />
        
        {/* Dashboard routes */}
        <Route path="/studentdashboard" element={<StudentDashboard />} />
        <Route path="/registrardashboard" element={<RegistraDashboard />} />
        <Route path="/lecturerdashboard" element={<Lecturerdashboard />} />
        
        {/* Issue management routes */}
        <Route path="/new-issue" element={<NewIssue />} />
        <Route path="/issues" element={<Issues />} />
        <Route path="/issuemanagement" element={<IssueManagement />} />
        <Route path="/viewdetails/:id" element={<Viewdetails />} />
        
        {/* Other routes */}
        <Route path="/messages" element={<Messages />} />
        <Route path="/notification-success" element={<NotificationSuccess />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/preferences" element={<Preferences />} />
        <Route path="/help" element={<Help />} />
        <Route path="/deleteaccount" element={<Deleteaccount />} />
      </Routes>
    </Router>
  );
}

export default App;