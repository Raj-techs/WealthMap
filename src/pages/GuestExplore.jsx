import React, { useState } from "react";
import AddPropertyPopup from "../components/user/AddPropertyPopup";
import Features from "./Features";
import Contact from "./Contact";

const GuestExplore = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 px-6 md:px-20 py-10">
      <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">Welcome to WealthMap</h1>
      <p className="text-center text-gray-700 max-w-xl mx-auto mb-6">
        Explore features and add properties without logging in. Experience the platform designed for insight and security.
      </p>

      <div className="flex justify-center mb-8">
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-700 text-white px-6 py-2 rounded shadow hover:bg-blue-800 transition"
        >
          ➕ Add Property
        </button>
      </div>

      {open && <AddPropertyPopup onClose={() => setOpen(false)} />}

      <Features />
      <Contact />
    </div>
  );
};

export default GuestExplore;
