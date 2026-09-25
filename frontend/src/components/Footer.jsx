import "./Footer.css";
import { FaGithub } from "react-icons/fa";
import { FaSquareTwitter } from "react-icons/fa6";
import { FaInstagramSquare } from "react-icons/fa";

function Footer() {
  return (
    <footer className="custom-footer conatiner-fluid">
      <div className="container-fluid">
        <div className="row align-items-center">

          {/* Left */}
          <div className="col-md-6 text-center text-md-start text-light">
            <p className="footer-text">
              © 2026 SkillCert. All rights reserved.
            </p>
          </div>

          {/* Right */}
          <div className="col-md-6 text-center text-md-end">
            <div className="footer-icons">
              <FaGithub />
              <FaSquareTwitter />
              <FaInstagramSquare />
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;