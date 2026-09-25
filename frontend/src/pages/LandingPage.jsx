import React from "react";
import { Link } from "react-router-dom";
import {
  FaBrain,
  FaCertificate,
  FaChartLine,
  FaShieldAlt,
  FaLaptopCode,
  FaArrowRight,
  FaCheckCircle,
  FaUsers,
  FaAward,
} from "react-icons/fa";

import "./LandingPage.css";
import Typewriter from "typewriter-effect";
import AboutSection from "../components/card/AboutSection";


import { useNavigate } from "react-router-dom";
const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FaBrain />,
      title: "Skill Assessment",
      text: "Industry-standard assessments designed to evaluate practical knowledge and technical skills.",
    },
    {
      icon: <FaCertificate />,
      title: "Digital Certification",
      text: "Generate secure, verifiable certificates immediately after successful completion.",
    },
    {
      icon: <FaChartLine />,
      title: "Performance Analytics",
      text: "Track scores, strengths, weaknesses and monitor your learning journey.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure Assessments",
      text: "Reliable evaluation process with secure online examination experience.",
    },
  ];

  const categories = ["Java", "React", "Node.js", "Python", "C++", "SQL"];

  return (
    <div>
      <section>
        <AboutSection />
      </section>
      {/* CTA */}
      <section
        className="cta-section"
         style={{ background: "#190d5e" }}
      >
        <h2>Ready To Showcase Your Skills?</h2>
        <p>Join thousands of learners building their professional careers.</p>

        <Link className="hero-btn" to="/register">
          Start Assessment
        </Link>
      </section>


      {/* HERO */}
      <section className="hero-section container-fluid px-lg-5 px-5 py-5">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <span className="hero-badge">
              🚀 Assessment Platform
            </span>

            <h1 className="hero-title">
              Assess Your Skills
              <br />
              Earn <span>Verified Certificates</span>
            </h1>

            <p className="hero-description">
              Test your technical knowledge through professional online
              assessments and receive trusted digital certificates that showcase
              your expertise.
            </p>

            <div className="hero-buttons">
              <Link className="hero-btn" to="/register">
                Get Started
              </Link>

              <Link className="hero-btn-outline" to="/login">
                Explore Platform
              </Link>
            </div>

            <div className="hero-users">
              <div>
                <h4>12K+</h4>
                <span>Students</span>
              </div>

              <div>
                <h4>500+</h4>
                <span>Assessments</span>
              </div>

              <div>
                <h4>98%</h4>
                <span>Success</span>
              </div>
            </div>
          </div>

          <div className="col-lg-6 mt-5 mt-lg-0">
            <div className="dashboard-card">
              <div className="dashboard-header">
                <h4>Assessment Dashboard</h4>
                <span className="status">LIVE</span>
              </div>

              <div className="dashboard-score">
                <h2>94%</h2>
                <p>Overall Performance</p>
              </div>

              <div className="skill-row">
                <span>Java</span>
                <span>
                  <FaCheckCircle />
                </span>
              </div>

              <div className="skill-row">
                <span>React</span>
                <span>
                  <FaCheckCircle />
                </span>
              </div>

              <div className="skill-row">
                <span>SQL</span>
                <span>
                  <FaCheckCircle />
                </span>
              </div>

              <div className="certificate-status">
                <FaCertificate />
                <span>Certificate Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section container-fluid px-lg-5 px-4 py-5">
        <div className="text-center mb-5">
          <h2>Everything You Need</h2>
          <p>Powerful tools for learners, professionals and recruiters.</p>
        </div>

        <div className="row">
          {features.map((feature, index) => (
            <div className="col-lg-3 col-md-6 mb-4" key={index}>
              <div className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h4>{feature.title}</h4>
                <p>{feature.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section container-fluid px-lg-5 px-4">
        <div className="text-center mb-5">
      
          <h2 style={{ color: "#fff", textAlign: "center" }}>
            <Typewriter
              options={{
                strings: ["How It Works"],
                autoStart: true,
                loop: true,
                delay: 80,
                cursor: "....",
              }}
            />
          </h2>
          <p className="text-secondary">Simple steps to get certified</p>
        </div>

        <div className="row mt-5 position-relative">
          <Step number="1" title="Register" />
          <Step number="2" title="Choose Assessment" />
          <Step number="3" title="Take Test" />
          <Step number="4" title="Download Certificate" />
        </div>
      </section>

      {/* ASSESSMENTS */}

      <section
        className="category-section container-fluid px-lg-5 px-4 py-5"
        style={{ background: "#190d5e" }}
      >
        <div className="text-center mb-5 text-white">
          <h2 className="fw-bold">Popular Assessments</h2>
          <p className="text-light">Explore top skill-based assessments</p>
        </div>

        <div className="row justify-content-center">
          {categories.map((item, index) => (
            <div className="col-lg-2 col-md-4 col-6 mb-4" key={index}>
              <div
                className="category-card text-center"
                onClick={() => navigate("/login")}
                style={{ cursor: "pointer" }}
              >
                <FaLaptopCode className="icon" />
                <h6 className="mt-3">{item}</h6>
                <FaArrowRight className="arrow" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section">
        <div className="container">
          <div className="row text-center">
            <Stat icon={<FaUsers />} value="12K+" title="Students" />
            <Stat icon={<FaBrain />} value="500+" title="Assessments" />
            <Stat icon={<FaAward />} value="98%" title="Success Rate" />
            <Stat icon={<FaCertificate />} value="15K+" title="Certificates" />
          </div>
        </div>
      </section>

      {/* CERTIFICATE */}
      <section className="certificate-section container-fluid px-lg-5 px-4">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="certificate-preview">
              <h3>Digital Certificate</h3>
              <h2>John Doe</h2>
              <p>React Development Assessment</p>
              <span>Score : 94%</span>
            </div>
          </div>

          <div className="col-lg-6">
            <h2>Share Your Achievement</h2>
            <p>
              Download your certificate, verify it instantly and showcase your
              skills on professional platforms.
            </p>

            <ul>
              <li>✔ Instant Download</li>
              <li>✔ Employer Verification</li>
              <li>✔ Lifetime Validity</li>
            </ul>
          </div>
        </div>
      </section>

     
    </div>
  );
};

const Step = ({ number, title }) => (
  <div className="col-lg-3 col-md-6 mb-4">
    <div className="step-card">
      <div className="step-number">{number}</div>
      <h4>{title}</h4>
    </div>
  </div>
);

const Stat = ({ icon, value, title }) => (
  <div className="col-lg-3 col-6 mb-4">
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <h2>{value}</h2>
      <p>{title}</p>
    </div>
  </div>
);

export default LandingPage;
