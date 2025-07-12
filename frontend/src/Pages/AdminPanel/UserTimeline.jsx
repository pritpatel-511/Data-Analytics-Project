import React, { useEffect, useState } from "react";
import "./Styles/UserTimeline.css";
import useFetchWithLoader from "../../hooks/useFetchWithLoader";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function UserTimeline() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [logs, setLogs] = useState([]);
  const token = localStorage.getItem("token");
  const fetchWithLoader = useFetchWithLoader();

  useEffect(() => {
    fetchWithLoader("http://localhost:5000/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setUsers);
  }, [token]);

  const handleUserSelect = async (userId) => {
    setSelectedUser(userId);
    const res = await fetchWithLoader(`http://localhost:5000/api/admin/user/${userId}/logs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setLogs(data);
  };

  const formatType = (type) => {
    switch (type) {
      case "login":
        return "🔓 Login";
      case "logout":
        return "🔒 Logout";
      case "chart_created":
        return "📊 Chart Created";
      default:
        return type;
    }
  };

  // ✅ Chart 1: Login frequency by hour
  const loginHourlyData = logs
    .filter((log) => log.type === "login")
    .reduce((acc, log) => {
      const hour = new Date(log.timestamp).getHours();
      const label = `${hour}:00`;
      const found = acc.find((entry) => entry.hour === label);
      if (found) {
        found.count += 1;
      } else {
        acc.push({ hour: label, count: 1 });
      }
      return acc.sort((a, b) => parseInt(a.hour) - parseInt(b.hour));
    }, []);

  // ✅ Chart 2: Overall activity count by date
  const activityByDate = logs.reduce((acc, log) => {
    const date = new Date(log.timestamp).toISOString().split("T")[0];
    const found = acc.find((entry) => entry.date === date);
    if (found) {
      found.count += 1;
    } else {
      acc.push({ date, count: 1 });
    }
    return acc.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, []);

  return (
    <div className="user-timeline">
      <div className="timeline-header">
        <h2>User Activity Timeline</h2>
        <div className="timeline-dropdown-container">
          <label htmlFor="timeline-select">Select User:</label>
          <select
            id="timeline-select"
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
      <div className="timeline-charts-container">
          {/* ✅ Chart 1: Login Time Trend */}
          {loginHourlyData.length > 0 && (
            <div className="timeline-chart">
              <h3 style={{ textAlign: "center", marginTop: "40px" }}>Login Frequency by Hour</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={loginHourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#00b894" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* ✅ Chart 2: Overall Activity */}
          {activityByDate.length > 0 && (
            <div className="timeline-chart">
              <h3 style={{ textAlign: "center", marginTop: "40px" }}>Activity Trend by Date</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activityByDate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#0984e3" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          </div>

      {selectedUser && (
        <>
          <div className="timeline-list">
            {logs.length > 0 ? (
              logs
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map((log, index) => (
                  <div key={index} className="timeline-entry">
                    <div className="timeline-icon">{formatType(log.type)}</div>
                    <div className="timeline-info">
                      <p>{new Date(log.timestamp).toLocaleString()}</p>
                      {log.details && <small>{log.details}</small>}
                    </div>
                  </div>
                ))
            ) : (
              <p>No activity logs found for this user.</p>
            )}
          </div>
          
        </>
      )}
    </div>
  );
}
