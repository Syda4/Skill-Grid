import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import "./css/Dashboard.css";

const Analytics = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportingPDF, setExportingPDF] = useState(false);

  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [skillCategory, setSkillCategory] = useState("");
  const [assessmentFilter, setAssessmentFilter] = useState("");

  const [skills, setSkills] = useState([]);
  const [assessmentsList, setAssessmentsList] = useState([]);

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange, skillCategory, assessmentFilter]);

  const buildQueryParams = () => {
    const queryParams = new URLSearchParams();
    if (dateRange.start) queryParams.append("startDate", dateRange.start);
    if (dateRange.end) queryParams.append("endDate", dateRange.end);
    if (skillCategory) queryParams.append("skillId", skillCategory);
    if (assessmentFilter) queryParams.append("assessmentId", assessmentFilter);
    return queryParams;
  };

  const fetchFilters = async () => {
    try {
      const [skillsRes, assessRes] = await Promise.all([
        axios.get("http://localhost:8081/skill", { withCredentials: true }),
        axios.get("http://localhost:8081/examiner/assessment", { withCredentials: true })
      ]);

      setSkills(Array.isArray(skillsRes.data) ? skillsRes.data : skillsRes.data.skills || []);
      setAssessmentsList(Array.isArray(assessRes.data) ? assessRes.data : assessRes.data.assessments || []);
    } catch (err) {
      console.log("Could not load filters", err);
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const queryParams = buildQueryParams();

      const res = await axios.get(`http://localhost:8081/analytics/dashboard?${queryParams.toString()}`, {
        withCredentials: true,
      });

      setStats(res.data.stats);

      const rawData = res.data.performanceData || [];
      const formattedData = rawData.map((item) => ({
        ...item,
        candidateName: item.candidateName || item.candidate?.name || "Candidate",
        assessmentTitle: item.assessmentTitle || item.assessment?.title || "Assessment",
        category: item.category || item.assessment?.skillId?.name || item.assessment?.skill?.name || "General",
        score: Number(item.score) || 0,
        result: item.result || item.status || "N/A",
        date: item.date || item.submittedAt || item.createdAt
      }));

      setPerformanceData(formattedData);
    } catch (err) {
      console.error("Failed to load analytics", err);
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const escapeCSVField = (value) => {
    const str = String(value ?? "");
    if (/[",\n]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? "N/A" : parsed.toLocaleDateString();
  };

  const exportToCSV = () => {
    if (performanceData.length === 0) return alert("No data to export");
    const headers = ["Candidate Name", "Assessment Title", "Category", "Score", "Result", "Date"];
    const rows = performanceData.map(row => [
      row.candidateName,
      row.assessmentTitle,
      row.category,
      row.score,
      row.result,
      formatDate(row.date)
    ].map(escapeCSVField));

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Assessment_Analytics_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = async () => {
    if (performanceData.length === 0) return alert("No data to export");
    setExportingPDF(true);
    try {
      const queryParams = buildQueryParams();
      const res = await axios.get(
        `http://localhost:8081/analytics/export/pdf?${queryParams.toString()}`,
        { 
          withCredentials: true, 
          responseType: "blob" 
        }
      );

      // Check if response is a JSON error wrapped inside a Blob
      if (res.data.type === "application/json") {
        const text = await res.data.text();
        const errorJson = JSON.parse(text);
        console.error("Backend Error Details:", errorJson);
        alert(`Error: ${errorJson.message || "Failed to generate PDF"}`);
        return;
      }

      // Download PDF
      const blobUrl = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", "Assessment_Analytics_Report.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

    } catch (err) {
      console.error("Failed to export PDF:", err);
      if (err.response && err.response.data instanceof Blob) {
        const errText = await err.response.data.text();
        console.error("Decoded Error:", errText);
      }
      alert("Failed to generate PDF report. See browser console for details.");
    } finally {
      setExportingPDF(false);
    }
  };

  const clearFilters = () => {
    setDateRange({ start: "", end: "" });
    setSkillCategory("");
    setAssessmentFilter("");
  };

  return (
    <div className="dashboard-page-container">
      {/* Header Banner */}
      <div style={{ background: "linear-gradient(135deg, #4f46e5, #9333ea)", color: "#fff", padding: "24px 28px", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.3)", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "6px", color: "#ffffff" }}>Reports & Analytics 📊</h1>
          <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.85)", margin: 0 }}>Evaluate assessment effectiveness, identify skill gaps, and track certification trends.</p>
        </div>
        <div className="d-flex gap-2">
          <button onClick={exportToCSV} className="btn btn-light rounded-pill px-4 fw-bold shadow-sm"><i className="fa-solid fa-file-csv me-2"></i> Export CSV</button>
          <button onClick={exportToPDF} disabled={exportingPDF} className="btn btn-light rounded-pill px-4 fw-bold shadow-sm">
            <i className="fa-solid fa-file-pdf me-2"></i> {exportingPDF ? "Generating..." : "Export PDF"}
          </button>
        </div>
      </div>

      <div className="dashboard-body">

        {/* Filters Row */}
        <div className="d-flex flex-wrap gap-3 mb-4 p-3 rounded align-items-center" style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <div className="d-flex align-items-center gap-2">
             <span className="text-white small fw-bold">From:</span>
             <input type="date" max={dateRange.end || undefined} className="form-control form-control-sm bg-dark text-white border-secondary" value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} />
          </div>
          <div className="d-flex align-items-center gap-2">
             <span className="text-white small fw-bold">To:</span>
             <input type="date" min={dateRange.start || undefined} className="form-control form-control-sm bg-dark text-white border-secondary" value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} />
          </div>
          <select className="form-select form-select-sm bg-dark text-white border-secondary" style={{ width: 'auto' }} value={skillCategory} onChange={(e) => setSkillCategory(e.target.value)}>
            <option value="">All Skill Categories</option>
            {skills.map(skill => <option key={skill._id} value={skill._id}>{skill.name}</option>)}
          </select>
          <select className="form-select form-select-sm bg-dark text-white border-secondary" style={{ width: 'auto' }} value={assessmentFilter} onChange={(e) => setAssessmentFilter(e.target.value)}>
            <option value="">All Assessments</option>
            {assessmentsList.map(a => <option key={a._id} value={a._id}>{a.title}</option>)}
          </select>
          <button onClick={clearFilters} className="btn btn-sm btn-outline-danger ms-auto">Clear Filters</button>
        </div>

        {loading ? (
          <div className="text-center text-info py-5"><div className="spinner-border" role="status"></div></div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="kpi-cards-grid">
              <div className="kpi-card card-yellow"><div className="kpi-info"><span className="kpi-value">{stats?.totalAssessments || 0}</span><span className="kpi-label">TOTAL ASSESSMENTS</span></div><div className="kpi-icon-wrap"><i className="fa-solid fa-folder-open"></i></div></div>
              <div className="kpi-card card-pink"><div className="kpi-info"><span className="kpi-value">{stats?.totalCandidates || 0}</span><span className="kpi-label">TOTAL CANDIDATES</span></div><div className="kpi-icon-wrap"><i className="fa-solid fa-users"></i></div></div>
              <div className="kpi-card card-purple"><div className="kpi-info"><span className="kpi-value">{stats?.passRate || 0}%</span><span className="kpi-label">AVERAGE PASS RATE</span></div><div className="kpi-icon-wrap"><i className="fa-solid fa-chart-pie"></i></div></div>
              <div className="kpi-card card-cyan"><div className="kpi-info"><span className="kpi-value">{stats?.certificatesIssued || 0}</span><span className="kpi-label">CERTIFICATES ISSUED</span></div><div className="kpi-icon-wrap"><i className="fa-solid fa-award"></i></div></div>
            </div>

            {/* Chart and Table Layout */}
            <div className="row mt-4">
              {/* Chart Section */}
              <div className="col-12 col-xl-5 mb-4">
                <div className="dashboard-card h-100">
                  <div className="card-header border-bottom border-secondary border-opacity-10 pb-3 mb-3">
                    <h3 className="m-0 d-flex align-items-center gap-2 text-white" style={{ fontSize: "16px", fontWeight: "700" }}>
                      <i className="fa-solid fa-chart-column text-info"></i> Recent Scores Trend
                    </h3>
                  </div>
                  <div className="card-body" style={{ height: "300px", width: "100%", minHeight: "300px" }}>
                    {performanceData.length === 0 ? (
                       <p className="text-center text-muted mt-5">No data for chart</p>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={performanceData.slice(0, 10)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <XAxis dataKey="candidateName" stroke="#94a3b8" fontSize={12} tickFormatter={(str) => (str || "").split(" ")[0]} />
                          <YAxis stroke="#94a3b8" />
                          <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                          <Bar dataKey="score" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Score" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>

              {/* Table Section */}
              <div className="col-12 col-xl-7 mb-4">
                <div className="dashboard-card h-100">
                  <div className="card-header border-bottom border-secondary border-opacity-10 pb-3 mb-3">
                    <h3 className="m-0 d-flex align-items-center gap-2 text-white" style={{ fontSize: "16px", fontWeight: "700" }}>
                      <i className="fa-solid fa-list-check text-info"></i> Performance Summary
                    </h3>
                  </div>
                  <div className="card-body p-0">
                    {performanceData.length === 0 ? (
                      <div className="text-center py-5 text-muted"><p className="m-0">No performance data found for these filters.</p></div>
                    ) : (
                      <div className="table-responsive" style={{ maxHeight: "300px", overflowY: "auto" }}>
                        <table className="table table-dark table-hover align-middle mb-0" style={{ background: "transparent" }}>
                          <thead style={{ position: "sticky", top: 0, background: "#111827", zIndex: 1 }}>
                            <tr>
                              <th className="text-uppercase text-muted small pb-2">Candidate</th>
                              <th className="text-uppercase text-muted small pb-2">Assessment</th>
                              <th className="text-uppercase text-muted small pb-2 text-center">Score</th>
                              <th className="text-uppercase text-muted small pb-2 text-end">Result</th>
                            </tr>
                          </thead>
                          <tbody>
                            {performanceData.map((row, index) => (
                              <tr key={index} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                <td className="py-2 text-white fw-bold">{row.candidateName} <br/><small className="text-muted fw-normal">{formatDate(row.date)}</small></td>
                                <td className="py-2 text-light">{row.assessmentTitle} <br/><small className="text-info fw-normal">{row.category}</small></td>
                                <td className="py-2 text-center fw-bold">{row.score}</td>
                                <td className="py-2 text-end">
                                  <span className={`badge ${row.result === 'Pass' ? 'bg-success text-success' : 'bg-danger text-danger'} bg-opacity-25 border border-${row.result === 'Pass' ? 'success' : 'danger'} border-opacity-25 px-2 py-1`}>{row.result}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;