import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// Make sure this points to your friend's actual api file
import api from "../../service/api";
import "./css/Dashboard.css"; // Global dashboard layout
import "./css/ViewResults.css"; // Specific table layout

const ViewResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.get(`/examiner/results/${id}`);
      setResults(res.data.results);
    } catch (err) {
      console.error("Failed to fetch results:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to assign the correct CSS class based on status text
  const getStatusClass = (status) => {
    if (!status) return "status-badge pending";
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes("pass")) return "status-badge pass";
    if (lowerStatus.includes("fail")) return "status-badge fail";
    return "status-badge pending";
  };

  return (
    <div className="dashboard-layout">
      {/* 1. Global Sidebar */}
      <nav className="sidebar">
        <div
          className="sidebar-logo"
          style={{ fontSize: "24px", fontWeight: "bold", color: "#2563eb" }}
        >
          URV
        </div>

        <button
          className="nav-item"
          onClick={() => navigate("/examiner/dashboard")}
          title="Dashboard"
        >
          <i className="fas fa-home"></i>
        </button>

        <button
          className="nav-item"
          onClick={() => navigate("/examiner/create-assessment")}
          title="Create Assessment"
        >
          <i className="fas fa-plus-circle"></i>
        </button>

        <button
          className="nav-item active"
          onClick={() => navigate("/examiner/assessments")}
          title="My Assessments"
        >
          <i className="fas fa-list-ul"></i>
        </button>

        <div className="spacer"></div>
      </nav>

      {/* 2. Main Content Area */}
      <main className="dashboard-main">
        <div className="header-actions">
          <div className="dashboard-header" style={{ marginBottom: 0 }}>
            <h1>Assessment Results</h1>
            <p>View candidate scores and performance statuses.</p>
          </div>

          <button
            className="btn-secondary"
            onClick={() => navigate("/examiner/assessments")}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              cursor: "pointer",
              background: "white",
            }}
          >
            <i className="fas fa-arrow-left"></i> Back to Assessments
          </button>
        </div>

        {/* 3. Results Table */}
        {loading ? (
          <h2
            style={{ textAlign: "center", marginTop: "50px", color: "#64748b" }}
          >
            Loading results...
          </h2>
        ) : (
          <div className="results-container">
            {results.length === 0 ? (
              <div className="empty-state" style={{ border: "none" }}>
                <i
                  className="fas fa-user-graduate"
                  style={{ fontSize: "3rem", color: "#cbd5e1" }}
                ></i>
                <h3>No Submissions Yet</h3>
                <p>No candidates have completed this assessment.</p>
              </div>
            ) : (
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Candidate Name</th>
                    <th>Score</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r) => (
                    <tr key={r._id}>
                      {/* Assuming your backend populates the user object */}
                      <td style={{ fontWeight: "500", color: "#0f172a" }}>
                        {r.user?.name || "Unknown Candidate"}
                      </td>

                      <td>
                        <strong>{r.score}</strong>
                      </td>

                      <td>
                        <span className={getStatusClass(r.status)}>
                          {r.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ViewResults;
