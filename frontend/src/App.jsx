import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import { LoaderProvider, useLoader } from "./context/LoaderContext";
import ExcelLoading from "./loading_animation/ExcelLoading"; // ✅ loader component

// Pages
import LandingPage from "./Pages/Landing_pages/LandingPage";
import AuthForm from './Pages/Landing_pages/AuthForm';
import Layout from "./Pages/UserPage/Layout";
import Dashboard from './Pages/UserPage/dashboard';
import UploadPage from './Pages/UserPage/UploadPage';
import ChartAnalyzer from './Pages/UserPage/ChartAnalyzer';
import ChartHistory from "./Pages/UserPage/ChartHistory";
import AiInsight from './Pages/UserPage/aiInsights';
import Settings from './Pages/UserPage/settings';

import AdminLayout from "./Pages/AdminPanel/AdminLayout";
import AdminDashboard from "./Pages/AdminPanel/AdminDashboard";
import UserManagement from "./Pages/AdminPanel/UserManagement";
import UserActivity from "./Pages/AdminPanel/UserActivity";
import UserTimeline from "./Pages/AdminPanel/UserTimeline";
import AdminSettings from "./Pages/AdminPanel/AdminSettings";

// ✅ Separate component to consume context
function AppRoutes({ theme, setTheme }) {
  const { loading } = useLoader();
  const [userRole] = useState(localStorage.getItem("userRole"));
  const isAdmin = userRole === "admin";

  // ✅ Fetch theme on load
  useEffect(() => {
    const fetchTheme = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await fetch("http://localhost:5000/api/settings/user", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const result = await res.json();
          if (result.theme) setTheme(result.theme);
        } catch (err) {
          console.error("Failed to fetch theme", err);
        }
      }
    };
    fetchTheme();
  }, [setTheme]);

  // ✅ Apply theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <>
      {loading && <ExcelLoading />} {/* ✅ Show animation only when loading */}
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthForm />} />

        {/* Standalone Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Admin Panel */}
        <Route
          path="/AdminPanel"
          element={isAdmin ? <AdminLayout /> : <Navigate to="/" />}
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="activity" element={<UserActivity />} />
          <Route path="activity/:userId" element={<UserActivity />} />
          <Route path="timeline" element={<UserTimeline />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* User Layout Pages */}
        <Route path="/Layout" element={<Layout />}>
          <Route path="home" element={<Dashboard />} />
          <Route path="UploadPage" element={<UploadPage />} />
          <Route path="ChartAnalyzer" element={<ChartAnalyzer />} />
          <Route path="ChartHistory" element={<ChartHistory />} />
          <Route path="AiInsights" element={<AiInsight />} />
          <Route path="settings" element={<Settings onThemeChange={setTheme} />} />
        </Route>
      </Routes>
    </>
  );
}

// ✅ Final App with LoaderProvider
export default function App() {
  const [theme, setTheme] = useState("light");

  return (
    <Router>
      <LoaderProvider>
        <AppRoutes theme={theme} setTheme={setTheme} />
      </LoaderProvider>
    </Router>
  );
}
