import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";
import QRCode from "react-qr-code";
import Signature from "../assets/Aryan_Signature.jpg";

function VerifyCertificate() {
  const { certificateCode } = useParams();

  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    verifyCertificate();
  }, []);

  const verifyCertificate = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8081/certificate/verify/${certificateCode}`,
      );

      setCertificate(res.data.certificate);
    } catch (err) {
      setError(err.response?.data?.message || "Certificate not found");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-5 text-center text-light">
        <div className="spinner-border text-warning mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="text-light-50 fw-normal">Verifying Certificate...</h5>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-5 d-flex justify-content-center px-3">
        <div
          className="card bg-dark text-light border-secondary shadow-lg text-center p-5 rounded-4"
          style={{ maxWidth: "500px", width: "100%" }}
        >
          <div className="mb-3">
            <span className="bg-danger bg-opacity-25 text-danger p-3 rounded-circle d-inline-block">
              <span className="fs-2">⚠️</span>
            </span>
          </div>
          <h3 className="text-danger fw-bold">Invalid Certificate</h3>
          <p className="text-white-50 mt-2">{error}</p>

          <div>
            <Link
              to="/"
              className="btn btn-warning px-4 rounded-pill mt-3 text-dark fw-semibold"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 px-2">
      <div className="container" style={{ maxWidth: "860px" }}>
        {/* Verification Status Bar */}
        <div className="bg-dark border border-secondary border-opacity-50 rounded-3 p-3 shadow-sm mb-4 d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50 rounded-pill px-3 py-2 fw-semibold">
              ✓ Officially Verified Record
            </span>
          </div>
          <div className="text-end">
            <span
              className="text-light-50 small d-block"
              style={{ fontSize: "0.75rem", color: "#a0a0a0" }}
            >
              Verification ID
            </span>
            <code className="text-warning fw-semibold small">
              {certificate.certificateCode}
            </code>
          </div>
        </div>

        {/* --- UJWAL OFFICIAL CERTIFICATE --- */}
        <div
          className="bg-white rounded-3 shadow-lg overflow-hidden position-relative"
          style={{
            border: "1px solid #f97316",
            boxShadow: "0 15px 35px rgba(0,0,0,0.4)",
          }}
        >
          {/* Decorative Inner Frame */}
          <div
            className="m-3 p-4 p-md-5 rounded-2 position-relative"
            style={{
              border: "2px solid #ea580c",
              outline: "1px solid rgba(234, 88, 12, 0.3)",
              outlineOffset: "4px",
            }}
          >
            {/* BRANDING HEADER WITH LOGO */}
            <div className="text-center mb-4">
              <div className="d-flex justify-content-center align-items-center mb-3">
                <img
                  src={logo}
                  alt="Ujwal Radiant Vision"
                  style={{ maxHeight: "65px", objectFit: "contain" }}
                />
              </div>

              <h1
                className="display-5 fw-bold mb-1"
                style={{
                  fontFamily: "'Times New Roman', Georgia, serif",
                  color: "#0f172a",
                }}
              >
                Certificate of Achievement
              </h1>
              <p className="text-muted fst-italic small">
                This is to certify that
              </p>
            </div>

            {/* Candidate Name & Email */}
            <div className="text-center my-4">
              <h2
                className="display-6 fw-bold mb-0 text-capitalize"
                style={{
                  fontFamily: "'Times New Roman', Georgia, serif",
                  color: "#ea580c",
                }}
              >
                {certificate.candidate.name}
              </h2>
              <span className="text-muted small d-block mt-1">
                {certificate.candidate.email}
              </span>
              <div
                className="mx-auto mt-2"
                style={{
                  width: "100px",
                  height: "3px",
                  backgroundColor: "#f97316",
                }}
              ></div>
            </div>

            {/* Assessment Title */}
            <div
              className="text-center mx-auto mb-4"
              style={{ maxWidth: "550px" }}
            >
              <p className="text-secondary small mb-2">
                has successfully completed and demonstrated proficiency in:
              </p>
              <h4
                className="fw-bold d-inline-block px-4 py-2 rounded-2 border"
                style={{
                  backgroundColor: "#fff7ed",
                  borderColor: "#fed7aa",
                  color: "#9a3412",
                }}
              >
                {certificate.assessment.title}
              </h4>
            </div>

            {/* Scores & Performance Grid */}
            <div
              className="rounded-3 p-3 my-4 border"
              style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }}
            >
              <div className="row text-center g-2 align-items-center">
                <div className="col-4">
                  <span
                    className="text-uppercase text-muted d-block fw-semibold"
                    style={{ fontSize: "0.65rem", letterSpacing: "1px" }}
                  >
                    Score
                  </span>
                  <span className="fw-bold fs-5" style={{ color: "#0f172a" }}>
                    {certificate.result.score} / {certificate.result.totalMarks}
                  </span>
                </div>
                <div className="col-4 border-start border-end">
                  <span
                    className="text-uppercase text-muted d-block fw-semibold"
                    style={{ fontSize: "0.65rem", letterSpacing: "1px" }}
                  >
                    Percentage
                  </span>
                  <span className="fw-bold fs-5" style={{ color: "#0f172a" }}>
                    {certificate.result.percentage}%
                  </span>
                </div>
                <div className="col-4">
                  <span
                    className="text-uppercase text-muted d-block fw-semibold"
                    style={{ fontSize: "0.65rem", letterSpacing: "1px" }}
                  >
                    Result
                  </span>
                  <span className="badge bg-success px-3 py-1 rounded-pill mt-1">
                    {certificate.result.status}
                  </span>
                </div>
              </div>
            </div>
            <div
              className="row align-items-center mt-5 pt-4 border-top"
              style={{ borderColor: "#e2e8f0" }}
            >
              {/* QR */}
              <div className="col-md-3 text-center">
                <QRCode
                  value={`http://localhost:5173/candidate/verify-certificate/${certificate.certificateCode}`}
                  size={95}
                />
                <div
                  className="mt-2"
                  style={{
                    fontSize: "11px",
                    color: "#64748b",
                    fontWeight: 600,
                  }}
                >
                  Scan to Verify
                </div>
              </div>

              {/* Date */}
              <div className="col-md-4 text-center">
                <div className="text-uppercase text-muted small">
                  Date Issued
                </div>

                <div className="fw-semibold mt-1s text-black">
                  {new Date(certificate.issueDate).toLocaleDateString()}
                </div>
              </div>

              {/* Signature */}
              <div className="col-md-5 text-end text-black">
                <img
                  src={Signature}
                  alt="Signature"
                  style={{ height: "45px", width: "230px" }}
                />

                <div
                  style={{
                    borderTop: "1px solid #0a0909",
                    marginTop: "6px",
                    paddingTop: "6px",
                  }}
                >
                  <strong>Authorized Signatory</strong>

                  <br />

                  <small>{certificate.certificateCode}</small>
                </div>
              </div>
            </div>

            {/* Footer / Issued Details */}
            <div
              className="row align-items-end mt-4 pt-3 border-top"
              style={{ borderColor: "#e2e8f0" }}
            >
              <div className="col-6 text-start">
                <span
                  className="text-uppercase text-muted d-block"
                  style={{ fontSize: "0.65rem", letterSpacing: "1px" }}
                >
                  Date Issued
                </span>
                <span
                  className="fw-semibold small"
                  style={{ color: "#334155" }}
                >
                  {new Date(certificate.issueDate).toLocaleDateString(
                    undefined,
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </span>
              </div>
              <div className="col-6 text-end">
                <span
                  className="text-uppercase text-muted d-block"
                  style={{ fontSize: "0.65rem", letterSpacing: "1px" }}
                >
                  Ujwal Verification ID
                </span>
                <code className="small" style={{ color: "#ea580c" }}>
                  {certificate.certificateCode}
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="text-center mt-4 d-print-none">
          <button
            className="btn btn-warning rounded-pill px-4 me-2 shadow-sm fw-medium text-dark"
            onClick={() => window.print()}
          >
            🖨️ Print Certificate
          </button>

          <Link
            to="/candidate/dashboard"
            className="btn btn-outline-light rounded-pill px-4 fw-medium"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}

export default VerifyCertificate;
