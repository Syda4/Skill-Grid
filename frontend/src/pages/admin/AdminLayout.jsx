import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="custom-dashboard-layout">
      {/* Reusable Sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Container */}
      <main className="custom-dashboard-main">
        {/* Mobile Header Bar */}
        <header className="mobile-header-bar">
          <button
            className="mobile-hamburger-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="fa-solid fa-bars"></i>
          </button>
          <span className="mobile-app-title">ADMIN PORTAL</span>
        </header>

        {/* Dynamic Inner Admin Page Content */}
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;