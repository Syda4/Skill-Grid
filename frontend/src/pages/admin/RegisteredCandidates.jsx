import { useEffect, useState } from "react";
import axios from "axios";
import "./css/RegisteredCandidate.css";

function RegisteredCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const res = await axios.get("http://localhost:8081/admin/candidates", {
        withCredentials: true,
      });
      setCandidates(res.data.candidates || []);
    } catch (err) {
      console.error("Failed to fetch registered candidates:", err);
    }
  };

  const filteredCandidates = candidates.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-page-container">
      {/* Header with Title and Search Input */}
      <div className="dashboard-header-title d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h1 className="m-0 text-white fw-bold">Registered Candidates</h1>

        {/* Integrated Search Input Box */}
        <div className="position-relative" style={{ minWidth: "280px" }}>
          <i
            className="fa-solid fa-magnifying-glass position-absolute text-muted"
            style={{ left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "14px" }}
          ></i>
          <input
            type="text"
            className="form-control text-white bg-dark border-secondary ps-5"
            style={{
              borderRadius: "8px",
              borderColor: "rgba(255, 255, 255, 0.15)",
              fontSize: "14px",
            }}
            placeholder="Search name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="dashboard-body">
        <div className="dashboard-card w-100">
          {/* Card Header with Counter Badge */}
          <div className="card-header d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary border-opacity-10">
            <h3 className="m-0 d-flex align-items-center gap-2" style={{ fontSize: "18px", fontWeight: "700" }}>
              <i className="fa-solid fa-users text-info"></i>
              Candidate List
            </h3>
            <span className="badge bg-dark text-info border border-info border-opacity-25 px-3 py-2" style={{ fontSize: "12px" }}>
              {filteredCandidates.length} Registered
            </span>
          </div>

          {/* Table Container */}
          <div className="table-responsive flex-grow-1 custom-scrollbar table-scroll-wrap">
            <table className="custom-table align-middle m-0">
              
              <tbody>
                {filteredCandidates.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-muted">
                      No Candidates Found
                    </td>
                  </tr>
                ) : (
                  filteredCandidates.map((candidate) => (
                    <tr key={candidate._id}>
                      <td className="fw-semibold text-white">
                        <div className="d-flex align-items-center gap-3">
                          {/* User Initial Avatar */}
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                            style={{
                              width: "36px",
                              height: "36px",
                              background: "linear-gradient(135deg, #6366f1, #a855f7)",
                              fontSize: "13px",
                              flexShrink: 0,
                            }}
                          >
                            {candidate.name ? candidate.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <span className="text-truncate fs-6">{candidate.name}</span>
                        </div>
                      </td>
                      <td className="text-white">{candidate.email}</td>
                      
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

export default RegisteredCandidates;