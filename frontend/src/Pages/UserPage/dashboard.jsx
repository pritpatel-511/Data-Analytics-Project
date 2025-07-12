import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Styles/dashboard.css";
import useFetchWithLoader from "../../hooks/useFetchWithLoader";

export default function Dashboard({ userName = "Prit Patel" }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalCharts: 0,
    savedCharts: 0,
  });
  const fetchWithLoader = useFetchWithLoader();
  // Fetch stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetchWithLoader("http://localhost:5000/api/history/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setStats(data);
        } else {
          console.error("❌ Failed to fetch dashboard stats:", data.message);
        }
      } catch (error) {
        console.error("❌ Error loading dashboard data:", error);
      }
    };

    fetchStats();
  }, []);

  const handleStart = () => {
    navigate("/Layout/UploadPage");
  };

  return (
    <div className="dashboard-container">
      <div className="welcome-card">
        <h1>
          Welcome to <span className="highlight">Graphlytics</span>, {userName}!
        </h1>
        <p>
          Graphlytics empowers you to transform your data into interactive and
          insightful charts. Get started by uploading your data files and
          creating your charts.
        </p>
      </div>

      <div className="stats-section">
        <div className="stat-card">
          <h2>{stats.totalFiles}</h2>
          <p>Total Files Uploaded</p>
        </div>
        <div className="stat-card">
          <h2>{stats.totalCharts}</h2>
          <p>Total Charts Created</p>
        </div>
        <div className="stat-card">
          <h2>{stats.savedCharts}</h2>
          <p>Saved Chart Histories</p>
        </div>
      </div>

      <div className="start-section">
        <p className="start-text">Ready to visualize your data? Click below to begin!</p>
        <button onClick={handleStart} className="start-btn">
          Start Data Visualization
        </button>
      </div>
    </div>
  );
}
