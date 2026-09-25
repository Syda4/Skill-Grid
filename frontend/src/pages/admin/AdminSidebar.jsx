import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import main_logo from "../../assets/main-logo.png";

function AdminSidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  const navItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: "fa-solid fa-chart-pie",
    },
    {
      path: "/admin/assign-assignment",
      label: "Assign Assessment",
      icon: "fa-solid fa-paper-plane",
    },
    {
      path: "/admin/published-assessments",
      label: "Published Assessments",
      icon: "fa-solid fa-file-circle-check",
    },
    {
      path: "/admin/assignment-history",
      label: "Assignment History",
      icon: "fa-solid fa-clock-rotate-left",
    },
    {
      path: "/admin/registered-candidate",
      label: "Candidates",
      icon: "fa-solid fa-user",
    },
    {
      path: "/admin/profile",
      label: "Profile",
      icon: "fa-solid fa-user-shield",
    },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          className="custom-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`custom-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="custom-sidebar-top">
          <img src={main_logo} className="custom-sidebar-logo" alt="Logo" />
        </div>

        <nav className="custom-sidebar-menu">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`custom-nav-link ${
                location.pathname === item.path ? "active" : ""
              }`}
              onClick={() => {
                setSidebarOpen(false);
                navigate(item.path);
              }}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="custom-spacer"></div>

        <button className="custom-logout-btn" onClick={handleLogout}>
          <i className="fa-solid fa-right-from-bracket"></i>
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
}

export default AdminSidebar;