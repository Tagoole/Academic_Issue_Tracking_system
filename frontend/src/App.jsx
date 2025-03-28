import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistraDashboard from "./pages/RegistraDashboard";
import Notifications from "./pages/Notifications";
import Messages from "./pages/Messages";
import NewChat from "./pages/New-Chat";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/registradashboard" element={<RegistraDashboard />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/new-chat" element={<NewChat />} />
        
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
