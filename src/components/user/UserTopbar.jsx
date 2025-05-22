import React, { useEffect, useState } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const UserTopbar = ({ onAddPropertyClick }) => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || user.email?.split("@")[0] || "User");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  const handleNotificationsClick = () => {
    navigate("notifications");
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-24 bg-white border-b shadow-md z-50 flex items-center justify-between px-8">
      <h1 className="text-3xl font-extrabold text-gray-800 font-sans flex items-baseline">
        Welcome,&nbsp;
        <span className="text-blue-600">
          <span className="text-5xl font-extrabold">
            {userName.charAt(0)}
          </span>
          <span className="text-3xl font-thin">
            {userName.slice(1)}
          </span>
          !
        </span>
      </h1>

      <div className="flex gap-4 items-center">
        <button
          onClick={handleNotificationsClick}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-200 to-blue-300 hover:from-blue-300 hover:to-blue-400 text-blue-900 px-3 py-1.5 rounded-full shadow text-sm font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 7.165 6 9.388 6 12v2.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          Notifications
        </button>

        <button
          onClick={onAddPropertyClick}
          className="flex items-center gap-2 bg-gradient-to-r from-green-200 to-green-300 hover:from-green-300 hover:to-green-400 text-green-900 px-3 py-1.5 rounded-full shadow text-sm font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Property
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-gradient-to-r from-red-200 to-red-300 hover:from-red-300 hover:to-red-400 text-red-900 px-3 py-1.5 rounded-full shadow text-sm font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
          </svg>
          Logout
        </button>
      </div>
    </header>
  );
};

export default UserTopbar;
