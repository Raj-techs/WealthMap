import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import UserTopbar from "./UserTopbar";
import AddPropertyPopup from "../user/AddPropertyPopup";

const UserLayout = () => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="flex">
      <UserSidebar />
      <div className="ml-64 w-full min-h-screen bg-gray-100 relative">
        <UserTopbar onAddPropertyClick={() => setShowPopup(true)} />
        <main className="pt-20 p-6">
          <Outlet />
        </main>
        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-start pt-28">
            <div className="bg-white rounded shadow-lg p-6 w-full max-w-2xl relative">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
                onClick={() => setShowPopup(false)}
              >
                ✖
              </button>
              <AddPropertyPopup onClose={() => setShowPopup(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserLayout;
