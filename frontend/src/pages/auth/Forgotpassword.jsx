import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/ForgotPassword.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(import.meta.env.VITE_SERVER_VERIFY_EMAIL_URL, { email });
      console.log("Requesting password reset for:", email);
      alert("Email Verified");
      navigate("/verify-otp", {
        state: { email },
      });
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="main-container">
        <div className="form-box">
          <h2>Forgot Password?</h2>

          <p className="subtitle">
            Enter the email address associated with your account and we'll send you
            a link to reset your password.
          </p>

          {isSubmitted ? (
            <div className="success-message">
              <strong>Check your inbox!</strong>
              <br />
              If an account exists for {email}, a reset link has been sent.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="input-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="action-btn">
                Send Reset Link
              </button>
            </form>
          )}

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

export default ForgotPassword;