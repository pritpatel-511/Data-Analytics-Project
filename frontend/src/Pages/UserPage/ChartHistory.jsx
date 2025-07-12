import React, { useEffect, useState } from "react";
import './Styles/ChartHistory.css';
import useFetchWithLoader from "../../hooks/useFetchWithLoader";

export default function ChartHistory() {
  const [history, setHistory] = useState([]);
  const [viewImageUrl, setViewImageUrl] = useState(null);
  const fetchWithLoader = useFetchWithLoader();

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        return;
      }

      try {
        const res = await fetchWithLoader("http://localhost:5000/api/history/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        console.log("\uD83D\uDD0D History fetched:", data);

        if (Array.isArray(data)) {
          setHistory(data);
        } else {
          console.error("Expected an array but got:", data);
          setHistory([]);
        }
      } catch (error) {
        console.error("\u274C Error fetching history:", error);
      }
    };

    fetchHistory();
  }, []);

  const downloadChart = (chart) => {
    if (!chart.imageUrl) return;
    const element = document.createElement("a");
    element.href = chart.imageUrl;
    element.download = `${chart.title || 'chart'}_${Date.now()}.png`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const viewChart = (imageUrl) => {
    setViewImageUrl(imageUrl);
  };

  const closeModal = () => {
    setViewImageUrl(null);
  };

  const removeChart = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetchWithLoader(`http://localhost:5000/api/history/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (res.ok) {
        setHistory(prev => prev.filter(h => h._id !== id));
      } else {
        console.error("Failed to delete chart:", result);
      }
    } catch (err) {
      console.error("❌ Error deleting chart:", err);
    }
  };

  return (
    <div className="history-container">
      <h2>Chart History</h2>
      {history.length === 0 ? (
        <p>No charts found in history.</p>
      ) : (
        history.map((item, idx) => (
          <div className="history-card" key={idx}>
            <div className="history-info">
              <div className="text-content">
                <p><strong>Chart Title:</strong> {item.title || 'Untitled'}</p>
                <p><strong>Chart Type:</strong> {item.chartType}</p>
                <p><strong>Date:</strong> {item.createdOn ? new Date(item.createdOn).toLocaleString() : (item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A')}</p>
                <div className="history-actions">
                  <button onClick={() => viewChart(item.imageUrl)}>View Chart</button>
                  <button onClick={() => downloadChart(item)}>Download Chart</button>
                  <button onClick={() => removeChart(item._id)} style={{ backgroundColor: '#e53e3e' }}>Remove</button>
                </div>
              </div>
              {item.imageUrl && (
                <img className="preview-img" src={item.imageUrl} alt="Chart preview" />
              )}
            </div>
          </div>
        ))
      )}

      {viewImageUrl && (
        <div className="modal full-screen" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={viewImageUrl} alt="Full Chart View" />
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}