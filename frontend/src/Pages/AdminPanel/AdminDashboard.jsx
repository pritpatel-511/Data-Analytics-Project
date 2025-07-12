import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Styles/AdminDashboard.css";
import useFetchWithLoader from "../../hooks/useFetchWithLoader";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalCharts: 0, totalFiles: 0 });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const fetchWithLoader = useFetchWithLoader();

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetchWithLoader("http://localhost:5000/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStats(data);
    };
    fetchStats(); 
  }, []);

  return (
    <div className="admin-dashboard-container">
      <h2 className="admin-dashboard-title">Admin Dashboard</h2>

      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Total Charts</h3>
          <p>{stats.totalCharts}</p>
        </div>
        <div className="stat-card">
          <h3>Total Files</h3>
          <p>{stats.totalFiles}</p>
        </div>
      </div>

      <div className="dashboard-text">
        <p>
          As an admin, you can view, manage, and monitor user accounts across the platform. Click the button below to manage registered users, block or remove users, and analyze their activity data.
        </p>
      </div>

      <div className="dashboard-actions">
        <button onClick={() => navigate("/adminpanel/users")} className="action-btn">
          👥 Manage Users
        </button>
      </div>
    </div>
  );
}
