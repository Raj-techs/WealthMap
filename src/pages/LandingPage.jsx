import React from "react";
import { Link } from "react-router-dom";
import { User, Users } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-400 text-gray-900 font-poppins">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 shadow-lg sticky top-0 z-50 bg-white">
        <div className="flex items-center gap-3 text-4xl font-extrabold text-blue-900 cursor-pointer hover:text-blue-700 transition-colors font-product-sans">
          <span className="inline-block border border-blue-900 rounded p-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" height="32" width="32" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 9.5L12 4l9 5.5v9A2.5 2.5 0 0 1 18.5 21h-13A2.5 2.5 0 0 1 3 18.5v-9Z" />
              <path d="M9 21V12h6v9" />
            </svg>
          </span>
          <span className="hover:underline">WealthMap</span>
        </div>
        <ul className="hidden md:flex items-center space-x-6 font-medium text-gray-800">
          <li className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2m10-10h-2M4 12H2m16.364 5.364l-1.414-1.414M6.05 6.05L4.636 4.636m12.728 0l1.414 1.414M6.05 17.95l-1.414 1.414" />
            </svg>
            <Link to="/about" className="hover:text-blue-500 hover:underline transition">ABOUT</Link>
             
          </li>
          <li className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M5 6h14M5 18h14" />
            </svg>
            <Link to="/features" className="hover:text-blue-500 hover:underline transition">FEATURES</Link>
          </li>
          <li className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5a8.38 8.38 0 01-3.9 7.1 8.5 8.5 0 01-8.2 0A8.38 8.38 0 015 10.5V5.7a2.7 2.7 0 012.7-2.7h8.6a2.7 2.7 0 012.7 2.7v4.8z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.5a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
            <Link to="/contact" className="hover:text-blue-500 hover:underline transition">CONTACT</Link>
          </li>
        </ul>
        <div className="md:hidden">
          <button className="text-blue-900 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20 px-6">
        <h1 className="text-4xl md:text-5xl font-Courier-Oblique text-blue-900 mb-4">
          Welcome to WealthMap – Explore <br /> Property Ownership & Wealth
        </h1>
        <p className="text-lg text-gray-700 mb-12">
          Search, filter, and analyze real estate wealth across the map.
        </p>

        {/* Login Cards */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-12 max-w-4xl mx-auto">
            <div className="bg-white shadow-xl rounded-lg p-6 w-72 text-center border border-gray-200 hover:shadow-2xl hover:scale-105 transition-transform">
              <div className="flex justify-center text-blue-900 mb-4">
                <User size={50} />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Admin Login</h3>
              <p className="text-sm text-gray-600 mb-4">
                For company owners or admins managing employee access.
              </p>
              <Link
                to="/login/admin"
                className="flex items-center justify-center bg-blue-900 text-white py-2 rounded-md font-semibold hover:bg-blue-800 hover:underline transition"
              >
                <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-5 h-5 mr-2"
                >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Admin Login
              </Link>
            </div>

            <div className="bg-white shadow-xl rounded-lg p-6 w-72 text-center border border-gray-200 hover:shadow-2xl hover:scale-105 transition-transform">
              <div className="flex justify-center text-blue-900 mb-4">
                <Users size={50} />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">User Login</h3>
              <p className="text-sm text-gray-600 mb-4">
                For employees invited by an admin or property analysts.
              </p>
              <Link
                to="/login/user"
                className="flex items-center justify-center bg-blue-900 text-white py-2 rounded-md font-semibold hover:bg-blue-800 hover:underline transition"
              >
                <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-5 h-5 mr-2"
                >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                User Login
              </Link>
            </div>
          </div>

          {/* Explore Without Login */}
        <div className="mt-10">
          <Link
            to="/guest-explore"
            className="inline-flex items-center bg-white text-darkblue px-8 py-4 rounded-lg font-semibold border border-darkblue hover:bg-darkblue hover:text-blue hover:underline transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6 mr-2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Explore Without Login
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;