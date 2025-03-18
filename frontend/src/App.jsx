import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IssueList from "./components/IssueList"; // Previously created component
import DepartmentList from "./components/DepartmentList"; // New component
import Frame from "./pages/password"; // New component
import Signin from "./pages/Signin"; // New component
import EmailVerification from "./pages/verification"; // New component
import ResetPassword from "./pages/reset"; // New component
import Dashboard from "./pages/Dashboard"; // New component
import ProfileSetup from "./pages/ProfileSetup";
import ProfilePictureSetup from "./pages/profilepicture";
function App() {
  // return (
  //   <div className="App">
  //     {/* <h1>Test data</h1> */}
  //     <div style={{ backgroundColor: 'teal', padding: '20px' }}>
  //       <h1 style={{ color: 'white', textAlign: 'center' }}>Test data</h1>
  //     </div>

  //     {/* Display Departments */}
  //     <DepartmentList />
  //     {/* Optionally display Issues */}
  //     <IssueList />
  //   </div>
  // );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<DepartmentList />} />
        <Route path="/issues" element={<IssueList />} />
       
        <Route path="/signin" element={<Signin />} />
        <Route path="/verification" element={<EmailVerification />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profilesetup" element={<ProfileSetup />} />
        <Route path="/profilepicture" element={<ProfilePictureSetup />} />
      </Routes>
    </Router>
  )
}

export default App;