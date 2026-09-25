import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import main_logo from "../assets/main-logo.png";

import "./Header.css";

const Header = () => {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <header className="minimal-header">
      <div className="header-wrapper">
        
        {/* Brand */}
        <Link to="/" className="brand-link" onClick={closeMenu}>
          <img src={main_logo} alt="Logo" className="brand-logo"  />
          
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className={`menu-toggle ${open ? "is-active" : ""}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
        </button>

        {/* Navigation */}
        <nav className={`nav-menu ${open ? "is-open" : ""}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
            onClick={closeMenu}
          >
            Home
          </NavLink>

          <Link to="/login" className="btn-secondary" onClick={closeMenu}>
            Sign In
          </Link>

          <Link to="/register" className="btn-primary" onClick={closeMenu}>
            Get Started
          </Link>
        </nav>

      </div>
    </header>
  );
};

export default Header;