import { useEffect, useState } from "react";
import api from "../../service/api";
import "./css/Dashboard.css";

function AssignAssignment() {
  const [candidates, setCandidates] = useState([]);
  const [assessments, setAssessments] = useState([]);

  const [candidate, setCandidate] = useState("");
  const [assessment, setAssessment] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Compute today's date in YYYY-MM-DD format to disable previous dates
  const todayDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const c = await api.get("/admin/candidates");
      const a = await api.get("/admin/assessments");

      setCandidates(c.data.candidates || []);
      setAssessments(a.data.assessments || []);
    } catch (err) {
      console.error(err);
    }
  };

  const assign = async () => {
    // Enforce all required fields including dueDate
    if (!candidate || !assessment || !dueDate) {
      return alert("Please select a candidate, an assessment, and a due date.");
    }

    try {
      await api.post("/admin/assign", {
        candidateId: candidate,
        assessmentId: assessment,
        dueDate,
      });

      alert("Assigned Successfully");

      // Reset form selection
      setCandidate("");
      setAssessment("");
      setDueDate("");
    } catch (err) {
      alert(err.response?.data?.message || "Assignment Failed");
    }
  };

  return (
    <div className="dashboard-page-container">
      <div className="dashboard-header-title d-flex justify-content-between align-items-center mb-4">
        <h1 className="m-0 text-white fw-bold">Assign Assessment</h1>
      </div>

      <div className="dashboard-body">
        <div className="content-grid-row">
          <div className="dashboard-card" style={{ maxWidth: "600px" }}>
            <div className="card-header mb-3 pb-2 border-bottom border-secondary border-opacity-10">
              <h3 className="m-0 d-flex align-items-center gap-2" style={{ fontSize: "18px", fontWeight: "700" }}>
                <i className="fa-solid fa-paper-plane card-title-icon text-info"></i>
                Assignment Details
              </h3>
            </div>

            <div className="d-flex flex-column gap-3">
              <div className="form-group">
                <label className="detail-label mb-2 d-block">
                  Select Candidate <span className="text-danger">*</span>
                </label>
                <select
                  className="form-control"
                  value={candidate}
                  onChange={(e) => setCandidate(e.target.value)}
                >
                  <option value="">Select Candidate...</option>
                  {candidates.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} {c.email ? `(${c.email})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="detail-label mb-2 d-block">
                  Select Assessment <span className="text-danger">*</span>
                </label>
                <select
                  className="form-control"
                  value={assessment}
                  onChange={(e) => setAssessment(e.target.value)}
                >
                  <option value="">Select Assessment...</option>
                  {assessments.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="detail-label mb-2 d-block">
                  Due Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={dueDate}
                  min={todayDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  style={{ colorScheme: "light" }}
                  required
                />
              </div>

              <button
                onClick={assign}
                className="btn-start border-0 w-100 mt-2"
                style={{ padding: "12px", cursor: "pointer" }}
              >
                <i className="fa-solid fa-check me-2"></i> Assign Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignAssignment;