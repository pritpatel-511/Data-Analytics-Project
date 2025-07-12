import React, { useEffect, useState } from "react";
import "./Styles/AdminSettings.css";
import useFetchWithLoader from "../../hooks/useFetchWithLoader";

export default function AdminSettings() {
  const [user, setUser] = useState({});
  const [showSection, setShowSection] = useState("main");
  const [newName, setNewName] = useState("");
  const [theme, setTheme] = useState("light");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const fetchWithLoader = useFetchWithLoader();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetchWithLoader("http://localhost:5000/api/settings/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data);
      setNewName(data.name);
      setTheme(data.theme);
    };
    fetchUser();
  }, [token]);

  const updateName = async () => {
    await fetchWithLoader("http://localhost:5000/api/settings/update-name", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newName }),
    });
    setShowSection("main");
    window.location.reload();
  };

  const changePassword = async () => {
    const res = await fetchWithLoader("http://localhost:5000/api/settings/change-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  
    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Failed to update password");
    } else {
      alert("Password updated successfully! ✅");
      setShowSection("main");
      setCurrentPassword("");  // clear input
      setNewPassword("");      // clear input
    }
  };
  

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    await fetchWithLoader("http://localhost:5000/api/settings/theme", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ theme: newTheme }),
    });
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <div className="admin-settings-container">
      <h2 className="settings-title">Settings</h2>

      {showSection === "main" && (
        <>
          <div className="profile-box">
            <h3>👤 Profile</h3>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>

          <div className="settings-options">
            <div>
              <h3>📝 Update Profile</h3>
              <button onClick={() => setShowSection("editName")}>Edit Profile</button>
            </div>
            <div>
              <h3>🔐 Security</h3>
              <button onClick={() => setShowSection("changePassword")}>Change Password</button>
            </div>
            <div>
              <h3>🎨 Appearance</h3>
              <button onClick={() => setShowSection("changeTheme")}>Change Theme</button>
            </div>
          </div>
        </>
      )}

      {showSection === "editName" && (
        <div className="edit-section">
          <h3>📝 Update Profile</h3>
          <input value={newName} onChange={(e) => setNewName(e.target.value)} />
          <button onClick={updateName}>Update Name</button>
          <button className="back-btn" onClick={() => setShowSection("main")}>← Back</button>
        </div>
      )}

      {showSection === "changePassword" && (
        <div className="edit-section">
          <h3>🔐 Change Password</h3>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={changePassword}>Update Password</button>
          <button className="back-btn" onClick={() => setShowSection("main")}>← Back</button>
        </div>
      )}

      {showSection === "changeTheme" && (
        <div className="edit-section">
          <h3>🎨 Select Theme</h3>
          <label htmlFor="themeToggle" className="switch">
            <input
              type="checkbox"
              id="themeToggle"
              checked={theme === "dark"}
              onChange={toggleTheme}
            />
            <span className="slider"></span>
            <span className="icon moon">🌙</span>
            <span className="icon sun">☀️</span>
          </label>
          <br />
          <button className="back-btn" onClick={() => setShowSection("main")}>← Back</button>
        </div>
      )}
    </div>
  );
}
