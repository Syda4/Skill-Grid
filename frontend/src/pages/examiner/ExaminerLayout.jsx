import React, { useState, useContext } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./css/Dashboard.css";
import main_logo from "../../assets/main-logo.png";

const ExaminerLayout = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8081/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Logout API Error:", err);
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      if (setUser) setUser(null);
      window.location.replace("/login");
    }
  };

  return (
    <div className="custom-dashboard-layout">
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          className="custom-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Persistent Sidebar */}
      <aside className={`custom-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="custom-sidebar-top">
          <img src={main_logo} className="custom-sidebar-logo" alt="Logo" />
        </div>

        <nav className="custom-sidebar-menu">
          <NavLink
            to="/examiner/dashboard"
            className={({ isActive }) =>
              `custom-nav-link ${isActive ? "active" : ""}`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <i className="fa-solid fa-chart-pie"></i>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/examiner/create-assessment"
            className={({ isActive }) =>
              `custom-nav-link ${isActive ? "active" : ""}`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <i className="fa-solid fa-circle-plus"></i>
            <span>Create Assessment</span>
          </NavLink>

          <NavLink
            to="/examiner/assessments"
            className={({ isActive }) =>
              `custom-nav-link ${isActive ? "active" : ""}`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <i className="fa-solid fa-list-check"></i>
            <span>My Assessments</span>
          </NavLink>

          <NavLink
            to="/examiner/analytics"
            className={({ isActive }) =>
              `custom-nav-link ${isActive ? "active" : ""}`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <i className="fa-solid fa-chart-line"></i>
            <span>Analytics</span>
          </NavLink>

          {/* Added Profile Link */}
          <NavLink
            to="/examiner/profile"
            className={({ isActive }) =>
              `custom-nav-link ${isActive ? "active" : ""}`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <i className="fa-solid fa-user-tie"></i>
            <span>Profile</span>
          </NavLink>
        </nav>

        <div className="custom-spacer"></div>

        <button className="custom-logout-btn" onClick={handleLogout}>
          <i className="fa-solid fa-right-from-bracket"></i>
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Container */}
      <main className="custom-dashboard-main">
        {/* Mobile Header Bar */}
        <header className="mobile-header-bar">
          <button
            className="mobile-hamburger-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="fa-solid fa-bars"></i>
          </button>
          <span className="mobile-app-title">EXAMINER PORTAL</span>
        </header>

        {/* Dynamic Nested View Renders Here */}
        <Outlet />
      </main>
    </div>
  );
};

export default ExaminerLayout;