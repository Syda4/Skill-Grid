import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./css/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [data, setData] = useState({ user: {}, stats: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard();
  }, []);

  const getDashboard = async () => {
    try {
      const res = await axios.get("http://localhost:8081/examiner/dashboard", {
        withCredentials: true,
      });

      setData({
        user: res.data.user || {
          name: "Examiner",
          email: "Loading...",
          role: "examiner",
        },
        stats: res.data.stats || {
          students: 0,
          assessments: 0,
          questions: 0,
          certificates: 0,
        },
      });
    } catch (err) {
      console.error(
        "BACKEND REJECTION REASON:",
        err.response ? err.response.data : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8081/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.log(err);
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      if (setUser) setUser(null);
      window.location.replace("/login");
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center w-100"
        style={{ minHeight: "60vh" }}
      >
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page-container">
      {/* Header Card / Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #4f46e5, #9333ea)",
          color: "#fff",
          padding: "24px 28px",
          borderRadius: "16px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "800",
              marginBottom: "6px",
              color: "#ffffff",
            }}
          >
            Welcome back,{" "}
            <span style={{ color: "#fde68a", fontWeight: "800" }}>
              {data.user.name}
            </span>{" "}
            👋
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "rgba(255, 255, 255, 0.85)",
              marginBottom: "6px",
            }}
          >
            {data.user.email}
          </p>
          <p
            style={{
              display: "inline-block",
              padding: "4px 12px",
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "600",
              backdropFilter: "blur(8px)",
              margin: 0,
            }}
          >
            Role: <span className="capitalize">{data.user.role}</span>
          </p>
        </div>

        <button
          onClick={handleLogout}
          style={{
            background: "#ffffff",
            color: "#4f46e5",
            border: "none",
            padding: "10px 20px",
            borderRadius: "25px",
            fontWeight: "700",
            fontSize: "13px",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.target.style.background = "#fde68a";
            e.target.style.color = "#000";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "#ffffff";
            e.target.style.color = "#4f46e5";
          }}
        >
          Logout
        </button>
      </div>

      <div className="dashboard-body">
        {/* Top 4 Stats using Design System KPI Cards */}
        <div className="kpi-cards-grid">
          <div className="kpi-card card-cyan">
            <div className="kpi-info">
              <span className="kpi-value">{data.stats.students}</span>
              <span className="kpi-label">TOTAL STUDENTS</span>
            </div>
            <div className="kpi-icon-wrap">
              <i className="fa-solid fa-users"></i>
            </div>
          </div>

          <div className="kpi-card card-purple">
            <div className="kpi-info">
              <span className="kpi-value">{data.stats.assessments}</span>
              <span className="kpi-label">ASSESSMENTS</span>
            </div>
            <div className="kpi-icon-wrap">
              <i className="fa-solid fa-file-lines"></i>
            </div>
          </div>

          <div className="kpi-card card-yellow">
            <div className="kpi-info">
              <span className="kpi-value">{data.stats.questions}</span>
              <span className="kpi-label">QUESTIONS</span>
            </div>
            <div className="kpi-icon-wrap">
              <i className="fa-solid fa-circle-question"></i>
            </div>
          </div>

          <div className="kpi-card card-pink">
            <div className="kpi-info">
              <span className="kpi-value">{data.stats.certificates}</span>
              <span className="kpi-label">CERTIFICATES</span>
            </div>
            <div className="kpi-icon-wrap">
              <i className="fa-solid fa-certificate"></i>
            </div>
          </div>
        </div>

        {/* Content Grid: Actions & Profile */}
        <div className="content-grid-row two-cols">
          {/* Quick Actions */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>
                <i className="fa-solid fa-bolt card-title-icon"></i>
                Examiner Actions
              </h3>
            </div>
            <p className="card-subtext mb-3">
              Create new tests and review student submissions.
            </p>

            <div className="items-list">
              <div
                className="list-item-card"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/examiner/create-assessment")}
              >
                <div className="list-item-info">
                  <i className="fa-solid fa-circle-plus item-icon"></i>
                  <div>
                    <strong className="item-title">Create Assessment</strong>
                    <span className="item-subtext">
                      Draft a new skill test or challenge.
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="list-item-card"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/examiner/assessments")}
              >
                <div className="list-item-info">
                  <i className="fa-solid fa-list-check item-icon"></i>
                  <div>
                    <strong className="item-title">Manage Assessments</strong>
                    <span className="item-subtext">
                      View, edit, and grade active tests.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>
                <i className="fa-solid fa-id-card card-title-icon"></i>
                Profile Information
              </h3>
            </div>

            <div className="profile-details-list">
              <div className="profile-detail-item">
                <span className="detail-label">Name</span>
                <span className="detail-value">{data.user.name}</span>
              </div>

              <div className="profile-detail-item">
                <span className="detail-label">Email</span>
                <span className="detail-value">{data.user.email}</span>
              </div>

              <div className="profile-detail-item">
                <span className="detail-label">Role</span>
                <span className="detail-value capitalize">{data.user.role}</span>
              </div>

              <div className="profile-detail-item">
                <span className="detail-label">Department</span>
                <span className="detail-value">Examination Board</span>
              </div>

              <div className="profile-detail-item">
                <span className="detail-label">Status</span>
                <span className="detail-value status-verified">
                  <i className="fa-solid fa-circle-check me-1"></i> Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;