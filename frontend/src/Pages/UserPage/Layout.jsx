import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./Styles/Layout.css";
import logo from "./web_logo.jpg";
import { useLoader } from "../../context/LoaderContext"; // ✅
import ExcelLoading from "../../loading_animation/ExcelLoading";

export default function Layout() {
  const user = JSON.parse(localStorage.getItem("user"));
  const { isLoading } = useLoader(); 

  return (
    <div className="layout-container">
      {/* ==== SIDEBAR ==== */}
      <div className="layout-sidebar">
        <div className="layout-logo-section">
          <img src={logo} alt="Logo" className="layout-logo" />
          <h1 className="layout-brand">Graphlytics</h1>
        </div>

        <NavLink to="/Layout/home" className={({ isActive }) => isActive ? "layout-menu-item active" : "layout-menu-item"}>
          🖥️ Dashboard
        </NavLink>
        <NavLink to="/Layout/UploadPage" className={({ isActive }) => isActive ? "layout-menu-item active" : "layout-menu-item"}>
          📥 Upload File
        </NavLink>
        <NavLink to="/Layout/ChartAnalyzer" className={({ isActive }) => isActive ? "layout-menu-item active" : "layout-menu-item"}>
          📊 Analyze Data
        </NavLink>
        <NavLink to="/Layout/ChartHistory" className={({ isActive }) => isActive ? "layout-menu-item active" : "layout-menu-item"}>
          🕘 History
        </NavLink>
        <NavLink to="/Layout/aiInsights" className={({ isActive }) => isActive ? "layout-menu-item active" : "layout-menu-item"}>
          🤖 AI Insights
        </NavLink>
        <NavLink to="/Layout/settings" className={({ isActive }) => isActive ? "layout-menu-item active" : "layout-menu-item"}>
          ⚙️ Settings
        </NavLink>
      </div>

      {/* ==== CONTENT SECTION ==== */}
      <div className="layout-content">
        <div className="layout-topbar">
          <div className="layout-profile">
            <span>🙎🏻‍♂️ {user?.name || "User"}</span>
            <button onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}>Logout</button>
          </div>
        </div>

        <div className="layout-main">
        {isLoading && <ExcelLoading />} 
          <Outlet />
        </div>
      </div>
    </div>
  );
}
