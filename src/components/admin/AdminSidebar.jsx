import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaPlusSquare,
  FaClipboardCheck,
  FaUsers,
  FaChartBar,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const navItems = [
  {
    to: "/admin-dashboard",
    label: "Dashboard",
    icon: <FaTachometerAlt />,
  },
  {
    to: "/admin-dashboard/add-property",
    label: "Add Property",
    icon: <FaPlusSquare />,
  },
  {
    to: "/admin-dashboard/review",
    label: "Review Submissions",
    icon: <FaClipboardCheck />,
  },
  {
    to: "/admin-dashboard/users",
    label: "Manage Users",
    icon: <FaUsers />,
  },
  {
    to: "/admin-dashboard/reports",
    label: "Reports",
    icon: <FaChartBar />,
  },
];

const AdminSidebar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 p-3 rounded-full shadow-lg text-white"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <FaBars size={22} />
      </button>

      <aside
        className={`
          fixed left-0 top-0 z-40 flex flex-col items-center
          transition-all duration-300
          bg-gradient-to-b from-blue-900 via-blue-800 to-cyan-700
          text-white shadow-2xl p-6
          w-64 h-screen
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Close button for mobile */}
        <div className="flex justify-end w-full md:hidden mb-6">
          <button
            onClick={() => setOpen(false)}
            className="text-white bg-black/30 p-2 rounded-full"
            aria-label="Close menu"
          >
            <FaTimes size={20} />
          </button>
        </div>
        <h2 className="text-2xl font-extrabold mb-10 tracking-wide text-cyan-300 drop-shadow-lg flex items-center gap-3">
          <span className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full w-10 h-10 flex items-center justify-center text-2xl shadow-lg font-black">
            <FaChartBar />
          </span>
          Wealth<span className="text-blue-400">Map</span>
        </h2>
        <span className="text-xs font-semibold text-blue-200 tracking-widest mb-8 text-center block">
          Admin Command Center
        </span>
        <nav className="flex flex-col space-y-6 text-lg font-semibold w-full">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition
                ${
                  location.pathname === item.to
                    ? "bg-cyan-600 text-white shadow-md scale-105"
                    : "hover:bg-cyan-600 hover:text-white"
                }
              `}
              onClick={() => setOpen(false)}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="text-xs text-gray-300 mt-auto pt-10 text-center opacity-80 w-full">
          &copy; {new Date().getFullYear()} Wealth Map Admin
        </div>
      </aside>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default AdminSidebar;
