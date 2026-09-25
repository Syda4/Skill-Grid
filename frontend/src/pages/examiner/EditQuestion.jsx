import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// Ensure this path is correct for your project
import api from "../../service/api";
// Import global dashboard CSS and local form CSS
import "./css/Dashboard.css";
import "./css/EditQuestion.css";

const EditQuestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Your friend's exact state structure
  const [question, setQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    marks: 1,
  });

  const [loading, setLoading] = useState(true);

  // Your friend's data fetch logic
  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.get(`/question/single/${id}`);
      setQuestion(res.data.question);
    } catch (err) {
      console.error("Failed to load question", err);
      alert("Error loading question data.");
    } finally {
      setLoading(false);
    }
  };

  // Your friend's update submission logic
  const update = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/question/${id}`, question);
      alert("Question Updated Successfully!");
      navigate(-1); // Takes the user back to the previous page automatically
    } catch (err) {
      console.error(err);
      alert("Failed to update question.");
    }
  };

  if (loading) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Loading Question Data...
      </h2>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* 1. Sidebar */}
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
            <h1>Edit Question</h1>
            <p>Modify the question text, options, and scoring.</p>
          </div>
          <button
            className="logout-btn"
            onClick={() => navigate(-1)}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              background: "white",
            }}
          >
            <i className="fas fa-arrow-left"></i> Cancel
          </button>
        </div>

        {/* 3. The Form Card */}
        <div className="question-form-card">
          <form onSubmit={update}>
            <div className="form-group">
              <label>Question Text</label>
              <textarea
                className="form-control"
                value={question.question}
                placeholder="Type the question here..."
                onChange={(e) =>
                  setQuestion({ ...question, question: e.target.value })
                }
                required
              />
            </div>

            <label
              style={{
                display: "block",
                marginBottom: "10px",
                color: "#334155",
                fontWeight: "600",
              }}
            >
              Answer Options
            </label>
            <div className="options-grid">
              {question.options.map((opt, index) => (
                <div className="form-group" key={index}>
                  <input
                    className="form-control"
                    placeholder={`Option ${index + 1}`}
                    value={opt}
                    required
                    onChange={(e) => {
                      // Your friend's logic to update a specific array index
                      let arr = [...question.options];
                      arr[index] = e.target.value;
                      setQuestion({ ...question, options: arr });
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="form-row">
              {/* I added this dropdown so you can actually set the correctAnswer! */}
              <div className="form-group">
                <label>Correct Answer</label>
                <select
                  className="form-control"
                  value={question.correctAnswer}
                  onChange={(e) =>
                    setQuestion({ ...question, correctAnswer: e.target.value })
                  }
                  required
                >
                  <option value="" disabled>
                    Select correct option...
                  </option>
                  {question.options.map(
                    (opt, index) =>
                      // Only show options that aren't empty so the dropdown looks clean
                      opt.trim() !== "" && (
                        <option key={index} value={opt}>
                          {opt}
                        </option>
                      ),
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>Marks</label>
                <input
                  className="form-control"
                  type="number"
                  min="1"
                  value={question.marks}
                  onChange={(e) =>
                    setQuestion({ ...question, marks: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <button type="submit" className="submit-btn">
              <i className="fas fa-save"></i> Save Changes
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditQuestion;
