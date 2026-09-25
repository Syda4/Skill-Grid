import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axiosConfig";
import "./css/Dashboard.css";
import axios from "axios";

const LiveAssessment = () => {
  const navigate = useNavigate();

  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidateDashboardData();
  }, []);

  const fetchCandidateDashboardData = async () => {
    try {
      // Fetch user profile first

      // Fetch optional dashboard lists safely
      const [assessmentsRes] = await Promise.allSettled([
        axios.get("http://localhost:8081/candidate/assessments", {
          withCredentials: true,
        }),
      ]);

      if (assessmentsRes.status === "fulfilled") {
        setAssessments(assessmentsRes.value.data.assessments || []);
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
      <div className="d-flex justify-content-center align-items-center vh-100 text-light">
        <div className="spinner-border text-cyan" role="status"></div>
        <span className="ms-3 fw-semibold fs-5">Loading Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="profile-dashboard-wrapper p-4 text-white">
      {/* Top Banner Header */}
      <header className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
        <div>
          <h1 className="fw-bold fs-2 m-0 text-white d-flex align-items-center gap-2">
            <span>Available <span className="theme-gradient-text">Skill Assessments</span></span>
            <i className="fas fa-laptop-code text-cyan fs-3 ms-2"></i>
          </h1>
          <p className="subtext-gray m-0 mt-1 fs-6">
            Select an assessment to start your evaluation.
          </p>
        </div>

        {/* Counter Pill */}
        <div className="neon-status-pill">
          <i className="fas fa-list-check text-cyan"></i>
          <span>Available Tests: <b>{assessments.length}</b></span>
        </div>
      </header>

      {/* Main Container Card */}
      <div className="cyber-card p-4">
        {assessments.length === 0 ? (
          <p className="subtext-gray italic m-0">
            No published assessments available right now.
          </p>
        ) : (
          <div className="d-flex flex-column gap-3">
            {assessments.map((test) => (
              <div
                key={test._id}
                className="assessment-row-card p-3 p-md-4 rounded-3 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3"
              >
                {/* Left Side Info */}
                <div className="d-flex align-items-center gap-3">
                  <div className="assessment-code-icon">
                    <i className="fas fa-code"></i>
                  </div>
                  <div>
                    <strong className="block text-white fs-5 text-capitalize">
                      {test.title}
                    </strong>
                    <div className="d-flex flex-wrap align-items-center gap-3 fs-6 mt-1">
                      <span className="subtext-gray d-flex align-items-center gap-1">
                        <i className="far fa-clock text-cyan me-1"></i>
                        Duration: <strong className="text-white ms-1">{test.timeLimit} mins</strong>
                      </span>
                      <span className="text-secondary">•</span>
                      <span className="subtext-gray d-flex align-items-center gap-1">
                        <i className="fas fa-bullseye text-magenta me-1"></i>
                        Passing Score: <strong className="text-white ms-1">{test.minPassScore}%</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side Action Button */}
                <div className="align-self-end align-self-sm-center">
                  {test.attempted ? (
                    <button
                      disabled
                      className="completed-pill-btn"
                    >
                      Completed ✓
                    </button>
                  ) : (
                    <Link
                      to={`/candidate/assessment/${test._id}`}
                      className="cyber-btn primary-glow text-decoration-none px-4"
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
  );
};

export default LiveAssessment;