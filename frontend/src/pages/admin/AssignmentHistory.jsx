import { useEffect, useState } from "react";
import axios from "axios";
import "./css/Dashboard.css";

function AssignmentHistory() {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get("http://localhost:8081/admin/assignments", {
        withCredentials: true,
      });
      setAssignments(res.data.assignments || []);
    } catch (err) {
      console.error("Failed to fetch assignments:", err);
    }
  };

  return (
    <div className="dashboard-page-container">
      <div className="dashboard-header-title d-flex justify-content-between align-items-center mb-4">
        <h1 className="m-0">Assignment History</h1>
      </div>

      <div className="dashboard-body">
        <div className="dashboard-card w-100">
          <div className="card-header">
            <h3>
              <i className="fa-solid fa-clock-rotate-left card-title-icon"></i>
              Logged Assignments
            </h3>
            <span className="card-subtext">
              {assignments.length} Total Logged
            </span>
          </div>

          <div className="table-responsive">
            <table className="table table-dark table-borderless align-middle m-0">
              <thead>
                <tr className="border-bottom border-secondary border-opacity-25">
                  <th className="card-subtext fw-bold">CANDIDATE</th>
                  <th className="card-subtext fw-bold">ASSESSMENT</th>
                  <th className="card-subtext fw-bold">STATUS</th>
                  <th className="card-subtext fw-bold text-end">DUE DATE</th>
                </tr>
              </thead>
              <tbody>
                {assignments.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-muted">
                      No Assignments Found
                    </td>
                  </tr>
                ) : (
                  assignments.map((item) => (
                    <tr
                      key={item._id}
                      className="border-bottom border-secondary border-opacity-10"
                    >
                      <td className="fw-semibold text-white">
                        {item.candidate?.name || item.candidate?.fullname}
                      </td>
                      <td className="card-subtext">
                        {item.assessment?.title}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            item.status === "Completed"
                              ? "bg-success"
                              : "bg-warning text-dark"
                          }`}
                          style={{ fontSize: "10px", padding: "4px 8px" }}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="card-subtext text-end font-monospace">
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
  );
}

export default AssignmentHistory;