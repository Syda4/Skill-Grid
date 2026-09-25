import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../service/api";
import "./css/CreateAssessment.css";

const CreateAssessment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Grab skill data passed from SelectSkill; fallback to General
  const selectedSkill = location.state || { skillId: null, skillName: "General" };

  // Form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    totalMarks: "",
    passingMarks: "",
    skillId: selectedSkill.skillId,
  });

  const [loading, setLoading] = useState(false);

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/examiner/assessment", form);
      alert("Assessment Created Successfully!");
      
      const createdId = res.data?.assessment?._id || res.data?._id;
      if (createdId) {
        // FIX: Pass the skillId in the background state!
        navigate(`/examiner/manage-questions/${createdId}`, {
          state: { skillId: form.skillId }
        });
      } else {
        navigate("/examiner/assessments");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create assessment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="dashboard-page-container" 
      style={{ 
        paddingBottom: "40px", 
        height: "calc(100vh - 70px)", 
        overflowY: "auto",
        paddingRight: "10px" 
      }}
    >
      {/* Header Action Bar */}
      <div className="dashboard-header-title d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h1 className="m-0 text-white fw-bold">
            Create {selectedSkill.skillName} Assessment
          </h1>
          <p className="card-subtext mt-1 m-0 text-muted" style={{ fontSize: "13px" }}>
            Define the parameters and rules for your new skill test.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-sm btn-outline-light d-flex align-items-center gap-2"
          onClick={() => navigate("/examiner/create-assessment")}
          style={{
            borderRadius: "10px",
            padding: "8px 16px",
            fontWeight: "600",
            fontSize: "13px",
          }}
        >
          <i className="fa-solid fa-arrow-left"></i> Back to Skills
        </button>
      </div>

      {/* Form Card Container */}
      <div className="dashboard-card p-4" style={{ marginBottom: "20px" }}>
        <form onSubmit={submit} className="d-flex flex-column gap-3">
          {/* Assessment Title */}
          <div className="form-group">
            <label
              htmlFor="title"
              className="detail-label mb-2 d-block text-white font-weight-bold"
              style={{ fontSize: "13px" }}
            >
              Assessment Title
            </label>
            <input
              id="title"
              className="form-control bg-dark text-white border-secondary"
              style={{
                borderRadius: "10px",
                padding: "12px 16px",
                fontSize: "14px",
              }}
              name="title"
              placeholder="e.g. Advanced JavaScript Fundamentals"
              value={form.title}
              onChange={change}
              required
            />
          </div>

          {/* Description & Instructions */}
          <div className="form-group">
            <label
              htmlFor="description"
              className="detail-label mb-2 d-block text-white font-weight-bold"
              style={{ fontSize: "13px" }}
            >
              Description & Instructions
            </label>
            <textarea
              id="description"
              className="form-control bg-dark text-white border-secondary"
              style={{
                borderRadius: "10px",
                padding: "12px 16px",
                fontSize: "14px",
                minHeight: "90px",
              }}
              name="description"
              placeholder="Briefly describe what this assessment covers and any specific instructions for the candidates."
              value={form.description}
              onChange={change}
              required
            />
          </div>

          {/* Numerical Parameters Grid Row */}
          <div 
            style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", 
              gap: "1rem" 
            }}
          >
            <div className="form-group">
              <label
                htmlFor="duration"
                className="detail-label mb-2 d-block text-white font-weight-bold"
                style={{ fontSize: "13px" }}
              >
                Duration (Minutes)
              </label>
              <input
                id="duration"
                className="form-control bg-dark text-white border-secondary"
                style={{
                  borderRadius: "10px",
                  padding: "12px 16px",
                  fontSize: "14px",
                }}
                type="number"
                name="duration"
                placeholder="e.g. 60"
                value={form.duration}
                onChange={change}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="totalMarks"
                className="detail-label mb-2 d-block text-white font-weight-bold"
                style={{ fontSize: "13px" }}
              >
                Total Marks
              </label>
              <input
                id="totalMarks"
                className="form-control bg-dark text-white border-secondary"
                style={{
                  borderRadius: "10px",
                  padding: "12px 16px",
                  fontSize: "14px",
                }}
                type="number"
                name="totalMarks"
                placeholder="e.g. 100"
                value={form.totalMarks}
                onChange={change}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="passingMarks"
                className="detail-label mb-2 d-block text-white font-weight-bold"
                style={{ fontSize: "13px" }}
              >
                Passing Marks
              </label>
              <input
                id="passingMarks"
                className="form-control bg-dark text-white border-secondary"
                style={{
                  borderRadius: "10px",
                  padding: "12px 16px",
                  fontSize: "14px",
                }}
                type="number"
                name="passingMarks"
                placeholder="e.g. 40"
                value={form.passingMarks}
                onChange={change}
                min="1"
                required
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary border-0 d-inline-flex align-items-center gap-2"
              style={{
                padding: "12px 28px",
                fontSize: "14px",
                fontWeight: "600",
                borderRadius: "10px",
                backgroundColor: "#0ea5e9",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              <i className="fa-solid fa-floppy-disk"></i>{" "}
              {loading ? "Saving..." : "Save & Create Assessment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAssessment;