import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./css/Register.css";

const VerifyRegistration = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  if (!email) {
    return (
      <div className="register-page">
        <div className="main-container">
          <div className="form-box">
            <h2>Email Not Found</h2>

            <p className="subtitle">
              We couldn't find your email address.
              <br />
              Please register again or login.
            </p>

            <div className="action-buttons-group">
              <Link to="/register" className="action-btn signup-btn" style={{ textDecoration: 'none' }}>
                Register
              </Link>

              <Link to="/login" className="action-btn signup-btn" style={{ textDecoration: 'none' }}>
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      return alert("Please enter OTP.");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8081/auth/verify-registration",
        {
          email,
          otp,
        },
        {
          withCredentials: true,
        },
      );

      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      setResending(true);

      const res = await axios.post(
        "http://localhost:8081/auth/resend-verification",
        {
          email,
        },
        {
          withCredentials: true,
        },
      );

      alert(res.data.message || "OTP Sent Successfully");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="register-page">
      <div className="main-container">
        <div className="form-box">
          <h2>Email Verification</h2>

          <p className="subtitle">We've sent a 6-digit verification code to</p>

          <h3 className="email-heading">{email}</h3>

          <form onSubmit={handleVerify} className="auth-form">
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter 6 Digit OTP"
                value={otp}
                maxLength={6}
                onChange={(e) => setOtp(e.target.value)}
                className="otp-center-input"
                required
              />
            </div>

            <button
              type="submit"
              className="signup-btn"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <div className="resend-wrapper">
            Didn't receive the OTP?
            <button
              type="button"
              onClick={resendOTP}
              disabled={resending}
              className="resend-btn"
            >
              {resending ? "Sending..." : "Resend OTP"}
            </button>
          </div>

          <div className="back-to-login">
            <Link to="/login" className="back-link">
              &larr; Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyRegistration;