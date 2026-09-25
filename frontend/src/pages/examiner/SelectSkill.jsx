import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Dashboard.css";
import "./css/SelectSkill.css";

const SelectSkill = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // State to toggle the "Add Skill" form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: "", description: "" });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await axios.get("http://localhost:8081/skill", {
        withCredentials: true,
      });
      setSkills(res.data.skills || []);
    } catch (err) {
      console.error("Failed to load skills", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSkill = (skill) => {
    navigate("/examiner/create-assessment-form", {
      state: { skillId: skill._id, skillName: skill.name },
    });
  };

  const handleCreateNewSkill = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8081/skill", newSkill, {
        withCredentials: true,
      });
      setSkills([...skills, res.data.skill]);
      setNewSkill({ name: "", description: "" });
      setShowAddForm(false);
    } catch (err) {
      alert("Failed to create new category.");
    }
  };

  const openForm = () => {
    setShowAddForm(true);
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  return (
    <div className="dashboard-page-container">
      {/* Page Banner Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #4f46e5, #9333ea)",
          color: "#fff",
          padding: "24px 28px",
          borderRadius: "16px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
          marginBottom: "24px",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "800",
            marginBottom: "6px",
            color: "#ffffff",
          }}
        >
          Select Assessment Skill
        </h1>
        <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.85)", margin: 0 }}>
          Choose the technology or subject area for your new assessment.
        </p>
      </div>

      {/* New Skill Form Modal / Overlay Box */}
      {showAddForm && (
        <div
          ref={formRef}
          style={{
            background: "#1e293b",
            border: "2px solid #38bdf8",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "28px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            animation: "fadeIn 0.3s ease-in-out",
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="text-white fw-bold m-0" style={{ fontSize: "18px" }}>
              <i className="fa-solid fa-folder-plus text-info me-2"></i>
              Create New Category
            </h3>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() => setShowAddForm(false)}
            ></button>
          </div>

          <form onSubmit={handleCreateNewSkill} className="d-flex flex-column gap-3">
            <div>
              <label className="text-light mb-1" style={{ fontSize: "13px" }}>
                Category Name
              </label>
              <input
                type="text"
                className="form-control"
                style={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  color: "#fff",
                  padding: "10px 14px",
                }}
                value={newSkill.name}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, name: e.target.value })
                }
                placeholder="e.g. Mathematics, Machine Learning"
                required
              />
            </div>

            <div>
              <label className="text-light mb-1" style={{ fontSize: "13px" }}>
                Description
              </label>
              <input
                type="text"
                className="form-control"
                style={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  color: "#fff",
                  padding: "10px 14px",
                }}
                value={newSkill.description}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, description: e.target.value })
                }
                placeholder="Briefly describe this category"
                required
              />
            </div>

            <div className="d-flex gap-2 mt-2">
              <button
                type="submit"
                className="btn btn-info fw-bold text-white px-4 py-2"
                style={{ borderRadius: "8px" }}
              >
                Save Category
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary text-light px-4 py-2"
                style={{ borderRadius: "8px" }}
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading or Skills Grid */}
      {loading ? (
        <div
          className="loading-container w-100 d-flex justify-content-center align-items-center"
          style={{ minHeight: "50vh" }}
        >
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Loading subjects...</span>
          </div>
        </div>
      ) : (
        <div className="kpi-cards-grid">
          {skills.map((skill) => (
            <div
              key={skill._id}
              className="dashboard-card text-center d-flex flex-column align-items-center justify-content-center p-4"
              style={{ cursor: "pointer", transition: "transform 0.2s ease" }}
              onClick={() => handleSelectSkill(skill)}
            >
              <div className="mb-3">
                <i className="fa-solid fa-laptop-code text-info fa-2x"></i>
              </div>
              <h4 className="text-white fw-bold mb-1" style={{ fontSize: "16px" }}>
                {skill.name}
              </h4>
              <p className="card-subtext text-center m-0">{skill.description}</p>
            </div>
          ))}

          {/* Create New Card */}
          <div
            className="dashboard-card text-center d-flex flex-column align-items-center justify-content-center p-4"
            onClick={openForm}
            style={{
              cursor: "pointer",
              border: "2px dashed #38bdf8",
              background: "rgba(56, 189, 248, 0.05)",
            }}
          >
            <div className="mb-3">
              <i className="fa-solid fa-plus text-info fa-2x"></i>
            </div>
            <h4 className="text-white fw-bold mb-1" style={{ fontSize: "16px" }}>
              Add New Skill
            </h4>
            <p className="card-subtext text-center m-0">
              Create a brand new subject category for the platform.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectSkill;