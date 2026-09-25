import { useEffect, useState } from "react";
import axios from "axios";
import "./css/Dashboard.css";
import "./css/RegisteredCandidate.css";
import "./css/PublishedAssessments.css"; // Modern styling

function PublishedAssessments() {
  const [assessments, setAssessments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const res = await axios.get("http://localhost:8081/admin/assessments", {
        withCredentials: true,
      });
      setAssessments(res.data.assessments || []);
    } catch (err) {
      console.error("Failed to fetch published assessments:", err);
    }
  };

  const filteredAssessments = assessments.filter((item) =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-page-container">
      {/* Header with Title and Search Input */}
      <div className="dashboard-header-title d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h1 className="m-0 text-white fw-bold">Published Assessments</h1>

        {/* Integrated Search Input Box */}
        <div className="position-relative" style={{ minWidth: "280px" }}>
          <i
            className="fa-solid fa-magnifying-glass position-absolute text-muted"
            style={{ left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "14px" }}
          ></i>
          <input
            type="text"
            className="form-control text-white bg-dark border-secondary ps-5"
            style={{
              borderRadius: "8px",
              borderColor: "rgba(255, 255, 255, 0.15)",
              fontSize: "14px",
              paddingTop: "9px",
              paddingBottom: "9px",
            }}
            placeholder="Search assessment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="dashboard-body">
        <div className="dashboard-card w-100">
          {/* Card Header with Glowing Badge */}
          <div className="card-header d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary border-opacity-10">
            <h3 className="m-0 d-flex align-items-center gap-2 text-white" style={{ fontSize: "18px", fontWeight: "700" }}>
              <i className="fa-solid fa-file-circle-check text-info"></i>
              Active Published Assessments
            </h3>
            <span className="badge bg-dark text-info border border-info border-opacity-25 px-3 py-2" style={{ fontSize: "12px" }}>
              {filteredAssessments.length} Available
            </span>
          </div>

          {/* Standard Table Layout with Hidden Scrollbar */}
          <div className="table-responsive flex-grow-1 custom-scrollbar table-scroll-wrap">
            <table className="custom-table align-middle m-0">
              <thead>
                <tr>
                  <th>TITLE</th>
                  <th>DURATION</th>
                  <th className="text-end">PASSING MARKS</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssessments.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-5 text-muted">
                      <i className="fa-solid fa-folder-open d-block mb-2 fs-3 opacity-50"></i>
                      No Published Assessments Found
                    </td>
                  </tr>
                ) : (
                  filteredAssessments.map((item, index) => (
                    <tr key={item._id || item.id || index}>
                      <td className="fw-semibold text-white">
                        <div className="d-flex align-items-center gap-3">
                          <div className="title-icon-box">
                            <i className="fa-solid fa-file-lines text-info fs-6"></i>
                          </div>
                          <span className="text-truncate fs-6">{item.title}</span>
                        </div>
                      </td>
                      <td className="text-muted">
                        <span className="badge bg-secondary bg-opacity-25 text-light fw-normal px-2.5 py-1.5" style={{ fontSize: "12px" }}>
                          <i className="fa-regular fa-clock me-1 text-info"></i>
                          {item.duration ? `${item.duration} Mins` : "N/A"}
                        </span>
                      </td>
                      <td className="text-end font-monospace text-info fw-bold fs-6">
                        {item.passingMarks ?? "N/A"}
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
  );
}

export default PublishedAssessments;