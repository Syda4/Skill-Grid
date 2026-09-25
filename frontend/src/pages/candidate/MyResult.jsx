import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/MyResults.css";

const MyResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const res = await axios.get("http://localhost:8081/result/my-results", {
        withCredentials: true,
      });

      setResults(res.data.results || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="results-loading">
        <i className="fas fa-spinner fa-spin"></i>
        <span>Loading Assessment Results...</span>
      </div>
    );
  }

  return (
    <div className="results-page-container">
      {/* Page Title Header */}
      <div className="results-header">
        <div>
          <h2>My Results 📊</h2>
          <p>Review your assessment scores and performance history.</p>
        </div>
        <div className="results-badge gradient-orange">
          <i className="fas fa-poll"></i>
          <span>Total Taken: {results.length}</span>
        </div>
      </div>

      {/* Main Results Table Card */}
      <div className="results-card">
        {results.length === 0 ? (
          <div className="empty-results">
            <i className="fas fa-folder-open"></i>
            <p>No assessment results found yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="futuristic-table">
              <thead>
                <tr>
                  <th>Assessment</th>
                  <th>Score</th>
                  <th>Total</th>
                  <th>Percentage</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((item) => {
                  const statusLower = item.status?.toLowerCase() || "";
                  const isPassed = statusLower === "passed" || statusLower === "pass";

                  // Dynamic color band based on score percentage
                  const isHighGrade = item.percentage >= 75;
                  const isMidGrade = item.percentage >= 50 && item.percentage < 75;

                  return (
                    <tr
                      key={item._id}
                      className={isPassed ? "row-pass" : "row-fail"}
                    >
                      <td className="assessment-title-cell">
                        <i className={`fas fa-code icon-title ${isPassed ? "green-glow" : "red-glow"}`}></i>
                        <span>{item.assessment?.title || "Assessment"}</span>
                      </td>

                      <td className="score-cell">{item.score}</td>
                      <td className="total-cell">{item.totalMarks}</td>

                      {/* Percentage Column with Dynamic Color Gradient Bar */}
                      <td className="percentage-cell">
                        <div className="percent-wrapper">
                          <span
                            className={`percent-text ${
                              isHighGrade
                                ? "text-green"
                                : isMidGrade
                                ? "text-orange"
                                : "text-red"
                            }`}
                          >
                            {item.percentage}%
                          </span>
                          <div className="mini-progress-bar">
                            <div
                              className={`mini-progress-fill ${
                                isHighGrade
                                  ? "gradient-fill-green"
                                  : isMidGrade
                                  ? "gradient-fill-orange"
                                  : "gradient-fill-red"
                              }`}
                              style={{ width: `${Math.min(item.percentage, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* Status Column with Red/Green Pills */}
                      <td>
                        <span
                          className={`status-pill ${
                            isPassed ? "status-passed" : "status-failed"
                          }`}
                        >
                          <i
                            className={
                              isPassed
                                ? "fas fa-check-circle"
                                : "fas fa-times-circle"
                            }
                          ></i>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyResults;