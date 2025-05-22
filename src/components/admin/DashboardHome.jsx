import React from "react";
import { FaHome, FaHourglassHalf, FaUsers } from "react-icons/fa";
import RecentActivity from "../../common/RecentActivity";
import { useNavigate } from "react-router-dom";

// Example props or fetch from context/store
// Replace these with your actual data sources
const properties = [
  /* ... */
];
const pending_properties = [
  /* ... */
];
const users = [
  { role: "user" },
  { role: "admin" },
  { role: "user" },
  // ...
];

const DashboardHome = () => {
  

  const totalProperties = properties.length;
  const pendingReviews = pending_properties.length;
  const userCount = users.filter((u) => u.role === "user").length;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 via-white to-green-50 py-10">
      <div className="w-full max-w-5xl space-y-8 px-4 md:px-0">
        <h2 className="text-4xl font-extrabold text-blue-900 tracking-tight text-center mb-6">
          WealthMap Admin Insights
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          <div
            className="bg-white hover:shadow-xl transition-shadow duration-300 rounded-2xl p-6 md:p-8 flex flex-col items-center cursor-pointer border border-blue-100 w-full"
            
          >
            <FaHome className="text-4xl text-blue-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700">Total Properties</h3>
            <p className="text-3xl font-bold text-blue-700 mt-2">{totalProperties}</p>
            <span className="text-xs text-gray-400 mt-1">View all properties</span>
          </div>
          <div
            className="bg-white hover:shadow-xl transition-shadow duration-300 rounded-2xl p-6 md:p-8 flex flex-col items-center cursor-pointer border border-yellow-100 w-full"
           
          >
            <FaHourglassHalf className="text-4xl text-yellow-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700">Pending Reviews</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingReviews}</p>
            <span className="text-xs text-gray-400 mt-1">Review pending properties</span>
          </div>
          <div
            className="bg-white hover:shadow-xl transition-shadow duration-300 rounded-2xl p-6 md:p-8 flex flex-col items-center cursor-pointer border border-green-100 w-full"
            
          >
            <FaUsers className="text-4xl text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700">Registered Users</h3>
            <p className="text-3xl font-bold text-green-700 mt-2">{userCount}</p>
            <span className="text-xs text-gray-400 mt-1">Manage users</span>
          </div>
        </div>
        <div className="mt-10 bg-white rounded-2xl shadow p-6 md:p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Recent Activity</h2>
          <RecentActivity role="Admin" />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;