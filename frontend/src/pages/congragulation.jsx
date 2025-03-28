import React from 'react';
import './congragulation.css'; 

function Congragulation() {
  return (
    <div className="congratulations-container">
        <h1>Academic Issue Tracking System</h1>
      <h2>CONGRATULATIONS!</h2>
      <p>“Your dashboard is ready”</p>
      <div className="message">
        <p><strong>“Track and manage your academic issues.”</strong></p>
        <p><strong>SUCCESS!</strong></p>
      </div>
      <div className="buttons">
        <button className="back-button">Back</button>
        <button className="dashboard-button">Go to Dashboard</button>
      </div>
    </div>
  );
}

export default Congragulation;