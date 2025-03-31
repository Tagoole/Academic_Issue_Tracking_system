import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Single import for Router, Routes, and Route
import RegistraDashboard from "./pages/RegistraDashboard";
import Notifications from "./pages/Notifications";
import Messages from "./pages/Messages";
import Newchat from "./pages/New-Chat";
import IssueManagement from "./pages/IssueManagement";
import Viewdetails from "./pages/View-details";
import Signin from "./pages/Signin";
import EmailVerification from "./pages/verification";
import ResetPassword from "./pages/reset";
import Dashboard from "./pages/Dashboard";
import ProfileSetup from "./pages/ProfileSetup";
import ProfilePictureSetup from "./pages/profilepicture";
import Congragulation from "./pages/congragulation";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Main Routes */}
          <Route path="/registradashboard" element={<RegistraDashboard />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/new-chat" element={<Newchat />} />
          <Route path="/issuemanagement" element={<IssueManagement />} />
          <Route path="/view-details" element={<Viewdetails />} />

          {/* Authentication and Setup Routes */}
          <Route path="/signin" element={<Signin />} />
          <Route path="/verification" element={<EmailVerification />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profilesetup" element={<ProfileSetup />} />
          <Route path="/profilepicture" element={<ProfilePictureSetup />} />
          <Route path="/congragulation" element={<Congragulation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
