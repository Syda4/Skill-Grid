import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./css/Dashboard.css";

const CertificateView = () => {
  const navigate = useNavigate();

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Verify QRcode

  useEffect(() => {
    fetchCandidateDashboardData();
  }, []);

  const fetchCandidateDashboardData = async () => {
    try {
      const response = await axios.get("http://localhost:8081/certificate/my", {
        withCredentials: true,
      });

      const certList = Array.isArray(response.data)
        ? response.data
        : response.data.certificates || [];

      setCertificates(certList);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      }
      console.error("Error fetching certificates:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 text-light">
        <div className="spinner-border text-info" role="status"></div>
        <span className="ms-3 fw-semibold fs-5">Loading Certificates...</span>
      </div>
    );
  }

  return (
    <div className="profile-dashboard-wrapper p-4 text-white">
      {/* Header Banner */}
      <header className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
        <div>
          <h1 className="fw-bold fs-2 m-0 text-white d-flex align-items-center gap-2">
            <span>
              Earned <span className="theme-gradient-text">Certificates</span>
            </span>
            <i className="fas fa-award text-warning fs-3 ms-2"></i>
          </h1>
          <p className="subtext-gray m-0 mt-1 fs-6">
            View, download, and share your official skill verification
            certificates.
          </p>
        </div>

        {/* Certificate Counter Pill */}
        <div className="neon-status-pill">
          <i className="fas fa-certificate text-cyan"></i>
          <span>
            Total Earned: <b>{certificates.length}</b>
          </span>
        </div>
      </header>

      {/* Main Container */}
      <div className="cyber-card p-4">
        {certificates.length === 0 ? (
          <div className="text-center py-5">
            <div className="mb-3">
              <i
                className="fas fa-graduation-cap text-secondary"
                style={{ fontSize: "60px", opacity: "0.4" }}
              ></i>
            </div>
            <h4 className="fw-bold text-white mb-2">
              No Certificates Earned Yet
            </h4>
            <p
              className="subtext-gray max-w-md mx-auto mb-4"
              style={{ maxWidth: "450px" }}
            >
              Complete and pass an assessment to issue your verified digital
              credentials.
            </p>
            <Link to="/candidate/assessment" className="cyber-btn primary-glow">
              Explore Assessments <i className="fas fa-arrow-right ms-2"></i>
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {certificates.map((cert) => {
              const assessmentTitle =
                cert.assessmentTitle ||
                cert.assessment?.title ||
                cert.assessment?.name ||
                "Skill Assessment";

              const formattedDate = cert.issueDate
                ? new Date(cert.issueDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "N/A";

              const certCode =
                cert.certificateCode || cert.certificateNumber || cert._id;

              return (
                <div className="col-lg-6" key={cert._id}>
                  <div className="cert-item-card p-4 rounded-3 h-100 d-flex flex-column justify-content-between">
                    <div>
                      {/* Top Header Row Inside Card */}
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-center gap-3">
                          <div className="cert-icon-badge">
                            <i className="fas fa-shield-alt"></i>
                          </div>
                          <div>
                            <h4 className="fw-bold text-white text-capitalize m-0 fs-5">
                              {assessmentTitle}
                            </h4>
                            <span className="cert-status-badge mt-1">
                              Verified Credential
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Detail Rows */}
                      <div className="cert-meta-container my-3 p-3 rounded-2">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="meta-label">
                            <i className="far fa-calendar-alt me-2 text-cyan"></i>
                            Issued Date
                          </span>
                          <span className="meta-value">{formattedDate}</span>
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                          <span className="meta-label">
                            <i className="fas fa-fingerprint me-2 text-magenta"></i>
                            Certificate ID
                          </span>
                          <code className="meta-code text-truncate ms-2">
                            {certCode}
                          </code>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      <Link
                        to={`/candidate/verify-certificate/${certCode}`}
                        className="cyber-btn primary-glow w-100 text-center text-decoration-none"
                      >
                        <i className="fas fa-external-link-alt me-2"></i> View &
                        Verify
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateView;
