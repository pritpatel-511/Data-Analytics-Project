import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import "./Styles/AdminLayout.css";
import logo from "./web_logo.jpg"; // use your actual logo
import { FaTachometerAlt, FaUsers, FaChartBar, FaClock, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useLoader } from "../../context/LoaderContext"; // ✅
import ExcelLoading from "../../loading_animation/ExcelLoading";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { isLoading } = useLoader(); 
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const adminName = JSON.parse(localStorage.getItem("user"))?.name || "Admin";

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo-section">
          <img src={logo} alt="Logo" className="admin-logo" />
          <h1 className="admin-brand">Graphlytics</h1>
        </div>

        <nav className="admin-nav">
          <NavLink to="/AdminPanel" end><FaTachometerAlt /> Dashboard</NavLink>
          <NavLink to="/AdminPanel/users"><FaUsers /> User Management</NavLink>
          <NavLink to="/AdminPanel/activity"><FaChartBar /> User Activity</NavLink>
          <NavLink to="/AdminPanel/timeline"><FaClock /> User Timeline</NavLink>
          <NavLink to="/AdminPanel/settings"><FaCog /> Settings</NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-user-info">
            <span>🙎🏻‍♂️ {adminName}</span>
            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </header>

        <main className="admin-content">
        {isLoading && <ExcelLoading />} 
          <Outlet />
        </main>
      </div>
    </div>
  );
}
