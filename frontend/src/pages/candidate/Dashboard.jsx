import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axiosConfig";
import "./css/Dashboard.css";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidateDashboardData();
  }, []);

  const fetchCandidateDashboardData = async () => {
    try {
      // Fetch user profile first
      const userRes = await axios.get(
        "http://localhost:8081/candidate/dashboard",
        {
          withCredentials: true,
        },
      );
      setUser(userRes.data.user);

      // Fetch optional dashboard lists safely
      const [assessmentsRes, certsRes] = await Promise.allSettled([
        axios.get("http://localhost:8081/candidate/assessments", {
          withCredentials: true,
        }),
        axios.get("http://localhost:8081/certificate/my", {
          withCredentials: true,
        }),
      ]);

      if (assessmentsRes.status === "fulfilled") {
        setAssessments(assessmentsRes.value.data.assessments || []);
      }
      if (certsRes.status === "fulfilled") {
        setCertificates(certsRes.value.data.certificates || []);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="dashboard-page-container">
      {/* Dashboard Section Heading */}
      <div className="dashboard-header-title">
        <h1>DASHBOARD</h1>
      </div>

      {/* Main Dashboard Content */}
      <div className="dashboard-body">
        {/* KPI Cards Row */}
        <div className="kpi-cards-grid">
          {/* Account Status */}
          <div className="kpi-card card-yellow">
            <div className="kpi-info">
              <span className="kpi-value">
                {user.isVerified ? "100%" : "50%"}
              </span>
              <span className="kpi-label">ACCOUNT STATUS</span>
            </div>
            <div className="kpi-icon-wrap">
              <i className="fas fa-user-check"></i>
            </div>
          </div>

          {/* Available Tests */}
          <div className="kpi-card card-purple">
            <div className="kpi-info">
              <span className="kpi-value">{assessments.length}</span>
              <span className="kpi-label">AVAILABLE TESTS</span>
            </div>
            <div className="kpi-icon-wrap">
              <i className="fas fa-file-alt"></i>
            </div>
          </div>

          {/* Certificates */}
          <div className="kpi-card card-cyan">
            <div className="kpi-info">
              <span className="kpi-value">{certificates.length}</span>
              <span className="kpi-label">CERTIFICATES</span>
            </div>
            <div className="kpi-icon-wrap">
              <i className="fas fa-award"></i>
            </div>
          </div>

          {/* Role */}
          <div className="kpi-card card-pink">
            <div className="kpi-info">
              <span className="kpi-value capitalize">{user.role}</span>
              <span className="kpi-label">CURRENT ROLE</span>
            </div>
            <div className="kpi-icon-wrap">
              <i className="fas fa-user-tag"></i>
            </div>
          </div>
        </div>

        {/* Content Row 1 */}
        <div className="content-grid-row two-cols">
          {/* Profile Card */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>
                <i className="fas fa-id-card card-title-icon"></i> Profile
                Information
              </h3>
              <div className="card-controls">
                <span>+</span>
                <span>×</span>
              </div>
            </div>
            <div className="card-body">
              <div className="profile-details-list">
                <div className="profile-detail-item">
                  <span className="detail-label">Full Name</span>
                  <span className="detail-value">{user.name}</span>
                </div>
                <div className="profile-detail-item">
                  <span className="detail-label">Email Address</span>
                  <span className="detail-value">{user.email}</span>
                </div>
                <div className="profile-detail-item">
                  <span className="detail-label">Phone Number</span>
                  <span className="detail-value">
                    {user.phone_no || "Not Added"}
                  </span>
                </div>
                <div className="profile-detail-item">
                  <span className="detail-label">Verification</span>
                  <span
                    className={`detail-value ${user.isVerified ? "status-verified" : "status-pending"}`}
                  >
                    {user.isVerified ? "VERIFIED ✓" : "PENDING"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Available Skill Assessments Card */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>
                <i className="fas fa-laptop-code card-title-icon"></i> Available
                Skill Assessments
              </h3>
              <div className="card-controls">
                <span>+</span>
                <span>×</span>
              </div>
            </div>
            <div className="card-body">
              <p className="card-subtext mb-3">
                Select an assessment to evaluate your skills.
              </p>
              {assessments.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-inbox"></i>
                  <p>No published assessments available right now.</p>
                </div>
              ) : (
                <div className="items-list">
                  {assessments.map((test) => (
                    <div key={test._id} className="list-item-card">
                      <div className="list-item-info">
                        <i className="fas fa-code item-icon"></i>
                        <div>
                          <strong className="item-title">{test.title}</strong>
                          <p className="item-subtext">
                            Duration: {test.timeLimit} mins | Pass Score:{" "}
                            {test.minPassScore}%
                          </p>
                        </div>
                      </div>
                      <div className="list-item-action">
                        {test.attempted ? (
                          <button disabled className="btn-completed">
                            Completed ✓
                          </button>
                        ) : (
                          <Link
                            to={`/candidate/assessment/${test._id}`}
                            className="btn-start"
                          >
                            Start Test
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Certificates Section */}
        <div className="content-grid-row full-width">
          <div className="dashboard-card">
            <div className="card-header">
              <h3>
                <i className="fas fa-graduation-cap card-title-icon"></i> Earned
                Certificates
              </h3>
              <div className="card-controls">
                <span>+</span>
                <span>×</span>
              </div>
            </div>
            <div className="card-body">
              {certificates.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-award"></i>
                  <p>
                    No certificates earned yet. Pass an assessment to issue your
                    digital certificate.
                  </p>
                </div>
              ) : (
                <div className="certificates-grid">
                  {certificates.map((cert) => (
                    <div key={cert._id} className="certificate-card-item">
                      <div className="cert-card-left">
                        <i className="fas fa-certificate cert-icon"></i>
                        <div>
                          <strong className="cert-title">
                            {cert.assessmentTitle}
                          </strong>
                          <p className="cert-date">
                            Issued:{" "}
                            {new Date(cert.issueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Link
                        to={`/candidate/verify-certificate/${cert.certificateCode}`}
                        className="btn-verify"
                      >
                        View & Verify
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
