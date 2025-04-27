import React from 'react';
import Navbar from './NavBar';
import Sidebar from './Sidebar';
import { Search, Filter } from 'lucide-react';

const RegistraDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <Navbar />
        
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Dashboard Cards */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Total Issues Card */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-center font-semibold mb-2">Total issues</h2>
              <p className="text-center font-bold text-xl mb-2">0</p>
              <p className="text-center text-sm text-gray-600">You currently have 0 issues</p>
            </div>
            
            {/* Pending Issues Card */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-center font-semibold mb-2">Pending issues</h2>
              <p className="text-center font-bold text-xl mb-2">0</p>
              <p className="text-center text-sm text-gray-600">You currently have 0 pending</p>
            </div>
            
            {/* In-progress Issues Card */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-center font-semibold mb-2">In-progress issues</h2>
              <p className="text-center font-bold text-xl mb-2">0</p>
              <p className="text-center text-sm text-gray-600">You currently have 0 in-progress issues</p>
            </div>
            
            {/* Resolved Issues Card */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-center font-semibold mb-2">Resolved issues</h2>
              <p className="text-center font-bold text-xl mb-2">1</p>
              <p className="text-center text-sm text-gray-600">You currently have 1 resolved issue</p>
            </div>
          </div>
          
          {/* My Issues Section */}
          <div className="bg-gray-300 rounded-lg shadow p-4">
            <h2 className="font-semibold mb-4">My Issues</h2>
            
            {/* Search Bar */}
            <div className="flex justify-between mb-4">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search for issues"
                  className="w-full pl-3 pr-10 py-2 rounded-md border-gray-300 focus:outline-none"
                />
                <Search className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
              </div>
              
              <button className="flex items-center bg-gray-400 text-white px-4 py-1 rounded-md">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </button>
            </div>
            
            {/* Issues Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Issue ID</th>
                    <th className="py-3 px-6 text-left">Status</th>
                    <th className="py-3 px-6 text-left">Student ID</th>
                    <th className="py-3 px-6 text-left">Category</th>
                    <th className="py-3 px-6 text-left">Date</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  <tr className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6">1</td>
                    <td className="py-3 px-6">Resolved</td>
                    <td className="py-3 px-6">25UA0000PS</td>
                    <td className="py-3 px-6">Missing Mark</td>
                    <td className="py-3 px-6">01/01/2025</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistraDashboard;