import React from "react";
import mail from "../assets/mail.png";
import group from "../assets/group.png";

import "./password.css";

export const Frame = () => {
  return (
    <div className="frame">
      <h2 className="text-wrapper">Reset Password</h2>

      <p className="enter-your">
        Enter your registered Email Address below <br />
        to reset your password.
      </p>

      <div className="input-container">
        <input
          type="email"
          placeholder="Enter your Email Address"
          className="email-input"
        />

      </div>

      <button className="next-btn">Next</button>

      <p className="sign-in">Sign In</p>


    </div>
  );
};
export default Frame;