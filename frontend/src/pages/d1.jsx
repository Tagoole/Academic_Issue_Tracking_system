import { useState } from "react";
import { Search, Bell, Settings, LogOut, Filter } from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("In-progress");

  const issues = [
    { id: 1, name: "Ssemuka Yasin", category: "Missing Marks", date: "15/09/2025" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-black text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          /*<img src="/profile.jpg" alt="User" className="w-10 h-10 rounded-full" /> */
          <span className="font-bold">{`{First Name}`}</span>``
          <div className="relative">
            <Search className="absolute left-2 top-2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for anything..."
              className="pl-8 pr-4 py-1 rounded-lg bg-gray-200 text-black focus:outline-none"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <Bell className="cursor-pointer" />
          <Settings className="cursor-pointer" />
          <button className="bg-gray-800 px-3 py-1 rounded-md flex items-center gap-2">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </nav>

      {/* Sidebar & Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-4 flex flex-col gap-4">
          <button className="text-red-500 font-bold">Dashboard</button>
          <button>Issues</button>
          <button>Profile</button>
          <button>Settings</button>
          <button>Help & Support</button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <h1 className="text-xl font-bold">Assigned Issues</h1>
          <p className="text-gray-500">(Kindly click on the issue to open it.)</p>

          {/* Tabs */}
          <div className="mt-4 flex gap-2">
            {["Pending", "In-progress", "Resolved"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  activeTab === tab ? "bg-black text-white" : "bg-gray-200"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Issues Table */}
          <div className="mt-4 bg-white p-4 shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-1/3">
                <Search className="absolute left-2 top-2 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for issues..."
                  className="pl-8 pr-4 py-1 rounded-lg bg-gray-200 text-black focus:outline-none w-full"
                />
              </div>
              <button className="bg-gray-800 text-white px-4 py-2 rounded-md flex items-center gap-2">
                <Filter className="w-5 h-5" /> Filter
              </button>
            </div>

            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-2 border">ISSUE ID</th>
                  <th className="p-2 border">STUDENT NAME</th>
                  <th className="p-2 border">CATEGORY</th>
                  <th className="p-2 border">SUBMISSION DATE</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-gray-100 cursor-pointer">
                    <td className="p-2 border">{issue.id}</td>
                    <td className="p-2 border">{issue.name}</td>
                    <td className="p-2 border">{issue.category}</td>
                    <td className="p-2 border">{issue.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
