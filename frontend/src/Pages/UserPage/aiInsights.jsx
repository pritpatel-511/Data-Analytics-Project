import React, { useState, useEffect } from "react";
import "./Styles/AIInsights.css";
import { useNavigate, useLocation } from "react-router-dom";
import useFetchWithLoader from "../../hooks/useFetchWithLoader";

export default function AIInsights() {
  const location = useLocation();
  const navigate = useNavigate();

  const [showFullPreview, setShowFullPreview] = useState(false);
  const [data, setData] = useState(location.state?.data || []);
  const [uploadedFileName, setUploadedFileName] = useState(location.state?.fileName || "");
  const [insight, setInsight] = useState(null);
  const [userQuestion, setUserQuestion] = useState("");
  const [chatReply, setChatReply] = useState("");
  const fetchWithLoader = useFetchWithLoader();

  // Fetch AI Insights when data changes
  useEffect(() => {
    if (data.length === 0) return;

    const fetchInsights = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetchWithLoader("http://localhost:5000/api/ai/insight", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ data }),
        });
        const result = await res.json();
        setInsight(result);
      } catch (err) {
        console.error("Failed to fetch AI insight:", err);
      }
    };

    fetchInsights();
  }, [data]);

  // Handle file upload manually
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const XLSX = await import("xlsx");
      const workbook = XLSX.read(event.target.result, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setData(jsonData);
    };
    reader.readAsBinaryString(file);
  };

  // Chat with AI Assistant
  const handleChat = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetchWithLoader("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data, question: userQuestion }),
      });
      const result = await res.json();
      setChatReply(result.reply);
    } catch (err) {
      console.error("ChatGPT error:", err);
      setChatReply("Something went wrong while fetching the response.");
    }
  };

  const handleGenerateChart = () => {
    if (!insight?.recommendation) {
      alert("No chart recommendation available.");
      return;
    }
    const { x, y, chart } = insight.recommendation;
    navigate("/Layout/ChartAnalyzer", {
      state: {
        headers: Object.keys(data[0]),
        data,
        aiSuggestion: { xValue: x, yValue: y, chartType: chart },
      },
    });
  };

  return (
    <div className="ai-insight-container">
      <h2>AI Insights</h2>

      <label htmlFor="fileUpload" className="file-input-label">📂 Upload Excel File</label>
      <input
        id="fileUpload"
        type="file"
        accept=".xlsx"
        className="file-input"
        onChange={handleFileChange}
      />
      {uploadedFileName && <p className="uploaded-filename">📄 {uploadedFileName}</p>}

      {data.length > 0 && (
        <div className="insight-grid">
          {/* Data Preview */}
          {/* Data Preview Section with Fullscreen Modal */}
          <div className="card preview">
            <h4>📥 Upload Data Preview</h4>
            <button
              className="expand-btn"
              onClick={() => setShowFullPreview(true)}
            >
              🔍 View Fullscreen
            </button>
          </div>

          {showFullPreview && (
            <div className="fullscreen-modal">
              <div className="modal-content">
                <div className="modal-header">
                  <h3>📥 Full Data Preview</h3>
                  <button onClick={() => setShowFullPreview(false)}>❌ Close</button>
                </div>
                <div className="modal-table">
                  <table>
                    <thead>
                      <tr>{Object.keys(data[0]).map((k) => <th key={k}>{k}</th>)}</tr>
                    </thead>
                    <tbody>
                      {data.map((row, i) => (
                        <tr key={i}>
                          {Object.values(row).map((v, j) => <td key={j}>{v}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}


          {/* Chart Recommendation */}
          <div className="card recommendation scrollable-card">
            <h4>📊 Chart Recommendation</h4>
            <p>{insight?.recommendation?.description || "No suggestion available."}</p>
            {insight?.recommendation && (
              <button className="generate-btn" onClick={handleGenerateChart}>
                🎯 Use Insight to Generate Chart
              </button>
            )}
          </div>

          {/* AI Stats */}
          <div className="card">
            <h4>📈 AI-Generated Stats</h4>
            {insight?.stats ? (
              Object.entries(insight.stats).map(([key, val]) => (
                <p key={key}><strong>{key}:</strong> Avg ₹{val.average}, Max ₹{val.max}, Min ₹{val.min}</p>
              ))
            ) : (
              <p>No stats available.</p>
            )}
          </div>

          {/* Chart Summary & Correlation */}
          <div className="stacked-cards">
            <div className="card small-card">
              <h4>🧾 Chart Summary</h4>
              <ul>
                <li>{insight?.summary?.rowCount || 0} rows, {insight?.summary?.columnCount || 0} columns</li>
                <li>Data types: {insight?.summary?.dataTypes?.categorical?.length || 0} categorical, {insight?.summary?.dataTypes?.numeric?.length || 0} numeric</li>
              </ul>
            </div>
            {insight?.correlation && (
              <div className="card small-card">
                <h4>🔗 Correlations</h4>
                <p>{insight.correlation}</p>
              </div>
            )}
          </div>

          {/* AI Assistant */}
          <div className="card chat-box large scrollable-card">
            <h4>🤖 AI Assistant</h4>
            <input
              type="text"
              placeholder="Ask anything about your data"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
            />
            <button onClick={handleChat}>Ask</button>
            {chatReply && (
              <div className="chat-response">
                <p><strong>Response:</strong> {chatReply}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
