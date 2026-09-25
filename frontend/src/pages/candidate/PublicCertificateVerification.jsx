import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PublicCertificateVerification = () => {
  const { certificateId: paramId } = useParams();
  const [certId, setCertId] = useState(paramId || "");
  const [loading, setLoading] = useState(false);
  const [certData, setCertData] = useState(null);
  const [error, setError] = useState("");

  const fetchVerification = async (idToVerify) => {
    if (!idToVerify.trim()) return;
    setLoading(true);
    setError("");
    setCertData(null);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/candidate/verify-certificate/${idToVerify}`,
      );
      if (response.data.success) {
        setCertData(response.data.data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Certificate verification failed. ID does not exist.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paramId) {
      fetchVerification(paramId);
    }
  }, [paramId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchVerification(certId);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-8 border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800 text-center mb-2">
          Certificate Verification Portal
        </h1>
        <p className="text-sm text-slate-500 text-center mb-6">
          Enter a Certificate ID below to verify authenticity.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <input
            type="text"
            value={certId}
            onChange={(e) => setCertId(e.target.value)}
            placeholder="e.g. CERT-UUID-12345"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center">
            {error}
          </div>
        )}

        {certData && (
          <div className="border border-green-200 bg-green-50/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                ✓ Authentic Certificate
              </span>
              <span className="text-xs text-slate-500">
                ID: {certData.certificateId}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs text-slate-400 block uppercase">
                  Candidate Name
                </span>
                <span className="text-lg font-semibold text-slate-800">
                  {certData.candidateName}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block uppercase">
                  Assessment Title
                </span>
                <span className="text-base font-medium text-blue-700">
                  {certData.assessmentTitle}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <div>
                  <span className="text-xs text-slate-400 block uppercase">
                    Score Obtained
                  </span>
                  <span className="text-sm font-bold text-slate-700">
                    {certData.score}%
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block uppercase">
                    Issue Date
                  </span>
                  <span className="text-sm font-medium text-slate-700">
                    {new Date(certData.issueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicCertificateVerification;
