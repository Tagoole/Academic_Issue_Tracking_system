import React, { useState } from 'react';
import group from '../assets/group.png';
import mail from '../assets/mail.png';
import './reset.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email submitted:', email);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96 text-center">
        <div className="flex justify-center mb-4">
          <img src={group} alt="Group" className="w-16 h-16" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
        <p className="text-gray-600 mb-4">
          Enter your registered Email Address below to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              placeholder="Enter your Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <img src={mail} alt="Mail Icon" className="absolute right-3 top-2.5 w-6 h-6" />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-md text-lg font-semibold hover:bg-green-600"
          >
            Next
          </button>
        </form>
        <p className="mt-4">
          <a href="/signin" className="text-green-500 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;