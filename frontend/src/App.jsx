import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importing pages

import Dashboard from "./pages/Dashboard";

import Issues from "./pages/Issues";
import CreateIssueForm from "./pages/CreateIssueForm";
import IssueMgt from "./pages/IssueMgt";

import NotificationSuccess from "./pages/NotificationSuccess";
import Messages from "./pages/Messages";
import MessageChat from "./pages/MessageChat";
import Newchat from "./pages/New-Chat";
import NewIssue from "./pages/New-Issue";
import NewMessage from"./pages/New-Message";
import Signin from "./pages/Signin";
import EmailVerification from "./pages/verification";
import ResetPassword from "./pages/reset";

import ProfileSetup from "./pages/ProfileSetup";
import ProfilePictureSetup from "./pages/profilepicture";
import Congragulation from "./pages/congragulation";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Routes from both branches */}
          
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/createissueform" element={<CreateIssueForm />} />
          
          <Route path="/notificationsuccess" element={<NotificationSuccess />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messagechat" element={<MessageChat />} />
          <Route path="/new-chat" element={<Newchat />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/verification" element={<EmailVerification />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/issues" element={<Issues />} />
          <Route path="/issuemgt" element={<IssueMgt />} /> s
          
          <Route path="/profilesetup" element={<ProfileSetup />} />
          <Route path="/profilepicture" element={<ProfilePictureSetup />} />
          <Route path="/congragulation" element={<Congragulation />} />
          <Route path="/new-issue" element={<NewIssue />} />
          <Route path="/new-message"element={<NewMessage/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;