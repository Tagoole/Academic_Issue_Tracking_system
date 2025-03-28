import React from "react";
import RegistraDashboard from "./pages/RegistraDashboard";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
    
          <Route path="/registradashboard" element={<RegistraDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
