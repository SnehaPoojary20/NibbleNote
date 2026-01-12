import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        
        {/* Left */}
        <div className="footer-left">
          © 2026 <span className="brand">NibbleNote</span>
        </div>

        {/* Center */}
        <div className="footer-socials">
          <a href="mailto:contact@nibblenote.com">Email</a>
          <a href="https://instagram.com" target="_blank">Instagram</a>
          <a href="https://linkedin.com" target="_blank">LinkedIn</a>
        </div>

        {/* Right */}
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

