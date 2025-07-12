import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Styles/UserActivity.css";
import useFetchWithLoader from "../../hooks/useFetchWithLoader";

export default function UserActivity() {
  const { userId } = useParams();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(userId || "");
  const [files, setFiles] = useState([]);
  const [charts, setCharts] = useState([]);
  const fetchWithLoader = useFetchWithLoader();
  const token = localStorage.getItem("token");

  // Fetch users for dropdown
  useEffect(() => {
    fetchWithLoader("http://localhost:5000/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setUsers);
  }, [token]);

  // Fetch activity if userId is in URL
  useEffect(() => {
    if (userId) {
      fetchUserActivity(userId);
    }
  }, [userId]);

  const fetchUserActivity = async (userId) => {
    setSelectedUser(userId);
    try {
      const [filesRes, chartsRes] = await Promise.all([
        fetchWithLoader(`http://localhost:5000/api/admin/files/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetchWithLoader(`http://localhost:5000/api/admin/charts/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const filesData = await filesRes.json();
      const chartsData = await chartsRes.json();
      setFiles(filesData);
      setCharts(chartsData);
    } catch (err) {
      console.error("Failed to load user activity", err);
    }
  };

  const handleUserSelect = (userId) => {
    fetchUserActivity(userId);
  };

  return (
    <div className="user-activity">
      <div className="activity-header">
        <h2>User Activity</h2>
        <div className="dropdown-container">
          <label htmlFor="user-select">Select User:</label>
          <select
            id="user-select"
            value={selectedUser}
            onChange={(e) => handleUserSelect(e.target.value)}
          >
            <option value="">Select a user</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedUser && (
        <div className="activity-section">
          <div className="files-section">
            <h3>Uploaded Files</h3>
            <ul>
              {files.map((file) => (
                <li key={file._id}>
                  {file.fileName} — {new Date(file.uploadedOn).toLocaleString()}
                </li>
              ))}
            </ul>
          </div>

          <div className="charts-section">
            <h3>Created Charts</h3>
            <div className="chart-list">
              {charts.map((chart) => (
                <div key={chart._id} className="chart-card">
                  <p>
                    <strong>{chart.title}</strong> ({chart.chartType})
                  </p>
                  <p>Created: {new Date(chart.createdOn).toLocaleString()}</p>
                  {chart.imageUrl && <img src={chart.imageUrl} alt={chart.title} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
