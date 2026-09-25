import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Dashboard.css";
import "./css/AssessmentList.css";

const AssessmentList = () => {
  const navigate = useNavigate();

  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAssessments();
  }, []);

  const getAssessments = async () => {
    try {
      const res = await axios.get("http://localhost:8081/examiner/my", {
        withCredentials: true,
      });
      setAssessments(res.data.assessments || []);
    } catch (err) {
      console.error("Failed to fetch assessments:", err);
    } finally {
      setLoading(false);
    }
  };

  const publishAssessment = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:8081/examiner/assessment/${id}/publish`,
        {},
        {
          withCredentials: true,
        }
      );

      alert(res.data.message);
      getAssessments();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to publish assessment");
    }
  };

  return (
    <div className="dashboard-page-container">
      {/* Header Action Banner */}
      <div
        className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4"
        style={{
          background: "linear-gradient(135deg, #1e293b, #0f172a)",
          color: "#e2e8f0",
          padding: "24px 28px",
          borderRadius: "16px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
          border: "1px solid var(--card-border)",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "800",
              marginBottom: "4px",
              color: "#ffffff",
            }}
          >
            My Assessments
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>
            View and manage all the skill tests you have created.
          </p>
        </div>

        <button
          className="btn-start border-0 d-inline-flex align-items-center gap-2"
          onClick={() => navigate("/examiner/create-assessment")}
          style={{
            padding: "10px 20px",
            borderRadius: "10px",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          <i className="fa-solid fa-plus"></i> Create New
        </button>
      </div>

      {/* Content Loading & Grid Area */}
      {loading ? (
        <div
          className="loading-container w-100 d-flex justify-content-center align-items-center"
          style={{ minHeight: "50vh" }}
        >
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Loading assessments...</span>
          </div>
        </div>
      ) : assessments.length === 0 ? (
        <div className="dashboard-card empty-state text-center p-5">
          <i
            className="fa-solid fa-folder-open mb-3"
            style={{ fontSize: "3rem", color: "var(--text-muted)" }}
          ></i>
          <h3 className="text-white fw-bold mb-2" style={{ fontSize: "18px" }}>
            No Assessments Found
          </h3>
          <p className="card-subtext mb-4">
            You haven't created any skill tests yet.
          </p>
          <button
            className="btn-start border-0"
            onClick={() => navigate("/examiner/create-assessment")}
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              fontSize: "13px",
            }}
          >
            Create Your First Assessment
          </button>
        </div>
      ) : (
        <div className="kpi-cards-grid">
          {assessments.map((assessment) => (
            <div
              key={assessment._id}
              className="dashboard-card d-flex flex-column justify-content-between h-100"
            >
              <div>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h3
                    className="text-white fw-bold m-0"
                    style={{ fontSize: "16px" }}
                  >
                    {assessment.title}
                  </h3>
                  <span
                    className={`badge ${
                      assessment.isPublished
                        ? "bg-success"
                        : "bg-warning text-dark"
                    }`}
                    style={{ fontSize: "10px", padding: "5px 8px" }}
                  >
                    {assessment.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                <p
                  className="card-subtext mb-4"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: "3",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {assessment.description}
                </p>
              </div>

              <div className="d-flex gap-2 mt-auto pt-3 border-top border-secondary border-opacity-25">
                {/* Manage Questions Button */}
                <button
                  className="btn-back-skills flex-grow-1 justify-content-center"
                  onClick={() =>
                    navigate(
                      `/examiner/manage-questions/${assessment._id}`,
                      {
                        state: { skillId: assessment.skillId },
                      }
                    )
                  }
                >
                  <i className="fa-solid fa-list-check"></i> Manage Questions
                </button>

                {/* Publish Action Button */}
                {!assessment.isPublished ? (
                  <button
                    className="btn btn-sm btn-success flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                    style={{
                      borderRadius: "10px",
                      fontWeight: "700",
                      fontSize: "12px",
                    }}
                    onClick={() => publishAssessment(assessment._id)}
                  >
                    <i className="fa-solid fa-upload"></i> Publish
                  </button>
                ) : (
                  <button
                    disabled
                    className="btn btn-sm btn-secondary flex-grow-1 opacity-50"
                    style={{
                      borderRadius: "10px",
                      fontWeight: "700",
                      fontSize: "12px",
                      cursor: "not-allowed",
                    }}
                  >
                    <i className="fa-solid fa-check"></i> Published
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssessmentList;