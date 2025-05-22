import React from "react";
import { Link } from "react-router-dom";

const UserSidebar = () => {
  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-cyan-700 text-white shadow-2xl p-6 fixed left-0 top-0 flex flex-col items-center">
      <h2 className="text-2xl font-extrabold mb-10 tracking-wide text-cyan-300 drop-shadow-lg animate-bounce">
        Hey Explorer! 🚀
      </h2>
      <nav className="flex flex-col space-y-6 text-lg font-semibold w-full">
        <Link
          to="/user-dashboard"
          className="hover:bg-cyan-600 hover:text-white transition rounded-lg px-4 py-2 flex items-center gap-2"
        >
          <span role="img" aria-label="dashboard">🏠</span> Dashboard
        </Link>
        <Link
          to="/user-dashboard/map"
          className="hover:bg-cyan-600 hover:text-white transition rounded-lg px-4 py-2 flex items-center gap-2"
        >
          <span role="img" aria-label="map">🗺️</span> Explore Properties
        </Link>
        <Link
          to="/user-dashboard/bookmarks"
          className="hover:bg-cyan-600 hover:text-white transition rounded-lg px-4 py-2 flex items-center gap-2"
        >
          <span role="img" aria-label="bookmark">🔖</span> My Bookmarks
        </Link>
        <Link
          to="/user-dashboard/export"
          className="hover:bg-cyan-600 hover:text-white transition rounded-lg px-4 py-2 flex items-center gap-2"
        >
          <span role="img" aria-label="report">📊</span> Generate Report
        </Link>
        <Link
          to="/user-dashboard/onboarding"
          className="hover:bg-cyan-600 hover:text-white transition rounded-lg px-4 py-2 flex items-center gap-2"
        >
          <span role="img" aria-label="onboarding">🎉</span> Onboarding
        </Link>
        <Link
          to="/user-dashboard/terms"
          className="hover:bg-cyan-600 hover:text-white transition rounded-lg px-4 py-2 flex items-center gap-2"
        >
          <span role="img" aria-label="terms">📜</span> Terms of Service
        </Link>
    
      </nav>
    </aside>
  );
};

export default UserSidebar;