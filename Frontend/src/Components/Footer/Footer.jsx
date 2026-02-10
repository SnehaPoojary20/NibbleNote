import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-container">

        {/* Brand Section */}
        <div className="footer-brand">
          <h2>NibbleNote</h2>
          <p>Discover. Review. Remember great food.</p>
          <span>© 2026 NibbleNote</span>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Company</h4>
          <a href="#">About</a>
          <a href="#">Careers</a>
          <a href="#">Contact</a>
        </div>

        {/* Legal */}
        <div className="footer-section">
          <h4>Legal</h4>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookies</a>
        </div>

        {/* Socials */}
        <div className="footer-section">
          <h4>Connect</h4>
          <div className="footer-socials">
            <a href="mailto:contact@nibblenote.com">Email</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;


