import React from "react";
import "./AboutSection.css";

function AboutSection() {
  return (
    <section className="about-section py-5">
      <div className="container">
        <div className="row align-items-center">

          {/* Left Image Section */}
          <div className="col-lg-6 position-relative mb-5 mb-lg-0">

            <div className="dots"></div>

            <div className="main-image">
              <img
                src="https://images.unsplash.com/photo-1513258496099-48168024aec0"
                alt="student"
                className="img-fluid"
              />
            </div>

            <div className="experience-card">
              <h2>100%</h2>
              <div>
                <h5>VERIFIED SKILLS</h5>
                <p>CERTIFIED EXCELLENCE</p>
              </div>
            </div>

            <div className="small-image-card">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
                alt="teacher"
              />
            </div>
          </div>

          {/* Right Content Section */}
          <div className="col-lg-6 text-white">

            <span className="about-badge">
              About Ujjwal
            </span>

            <h1 className="hero-title">
              Welcome to <span>Ujjwal Radiant Vision</span>
              <br />
              Skill Assessment Portal
            </h1>

            <div className="quote-box">
              Empowering individuals and institutions with accurate, real-time skill evaluation and tamper-proof certificate verification.
            </div>

            <ul className="feature-list">
              <li>✔ Skill evaluations & Assessment tests</li>
              <li>✔ Instant automated certificate generation upon passing</li>
              <li>✔ Seamless verification portal for examiners & recruiters</li>
            </ul>

          </div>

        </div>
      </div>
    </section>
  );
}

export default AboutSection;