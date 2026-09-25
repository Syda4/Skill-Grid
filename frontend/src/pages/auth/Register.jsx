import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("candidate");

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    roles: "candidate",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullname ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      return alert("All fields are required.");
    }

    if (formData.password.length < 6) {
      return alert("Password must contain at least 6 characters.");
    }

    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match.");
    }

    try {
      setLoading(true);

      const response = await axios.post(
        import.meta.env.VITE_SERVER_SIGNUP_URL,
        formData,
        { withCredentials: true }
      );

      alert(response.data.message);

      setFormData({
        fullname: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        roles: "candidate",
      });

      setRole("candidate");

      navigate("/verify-registration", {
        state: { email: formData.email },
      });
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="main-container">
        <div className="form-box">
          <div className="brand-header">
            <h2>Welcome to Ujwal Radiant Vision</h2>
            <p className="subtitle">
              Create an account to get started with your journey.
            </p>
          </div>

          <div className="form-title">Sign Up</div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label className="input-label" htmlFor="fullname">Full Name</label>
              <input
                id="fullname"
                type="text"
                name="fullname"
                placeholder="Full Name"
                value={formData.fullname}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group password-group">
              <label className="input-label" htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="input-group password-group">
              <label className="input-label" htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="terms-wrapper">
              <p className="terms-text">
                By signing up you agree to our Terms &amp; Conditions.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="signup-btn"
              >
                {loading ? "Creating Account..." : "SIGN UP"}
              </button>

              <div className="register-link">
                Already have an account?{" "}
                <Link to="/login">
                  Login
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;