import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./css/Dashboard.css";
import "./css/ManageQuestions.css";

const ManageQuestions = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Skill ID passed from AssessmentList
  const skillId = location.state?.skillId || null;

  // UI State for Tabs
  const [activeTab, setActiveTab] = useState("current"); // 'current', 'bank', 'new'

  // Data States
  const [questions, setQuestions] = useState([]);
  const [bankQuestions, setBankQuestions] = useState([]);

  // Form States
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [marks, setMarks] = useState(1);
  const [difficulty, setDifficulty] = useState("Medium");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAssessmentQuestions();
    if (skillId) {
      loadBankQuestions();
    }
  }, [skillId]);

  // 1. Fetch questions currently in THIS assessment
  const loadAssessmentQuestions = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8081/question/manage/${assessmentId}`,
        { withCredentials: true }
      );
      setQuestions(res.data.questions || []);
    } catch (err) {
      console.log(err);
    }
  };

  // 2. Fetch questions from the global Question Bank (DEDUPLICATED)
  const loadBankQuestions = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8081/question/bank/${skillId}`,
        { withCredentials: true }
      );

      const uniqueQuestions = Array.from(
        new Map(
          (res.data.questions || []).map((item) => [item.question, item])
        ).values()
      );

      setBankQuestions(uniqueQuestions);
    } catch (err) {
      console.log("Could not load bank questions", err);
    }
  };

  const handleOptionChange = (index, value) => {
    const temp = [...options];
    temp[index] = value;
    setOptions(temp);
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setQuestionText(item.question);
    setOptions(item.options);
    setCorrectAnswer(item.correctAnswer.toString());
    setMarks(item.marks);
    setDifficulty(item.difficulty || "Medium");
    setActiveTab("new");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    resetForm();
    setActiveTab("current");
  };

  const resetForm = () => {
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("");
    setMarks(1);
    setDifficulty("Medium");
  };

  // 3. Add or Update a custom question from the form
  const addQuestion = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        assessment: assessmentId,
        skillId: skillId,
        question: questionText,
        options,
        correctAnswer: Number(correctAnswer),
        marks,
        difficulty,
      };

      if (editingId) {
        await axios.put(
          `http://localhost:8081/question/${editingId}`,
          payload,
          { withCredentials: true }
        );
        alert("Question Updated Successfully!");
      } else {
        await axios.post("http://localhost:8081/question", payload, {
          withCredentials: true,
        });
        alert("Question Added Successfully!");
      }

      resetForm();
      setEditingId(null);
      setActiveTab("current");
      loadAssessmentQuestions();
      if (skillId) loadBankQuestions();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Add a question directly from the Question Bank
  const addFromBank = async (bankItem) => {
    try {
      await axios.post(
        "http://localhost:8081/question",
        {
          assessment: assessmentId,
          skillId: bankItem.skillId,
          question: bankItem.question,
          options: bankItem.options,
          correctAnswer: bankItem.correctAnswer,
          marks: bankItem.marks,
          difficulty: bankItem.difficulty,
        },
        { withCredentials: true }
      );

      alert("Question added from Bank!");
      loadAssessmentQuestions();
      setActiveTab("current");
    } catch (err) {
      alert("Failed to add question from bank.");
    }
  };

  const deleteQuestion = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;
    try {
      await axios.delete(`http://localhost:8081/question/${id}`, {
        withCredentials: true,
      });
      loadAssessmentQuestions();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div
      className="dashboard-page-container"
      style={{
        paddingBottom: "40px",
        height: "calc(100vh - 70px)",
        overflowY: "auto",
        paddingRight: "10px",
      }}
    >
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
            Manage Questions
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>
            Add, edit, or pull questions from the repository into this test.
          </p>
        </div>

        <button
          className="btn-back-skills"
          onClick={() => navigate("/examiner/assessments")}
        >
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>
      </div>

      {/* Tab Selection Navigation */}
      <div className="d-flex gap-2 mb-4 flex-wrap pb-2 border-bottom border-secondary border-opacity-25">
        <button
          onClick={() => setActiveTab("current")}
          className="btn text-white fw-bold d-flex align-items-center gap-2"
          style={{
            borderRadius: "10px",
            padding: "10px 20px",
            fontSize: "13px",
            background:
              activeTab === "current"
                ? "var(--accent-purple)"
                : "rgba(255, 255, 255, 0.05)",
            border: "1px solid var(--card-border)",
          }}
        >
          <i className="fa-solid fa-list-check"></i> Current Questions ({questions.length})
        </button>

        <button
          onClick={() => setActiveTab("bank")}
          className="btn text-white fw-bold d-flex align-items-center gap-2"
          style={{
            borderRadius: "10px",
            padding: "10px 20px",
            fontSize: "13px",
            background:
              activeTab === "bank"
                ? "var(--accent-cyan)"
                : "rgba(255, 255, 255, 0.05)",
            border: "1px solid var(--card-border)",
          }}
        >
          <i className="fa-solid fa-database"></i> Question Bank
        </button>

        <button
          onClick={() => setActiveTab("new")}
          className="btn text-white fw-bold d-flex align-items-center gap-2"
          style={{
            borderRadius: "10px",
            padding: "10px 20px",
            fontSize: "13px",
            background:
              activeTab === "new"
                ? "#10b981"
                : "rgba(255, 255, 255, 0.05)",
            border: "1px solid var(--card-border)",
          }}
        >
          <i className="fa-solid fa-plus"></i> Create New Question
        </button>
      </div>

      {/* TAB CONTENT CONTAINER */}
      <div>
        {/* TAB 1: CURRENT QUESTIONS */}
        {activeTab === "current" && (
          <div className="d-flex flex-column gap-3">
            {questions.length === 0 ? (
              <div className="dashboard-card empty-state text-center p-5">
                <i
                  className="fa-solid fa-clipboard-list mb-3"
                  style={{ fontSize: "3rem", color: "var(--text-muted)" }}
                ></i>
                <h3 className="text-white fw-bold mb-2" style={{ fontSize: "18px" }}>
                  No Questions Added Yet
                </h3>
                <p className="card-subtext mb-4">
                  Use the tabs above to create custom questions or pull from the question bank.
                </p>
              </div>
            ) : (
              questions.map((item, index) => (
                <div key={item._id} className="dashboard-card">
                  <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                    <h3
                      className="text-white fw-bold m-0"
                      style={{ fontSize: "16px", lineHeight: "1.4" }}
                    >
                      {index + 1}. {item.question}
                    </h3>
                    <span
                      className="badge"
                      style={{
                        background: "rgba(6, 182, 212, 0.15)",
                        color: "var(--accent-cyan)",
                        border: "1px solid rgba(6, 182, 212, 0.3)",
                        padding: "6px 12px",
                        borderRadius: "10px",
                        fontSize: "11px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.difficulty || "Medium"} | {item.marks} Marks
                    </span>
                  </div>

                  {/* Options Grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                      gap: "0.5rem",
                      marginBottom: "1rem",
                    }}
                  >
                    {item.options.map((opt, optIndex) => {
                      const isCorrect = Number(item.correctAnswer) === optIndex;
                      return (
                        <div
                          key={optIndex}
                          style={{
                            padding: "10px 14px",
                            borderRadius: "8px",
                            fontSize: "13px",
                            background: isCorrect
                              ? "rgba(16, 185, 129, 0.15)"
                              : "rgba(255, 255, 255, 0.03)",
                            border: isCorrect
                              ? "1px solid rgba(16, 185, 129, 0.4)"
                              : "1px solid var(--card-border)",
                            color: isCorrect ? "#34d399" : "var(--text-main)",
                          }}
                        >
                          <strong className="me-2">
                            {String.fromCharCode(65 + optIndex)}.
                          </strong>
                          {opt}
                        </div>
                      );
                    })}
                  </div>

                  {/* Card Action Buttons */}
                  <div className="d-flex gap-2 pt-2 border-top border-secondary border-opacity-25">
                    <button
                      onClick={() => startEdit(item)}
                      className="btn btn-sm btn-outline-warning d-flex align-items-center gap-1"
                      style={{ borderRadius: "8px", fontWeight: "600" }}
                    >
                      <i className="fa-solid fa-pen-to-square"></i> Edit
                    </button>
                    <button
                      onClick={() => deleteQuestion(item._id)}
                      className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                      style={{ borderRadius: "8px", fontWeight: "600" }}
                    >
                      <i className="fa-solid fa-trash-can"></i> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: QUESTION BANK */}
        {activeTab === "bank" && (
          <div className="d-flex flex-column gap-3">
            {!skillId && (
              <div className="alert alert-danger bg-danger bg-opacity-10 text-danger border-danger border-opacity-25 mb-3">
                <i className="fa-solid fa-triangle-exclamation me-2"></i>
                Warning: No Subject Category linked to this assessment. Cannot filter question bank accurately.
              </div>
            )}

            {bankQuestions.length === 0 ? (
              <div className="dashboard-card text-center p-5">
                <p className="card-subtext m-0">
                  No unique questions found in the bank for this category.
                </p>
              </div>
            ) : (
              bankQuestions.map((item) => (
                <div
                  key={item._id}
                  className="dashboard-card"
                  style={{ borderStyle: "dashed" }}
                >
                  <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                    <h3 className="text-white fw-bold m-0" style={{ fontSize: "16px" }}>
                      {item.question}
                    </h3>
                    <span
                      className="badge"
                      style={{
                        background: "rgba(255, 255, 255, 0.08)",
                        color: "var(--text-muted)",
                        padding: "6px 12px",
                        borderRadius: "10px",
                        fontSize: "11px",
                      }}
                    >
                      {item.difficulty || "Medium"} | {item.marks} Marks
                    </span>
                  </div>

                  <button
                    onClick={() => addFromBank(item)}
                    className="btn-submit-assessment d-inline-flex align-items-center gap-2"
                    style={{ padding: "8px 16px", fontSize: "13px" }}
                  >
                    <i className="fa-solid fa-plus"></i> Add to Assessment
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: CREATE/EDIT FORM */}
        {activeTab === "new" && (
          <div className="dashboard-card">
            <h3 className="text-white fw-bold mb-4" style={{ fontSize: "18px" }}>
              {editingId ? "✏️ Edit Question" : "➕ Create New Question"}
            </h3>

            <form onSubmit={addQuestion} className="d-flex flex-column gap-3">
              <div className="form-group">
                <label htmlFor="qText">Question Text</label>
                <textarea
                  id="qText"
                  className="form-control"
                  style={{ minHeight: "90px" }}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  required
                  placeholder="Enter question statement..."
                />
              </div>

              <div className="form-group">
                <label>Options</label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "0.5rem",
                  }}
                >
                  {options.map((opt, i) => (
                    <div key={i}>
                      <input
                        className="form-control"
                        placeholder={`Option ${String.fromCharCode(65 + i)}`}
                        value={opt}
                        onChange={(e) => handleOptionChange(i, e.target.value)}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "1rem",
                }}
              >
                <div className="form-group">
                  <label htmlFor="cAns">Correct Answer</label>
                  <select
                    id="cAns"
                    className="form-control"
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select correct option...
                    </option>
                    <option value="0">Option A</option>
                    <option value="1">Option B</option>
                    <option value="2">Option C</option>
                    <option value="3">Option D</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="qDiff">Difficulty</label>
                  <select
                    id="qDiff"
                    className="form-control"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="qMarks">Marks</label>
                  <input
                    id="qMarks"
                    className="form-control"
                    type="number"
                    min="1"
                    value={marks}
                    onChange={(e) => setMarks(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="d-flex gap-2 mt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-submit-assessment flex-grow-1"
                >
                  {loading
                    ? "Saving..."
                    : editingId
                    ? "Update Question"
                    : "Save to Assessment & Bank"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="btn-back-skills"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageQuestions;