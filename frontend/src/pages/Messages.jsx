import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import NavBar from "./NavBar"; 
import HorizontalSideBar from "./HorizontalSideBar";
import icon from "../assets/box.png";
import "./Messages.css";

const Messages = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleNewMessageClick = () => {
    navigate("/new-message"); 
  };

  return (
    <div className="app-container">
      <NavBar />
      <div className="content-wrapper">
        <HorizontalSideBar />
        <div className="messages-container">
          <div className="empty-messages">
            <div className="icon-box">
              <img src={icon} alt="No messages" className="empty-icon" /> 
            </div>
            <p>There are no messages here.</p>
            <p>
              You will get notified when you receive one which will show here.
              Perhaps start a new message by clicking{" "}
              <span className="new-message-text">New Message</span>.
            </p>
            <button 
              className="new-message-button" 
              onClick={handleNewMessageClick} 
            >
              + New Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
