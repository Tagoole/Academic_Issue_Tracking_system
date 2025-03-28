import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistraDashboard from "./pages/RegistraDashboard";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/registradashboard" element={<RegistraDashboard />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
