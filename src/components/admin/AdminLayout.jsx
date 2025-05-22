import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

const SIDEBAR_WIDTH = 240;

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <div
        className="hidden md:block fixed top-0 left-0 h-full bg-white shadow z-30"
        style={{ width: SIDEBAR_WIDTH }}
      >
        <AdminSidebar isMobile={false} />
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
          <div
            className="relative w-64 bg-white shadow h-full z-50"
            style={{ width: SIDEBAR_WIDTH }}
          >
            <AdminSidebar isMobile={true} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
      <div
        className="flex flex-col"
        style={{ marginLeft: 0 }}
      >
        {/* Topbar */}
        <div
          className="fixed top-0 right-0 left-0 z-20"
          style={{ marginLeft:0 }}
        >
          <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />
        </div>
        {/* Main Content */}
        <main
          className="pt-16 md:pt-20 p-4 md:p-6 flex-1 overflow-auto transition-all"
          style={{
            minHeight: "100vh",
            marginLeft: 0,
            marginTop: 0,
            ...(window.innerWidth >= 768 ? { marginLeft: SIDEBAR_WIDTH } : {}),
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;