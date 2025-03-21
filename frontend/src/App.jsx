import React from "react";
import LandingPage from "./pages/Landingpage";  
import StudentDashboard from "./pages/StudentDashboard";
import IssueMgt from "./pages/IssueMgt";
import CreateIssueForm from "./pages/CreateIssueForm";
import Notification from "./pages/Notification";
import NotificationSuccess from "./pages/NotificationSuccess";
import Message from "./pages/Message";
import MessageChat from "./pages/MessageChat";
import Newchat from "./pages/Newchat";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          
      
          <Route path="/studentdashboard" element={<StudentDashboard />} />
          <Route path="/issuemgt" element={<IssueMgt />} />
          <Route path="/createissueform" element={<CreateIssueForm />} /> 
          <Route path="/notification" element={<Notification />} />
          <Route path="/notificationsuccess"element={<NotificationSuccess/>}/>
          <Route path="/message" element={<Message />} />\
          <Route path="/messagechat" element={<MessageChat />} />
          <Route path="/newchat" element={<Newchat />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
