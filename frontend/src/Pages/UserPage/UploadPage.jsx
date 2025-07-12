import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import './Styles/UploadPage.css';
import { useNavigate } from 'react-router-dom';
import useFetchWithLoader from "../../hooks/useFetchWithLoader";

export default function UploadPage() {
  const [fileName, setFileName] = useState('');
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const fetchWithLoader = useFetchWithLoader();

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const workbook = XLSX.read(event.target.result, { type: 'binary' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setData(jsonData);

      // Send to backend to track upload
      const token = localStorage.getItem("token");
      if (token) {
        try {
          await fetchWithLoader("http://localhost:5000/api/upload/upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ fileName: file.name })
          });
          console.log("✅ File upload tracked successfully.");
        } catch (err) {
          console.error("❌ Failed to track upload:", err);
        }
      }
    };

    reader.readAsBinaryString(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: '.xlsx' });

  const handleAnalyze = () => {
    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      navigate('/Layout/ChartAnalyzer', { state: { headers, data } });
    } else {
      alert('Please upload a file first.');
    }
  };

  const handleAnalyzeWithAI = () => {
    if (data.length > 0) {
      navigate('/Layout/AIInsights', { state: { data,fileName } });
    } else {
      alert('Please upload a file to use AI Insights.');
    }
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">
        Upload your Excel sheet here and analyze it instantly with <span className="highlight">Graphlytics</span>.
      </h2>

      <div {...getRootProps()} className="upload-dropzone">
        <input {...getInputProps()} />
        <p>Drag and drop a file here or click to upload (.xlsx only)</p>
      </div>

      {fileName && <p className="upload-filename">📄 {fileName}</p>}

      {data.length > 0 && (
        <>
          <h3 className="upload-preview-title">Data Preview</h3>
          <table className="upload-table">
            <thead>
              <tr>
                {Object.keys(data[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 5).map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((val, j) => (
                    <td key={j}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* 🎯 Two buttons */}
          <div className="button-group">
            <button className="upload-button" onClick={handleAnalyze}>
              Analyze Chart
            </button>
            <button className="upload-button ai-btn" onClick={handleAnalyzeWithAI}>
              Analyze with AI
            </button>
          </div>
        </>
      )}
    </div>
  );
}
