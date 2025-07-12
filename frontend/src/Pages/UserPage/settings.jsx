import React, { useEffect, useState } from "react";
import "./Styles/SettingsPage.css";
import useFetchWithLoader from "../../hooks/useFetchWithLoader";

export default function SettingsPage() {
  const [userData, setUserData] = useState({ name: "", email: "", theme: "system" });
  const [newName, setNewName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [theme, setTheme] = useState("light");

  const [showNameEdit, setShowNameEdit] = useState(false);
  const [showPasswordEdit, setShowPasswordEdit] = useState(false);
  const [showThemeEdit, setShowThemeEdit] = useState(false);
  const fetchWithLoader = useFetchWithLoader();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const res = await fetchWithLoader("http://localhost:5000/api/settings/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      setUserData(result);
      setNewName(result.name);
      setTheme(result.theme || "light");
    };
    fetchUser();
  }, []);

  // Apply theme to body when theme changes
  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
    } else {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
    }
  }, [theme]);

  const handleNameUpdate = async () => {
    const token = localStorage.getItem("token");
    await fetchWithLoader("http://localhost:5000/api/settings/update-name", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newName }),
    });
    alert("Name updated!");
    setUserData({ ...userData, name: newName });
    setShowNameEdit(false);
  };

  const handlePasswordChange = async () => {
    const token = localStorage.getItem("token");
    const res = await fetchWithLoader("http://localhost:5000/api/settings/change-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const result = await res.json();
    if (res.ok) {
      alert("Password updated!");
      setCurrentPassword("");
      setNewPassword("");
      setShowPasswordEdit(false);
    } else {
      alert(result.message || "Password update failed.");
    }
  };

  const handleThemeToggle = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);

    const token = localStorage.getItem("token");
    await fetchWithLoader("http://localhost:5000/api/settings/theme", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ theme: newTheme }),
    });
  };

  return (
    <div className="settings-container">
      <h2 id="heading">Settings</h2>
  
      {/* If no section is selected, show main settings overview */}
      {!showNameEdit && !showPasswordEdit && !showThemeEdit && (
        <>
          <div className="profile-info">
            <h3>👤 Profile</h3>
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
          </div>
  
          <div className="settings-grid">
            <div className="settings-card">
              <h3>✏️ Update Profile</h3>
              <button onClick={() => setShowNameEdit(true)}>Edit Profile</button>
            </div>
  
            <div className="settings-card">
              <h3>🔒 Security</h3>
              <button onClick={() => setShowPasswordEdit(true)}>Change Password</button>
            </div>
  
            <div className="settings-card">
              <h3>🎨 Appearance</h3>
              <button onClick={() => setShowThemeEdit(true)}>Change Theme</button>
            </div>
          </div>
        </>
      )}
  
      {/* Full-screen Update Profile */}
      {showNameEdit && (
        <div className="settings-fullview">
          <h3>✏️ Update Profile</h3>
          <label>New Name</label>
          <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <button onClick={handleNameUpdate}>Update Name</button>
          <button className="back-btn" onClick={() => setShowNameEdit(false)}>← Back</button>
        </div>
      )}
  
      {/* Full-screen Password Change */}
      {showPasswordEdit && (
        <div className="settings-fullview">
          <h3>🔒 Change Password</h3>
          <label>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handlePasswordChange}>Update Password</button>
          <button className="back-btn" onClick={() => setShowPasswordEdit(false)}>← Back</button>
        </div>
      )}
  
      {/* Full-screen Theme Toggle */}
      {showThemeEdit && (
        <div className="settings-fullview">
          <h3>🎨 Select Theme</h3>
          <div className="theme-toggle">
            <label htmlFor="themeToggle" className="switch">
              <input
                type="checkbox"
                id="themeToggle"
                checked={theme === "dark"}
                onChange={handleThemeToggle}
              />
              <span className="slider"></span>
              <span className="icon moon">🌙</span>
              <span className="icon sun">☀️</span>
            </label>
          </div>
          <button className="back-btn" onClick={() => setShowThemeEdit(false)}>← Back</button>
        </div>
      )}
    </div>
  );
  
}
