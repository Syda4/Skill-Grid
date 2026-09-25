import { useEffect, useState } from "react";
import axios from "axios";
import "./css/Dashboard.css";

function Dashboard() {
  const [candidates, setCandidates] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [candidateId, setCandidateId] = useState("");
  const [assessmentId, setAssessmentId] = useState("");
  const [dueDate, setDueDate] = useState("");

  const todayDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [candidateRes, assessmentRes, assignmentRes] = await Promise.all([
        axios.get("http://localhost:8081/admin/candidates", { withCredentials: true }),
        axios.get("http://localhost:8081/admin/assessments", { withCredentials: true }),
        axios.get("http://localhost:8081/admin/assignments", { withCredentials: true }),
      ]);

      setCandidates(candidateRes.data.candidates || []);
      setAssessments(assessmentRes.data.assessments || []);
      setAssignments(assignmentRes.data.assignments || []);
    } catch (err) {
      console.error("Dashboard load error:", err);
    }
  };

  const assignAssessment = async () => {
    // Strictly validate candidate, assessment, AND due date
    if (!candidateId || !assessmentId || !dueDate) {
      return alert("Please select Candidate, Assessment, and Due Date.");
    }

    try {
      await axios.post(
        "http://localhost:8081/admin/assign",
        { candidateId, assessmentId, dueDate },
        { withCredentials: true }
      );

      alert("Assessment Assigned Successfully");
      setCandidateId("");
      setAssessmentId("");
      setDueDate("");
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Assignment Failed");
    }
  };

  return (
    <div className="dashboard-page-container">
      {/* Dashboard Title Header */}
      <div className="dashboard-header-title d-flex justify-content-between align-items-center mb-4">
        <h1 className="m-0 text-white fw-bold">Admin Dashboard</h1>
      </div>

      <div className="dashboard-body d-flex flex-column gap-4">
        {/* Row 1: KPI Summary Cards */}
        <div className="kpi-cards-grid">
          <div className="kpi-card card-cyan">
            <div className="kpi-info">
              <span className="kpi-value">{candidates.length}</span>
              <span className="kpi-label">TOTAL CANDIDATES</span>
            </div>
            <div className="kpi-icon-wrap">
              <i className="fa-solid fa-user-graduate"></i>
            </div>
          </div>

          <div className="kpi-card card-purple">
            <div className="kpi-info">
              <span className="kpi-value">{assessments.length}</span>
              <span className="kpi-label">PUBLISHED ASSESSMENTS</span>
            </div>
            <div className="kpi-icon-wrap">
              <i className="fa-solid fa-file-signature"></i>
            </div>
          </div>

          <div className="kpi-card card-yellow">
            <div className="kpi-info">
              <span className="kpi-value">{assignments.length}</span>
              <span className="kpi-label">TOTAL ASSIGNMENTS</span>
            </div>
            <div className="kpi-icon-wrap">
              <i className="fa-solid fa-tasks"></i>
            </div>
          </div>

          <div className="kpi-card card-pink">
            <div className="kpi-info">
              <span className="kpi-value">
                {assignments.filter((a) => a.status === "Completed").length}
              </span>
              <span className="kpi-label">COMPLETED</span>
            </div>
            <div className="kpi-icon-wrap">
              <i className="fa-solid fa-trophy"></i>
            </div>
          </div>
        </div>

        {/* Row 2: Assign Assessment Form + Registered Candidates */}
        <div className="row g-4 align-items-stretch">
          {/* Left Column: Assign Assessment Form */}
          <div className="col-12 col-lg-5">
            <div className="dashboard-card h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="card-header mb-3 pb-2 border-bottom border-secondary border-opacity-10">
                  <h3 className="m-0 d-flex align-items-center gap-2" style={{ fontSize: "16px", fontWeight: "700" }}>
                    <i className="fa-solid fa-paper-plane text-info"></i>
                    Assign Assessment
                  </h3>
                </div>

                <div className="d-flex flex-column gap-3">
                  <div className="form-group">
                    <label className="detail-label mb-2 d-block">Select Candidate <span className="text-danger">*</span></label>
                    <select
                      className="form-control"
                      value={candidateId}
                      onChange={(e) => setCandidateId(e.target.value)}
                    >
                      <option value="">Select Candidate...</option>
                      {candidates.map((candidate) => (
                        <option key={candidate._id} value={candidate._id}>
                          {candidate.name} ({candidate.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="detail-label mb-2 d-block">Select Assessment <span className="text-danger">*</span></label>
                    <select
                      className="form-control"
                      value={assessmentId}
                      onChange={(e) => setAssessmentId(e.target.value)}
                    >
                      <option value="">Select Assessment...</option>
                      {assessments.map((assessment) => (
                        <option key={assessment._id} value={assessment._id}>
                          {assessment.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="detail-label mb-2 d-block">Due Date <span className="text-danger">*</span></label>
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
                </div>
              </div>

              <button
                className="btn-start border-0 w-100 mt-4"
                onClick={assignAssessment}
                style={{ padding: "12px", cursor: "pointer" }}
              >
                <i className="fa-solid fa-check me-2"></i> Assign Assessment
              </button>
            </div>
          </div>

          {/* Right Column: Registered Candidates Table */}
          <div className="col-12 col-lg-7">
            <div className="dashboard-card h-100 d-flex flex-column">
              <div className="card-header d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary border-opacity-10">
                <h3 className="m-0 d-flex align-items-center gap-2" style={{ fontSize: "16px", fontWeight: "700" }}>
                  <i className="fa-solid fa-users text-info"></i>
                  Registered Candidates
                </h3>
                <span className="badge bg-dark text-info border border-info border-opacity-25 px-2 py-1" style={{ fontSize: "11px" }}>
                  {candidates.length} Total
                </span>
              </div>

              <div className="table-responsive flex-grow-1 custom-scrollbar table-scroll-wrap" style={{ maxHeight: "320px", overflowY: "auto" }}>
                <table className="custom-table align-middle m-0">
                  <tbody>
                    {candidates.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center py-4 text-muted">
                          No Candidates Found
                        </td>
                      </tr>
                    ) : (
                      candidates.map((candidate) => (
                        <tr key={candidate._id}>
                          <td className="fw-semibold text-white">
                            <div className="d-flex align-items-center gap-2">
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  background: "linear-gradient(135deg, #6366f1, #a855f7)",
                                  fontSize: "12px",
                                  flexShrink: 0
                                }}
                              >
                                {candidate.name ? candidate.name.charAt(0).toUpperCase() : "U"}
                              </div>
                              <span className="text-truncate">{candidate.name}</span>
                            </div>
                          </td>
                          <td className="text-white">{candidate.email}</td>
                          <td className="text-end">
                            <button
                              className="btn-select-pill"
                              onClick={() => setCandidateId(candidate._id)}
                            >
                              Select <i className="fa-solid fa-arrow-right ms-1" style={{ fontSize: "10px" }}></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Published Assessments + Assignment History */}
        <div className="row g-4 align-items-stretch">
          {/* Left Column: Published Assessments */}
          <div className="col-12 col-lg-5">
            <div className="dashboard-card h-100 d-flex flex-column">
              <div className="card-header d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary border-opacity-10">
                <h3 className="m-0 d-flex align-items-center gap-2" style={{ fontSize: "16px", fontWeight: "700" }}>
                  <i className="fa-solid fa-file-circle-check text-info"></i>
                  Published Assessments
                </h3>
                <span className="badge bg-dark text-info border border-info border-opacity-25 px-2 py-1" style={{ fontSize: "11px" }}>
                  {assessments.length} Active
                </span>
              </div>

              <div className="items-list flex-grow-1 custom-scrollbar table-scroll-wrap" style={{ maxHeight: "290px", overflowY: "auto" }}>
                {assessments.length === 0 ? (
                  <div className="empty-state py-4 text-center text-muted">
                    <p className="m-0">No Published Assessments Available</p>
                  </div>
                ) : (
                  assessments.map((assessment) => (
                    <div key={assessment._id} className="list-item-card mb-2">
                      <div className="list-item-info">
                        <i className="fa-solid fa-file-lines item-icon"></i>
                        <div>
                          <strong className="item-title d-block text-white">{assessment.title}</strong>
                          <span className="item-subtext">
                            Duration: {assessment.duration} mins | Passing: {assessment.passingMarks}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Assignment History Table */}
          <div className="col-12 col-lg-7">
            <div className="dashboard-card h-100 d-flex flex-column">
              <div className="card-header d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary border-opacity-10">
                <h3 className="m-0 d-flex align-items-center gap-2" style={{ fontSize: "16px", fontWeight: "700" }}>
                  <i className="fa-solid fa-clock-rotate-left text-info"></i>
                  Assignment History
                </h3>
                <span className="badge bg-dark text-info border border-info border-opacity-25 px-2 py-1" style={{ fontSize: "11px" }}>
                  {assignments.length} Logged
                </span>
              </div>

              <div className="table-responsive flex-grow-1 custom-scrollbar table-scroll-wrap" style={{ maxHeight: "290px", overflowY: "auto" }}>
                <table className="custom-table align-middle m-0">
                  <tbody>
                    {assignments.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-4 text-muted">
                          No Assignments Found
                        </td>
                      </tr>
                    ) : (
                      assignments.map((item) => (
                        <tr key={item._id}>
                          <td className="fw-semibold text-white">
                            {item.candidate?.name || item.candidate?.fullname || "Unknown"}
                          </td>
                          <td className="text-white">{item.assessment?.title || "N/A"}</td>
                          <td>
                            <span
                              className={`badge ${
                                item.status === "Completed"
                                  ? "bg-success"
                                  : "bg-warning text-dark"
                              }`}
                              style={{ fontSize: "10px", padding: "5px 10px", borderRadius: "12px" }}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="text-white text-end font-monospace">
                            {item.dueDate
                              ? new Date(item.dueDate).toLocaleDateString()
                              : "-"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;