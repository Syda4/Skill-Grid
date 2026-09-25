import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../candidate/css/Dashboard.css"; // Uses candidate CSS

const AdminProfile = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminProfile();
  }, []);

  const getAdminProfile = async () => {
    // List of common profile endpoints in Express backends
    const endpoints = [
      "http://localhost:8081/admin/dashboard",
      "http://localhost:8081/admin/profile",
      "http://localhost:8081/auth/me",
      "http://localhost:8081/user/profile",
    ];

    let foundData = null;

    for (const url of endpoints) {
      try {
        const res = await axios.get(url, { withCredentials: true });
        console.log(`Success fetching from ${url}:`, res.data);
        
        // Extract user data regardless of how backend wraps it
        foundData = res.data?.user || res.data?.admin || res.data?.data || res.data;
        if (foundData && (foundData.name || foundData.email)) {
          setAdmin(foundData);
          break; // Stop loop as soon as valid user data is found
        }
      } catch (err) {
        console.log(`Endpoint ${url} failed with status:`, err.response?.status || err.message);
      }
    }

    if (!foundData) {
      console.warn("Could not fetch admin profile from tested endpoints. Please check your Express routes.");
    }

    setLoading(false);
  };

  const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 text-light">
        <div className="spinner-border text-cyan" role="status"></div>
        <span className="ms-3 fw-semibold">Loading Admin Profile...</span>
      </div>
    );
  }

  return (
    <div className="profile-dashboard-wrapper p-4">
      {/* Header Banner */}
      <header className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
        <div>
          <h1 className="fw-bold fs-2 m-0 text-white d-flex align-items-center gap-2">
            <span>
              {(() => {
                const hour = new Date().getHours();
                if (hour < 12) return "Good morning";
                if (hour < 18) return "Good afternoon";
                return "Good evening";
              })()}
              ,{" "}
              <span className="theme-gradient-text">
                {admin?.name ? capitalize(admin.name.split(" ")[0]) : "Admin"}
              </span>!
            </span>
            <span className="wave-emoji">👋</span>
          </h1>
          <p className="subtext-gray m-0 mt-1 fs-6">
            Welcome back to your workspace. Here’s a detailed overview of your admin account.
          </p>
        </div>

        <div className="neon-status-pill">
          <span className="pulse-dot-green"></span>
          <span>Active Session</span>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="row g-4">
        {/* Profile Card */}
        <div className="col-lg-4">
          <div className="cyber-card profile-card text-center p-4 h-100 d-flex flex-column align-items-center justify-content-center">
            <div className="avatar-glow-ring mb-3">
              <i className="fas fa-user-shield avatar-icon text-cyan"></i>
            </div>

            <h2 className="fw-bold fs-3 text-white mb-1 text-capitalize">
              {admin?.name || "Admin Name"}
            </h2>
            <p className="role-tag mb-3 text-uppercase">{admin?.role || "ADMIN"}</p>

            <div className={`status-pill-badge ${admin?.isVerified ? "verified" : "pending"}`}>
              <i className={`fas ${admin?.isVerified ? "fa-check-circle" : "fa-exclamation-circle"} me-2`}></i>
              {admin?.isVerified ? "Verified Account" : "Pending Verification"}
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="col-lg-8">
          <div className="cyber-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary border-opacity-25 pb-3">
              <h3 className="fs-5 fw-bold m-0 theme-gradient-text">Personal Details</h3>
              <span className="info-chip">
                <i className="fas fa-shield-alt me-1"></i> Secure Profile
              </span>
            </div>

            <div className="details-list">
              <div className="detail-item">
                <div className="detail-label">
                  <i className="fas fa-user icon-cyan"></i>
                  <span>Full Name</span>
                </div>
                <div className="detail-value text-capitalize">{admin?.name || "—"}</div>
              </div>

              <div className="detail-item">
                <div className="detail-label">
                  <i className="fas fa-envelope icon-magenta"></i>
                  <span>Email Address</span>
                </div>
                <div className="detail-value">{admin?.email || "—"}</div>
              </div>

              <div className="detail-item">
                <div className="detail-label">
                  <i className="fas fa-phone icon-purple"></i>
                  <span>Phone Number</span>
                </div>
                <div className="detail-value">{admin?.phone_no || "Not Added"}</div>
              </div>

              <div className="detail-item">
                <div className="detail-label">
                  <i className="fas fa-id-badge icon-amber"></i>
                  <span>Account Role</span>
                </div>
                <div className="detail-value text-uppercase">{admin?.role || "ADMIN"}</div>
              </div>

              <div className="detail-item border-0">
                <div className="detail-label">
                  <i className="fas fa-check-double icon-green"></i>
                  <span>Email Status</span>
                </div>
                <div className="detail-value">
                  <span className={`status-text-pill ${admin?.isVerified ? "is-verified" : "is-pending"}`}>
                    {admin?.isVerified ? "Verified" : "Unverified"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="row g-4 mt-1">
        <div className="col-md-4">
          <div className="cyber-widget widget-cyan">
            <div className="widget-icon">
              <i className="fas fa-user-check"></i>
            </div>
            <div>
              <p className="widget-title">Account</p>
              <h4 className="widget-value">{admin?.isActive !== false ? "Active" : "Inactive"}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="cyber-widget widget-green">
            <div className="widget-icon">
              <i className="fas fa-envelope"></i>
            </div>
            <div>
              <p className="widget-title">Email Status</p>
              <h4 className="widget-value">
                {admin?.isVerified ? "Verified" : "Unverified"}
              </h4>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="cyber-widget widget-orange">
            <div className="widget-icon">
              <i className="fas fa-phone-alt"></i>
            </div>
            <div>
              <p className="widget-title">Phone</p>
              <h4 className="widget-value">
                {admin?.phone_no ? "Connected" : "Pending"}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;