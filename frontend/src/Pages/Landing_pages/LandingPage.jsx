// src/Pages/LandingPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Styles/LandingPage.css";
import illustration from "./landing_img.svg"; // Your custom image

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-wrapper">
      <div className="left-section">
        <h1 className="brand">GRAPHLYTICS</h1>

        <h2 className="title">Welcome to Our<br />Data Analytics Platform</h2>
        <p className="subtitle">
          A secure and powerful platform <br />for AI-driven data analysis
        </p>

        <ul className="features">
            <h2>Features</h2>
          <li>🛡️ <span>Secure platform</span></li>
          <li>🤖 <span>AI integration</span></li>
          <li>📥 <span>Download reports</span></li>
          <li>🕘 <span>Manage history</span></li>
        </ul>
      </div>

      <div className="right-section">
        <img src={illustration} alt="Graphlytics Illustration" className="set-img" />
        <div className="cta">
          <p>Start your analysis<br /><strong>with Graphlytics</strong></p>
          <button onClick={() => navigate("/login")}>Get Started</button>
        </div>
      </div>
    </div>
  );
}
