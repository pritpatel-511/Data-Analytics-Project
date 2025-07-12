import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Plot from 'react-plotly.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './Styles/ChartAnalyzer.css';
import useFetchWithLoader from "../../hooks/useFetchWithLoader";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const chartTypes2D = ['Bar Chart', 'Line Chart', 'Pie Chart', 'Doughnut Chart', 'Area Chart'];
const chartTypes3D = ['3D Bar Chart', '3D Surface Chart', '3D Pie Chart', '3D Scatter Chart'];

export default function ChartAnalyzer() {
  const location = useLocation();
  const headers = location.state?.headers || [];
  const data = location.state?.data || [];
  const chartRef = useRef();

  const [analysisTitle, setAnalysisTitle] = useState('');
  const [selectedChart, setSelectedChart] = useState('');
  const [chartType, setChartType] = useState('');
  const [xValue, setXValue] = useState('');
  const [yValue, setYValue] = useState('');
  const [zValue, setZValue] = useState('');
  const fetchWithLoader = useFetchWithLoader();
  const [chartCreated, setChartCreated] = useState(false);

  const handleChartClick = (type, dimension) => {
    setSelectedChart(type);
    setChartType(dimension);
    setChartCreated(false);
    setXValue('');
    setYValue('');
    setZValue('');
  };

const captureChartImage = async () => {
    if (!chartRef.current) {
      console.error("❌ chartRef is null – chart not yet rendered?");
      return null;
    }
  
    try {
      const canvas = await html2canvas(chartRef.current);
      return canvas.toDataURL("image/png");
    } catch (err) {
      console.error("❌ Failed to capture chart image:", err);
      return null;
    }
  };
  

  const saveChartHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      let imageUrl = await captureChartImage();

      // Only capture screenshot for 2D charts  
      if (chartType === "2D" && chartRef.current) {
        const canvas = await html2canvas(chartRef.current);
        imageUrl = canvas.toDataURL("image/png"); // base64 image
      }
      console.log("📤 saveChartHistory triggered");
      const response = await fetchWithLoader("http://localhost:5000/api/history/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: analysisTitle,
          chartType: selectedChart,
          xValue,
          yValue,
          zValue: selectedChart === "3D" ? zValue : undefined,
          imageUrl
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        console.error("❌ Save failed:", result);
        return;
      }

      console.log("✅ Chart history saved:", result.message);
    } catch (error) {
      console.error("❌ Error saving chart history:", error.message);
    }
  };

  

  const createChart = () => {
    if (!selectedChart || !xValue || !yValue || (chartType === '3D' && !zValue)) {
      alert('Please fill all required fields and select a chart type.');
      return;
    }

    setChartCreated(true);
    setTimeout(() => {
      saveChartHistory();
    }, 1500);// ✅ Store this analysis in MongoDB
  };

  const downloadAsImage = async () => {
    if (chartType === '3D') {
      alert('Heads up! Export and download options are only supported for 2D charts. For 3D charts, please take a screenshot manually.');
      return;
    }
    const canvas = await html2canvas(chartRef.current);
    const link = document.createElement('a');
    link.download = `${analysisTitle || 'chart'}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const exportAsPDF = async () => {
    if (chartType === '3D') {
      alert('Heads up! Export and download options are only supported for 2D charts. For 3D charts, please take a screenshot manually.');
      return;
    }
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.text(`Analysis Title: ${analysisTitle}`, 10, 10);
    pdf.text(`Chart Type: ${selectedChart}`, 10, 20);
    pdf.addImage(imgData, 'PNG', 10, 30, 180, 100);
    pdf.save(`${analysisTitle || 'chart'}.pdf`);
  };

  const renderChart = () => {
    switch (selectedChart) {
      case 'Bar Chart':
        return (
          <BarChart width={600} height={400} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xValue} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={yValue} fill="#8884d8" />
          </BarChart>
        );
      case 'Line Chart':
        return (
          <LineChart width={600} height={400} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xValue} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={yValue} stroke="#8884d8" />
          </LineChart>
        );
      case 'Pie Chart':
        return (
          <PieChart width={400} height={400}>
            <Pie data={data} dataKey={yValue} nameKey={xValue} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      case 'Doughnut Chart':
        return (
          <PieChart width={400} height={400}>
            <Pie data={data} dataKey={yValue} nameKey={xValue} cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#82ca9d" label>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      case 'Area Chart':
        return (
          <AreaChart width={600} height={400} data={data}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey={xValue} />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area type="monotone" dataKey={yValue} stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
          </AreaChart>
        );
      case '3D Bar Chart':
        return (
          <Plot
            data={[{
              type: 'mesh3d',
              x: data.map(item => item[xValue]),
              y: data.map(item => item[yValue]),
              z: data.map(item => item[zValue]),
              opacity: 0.6,
              color: '#8884d8'
            }]}
            layout={{ width: 700, height: 500, title: '3D Bar Chart' }}
          />
        );
      case '3D Surface Chart':
        return (
          <Plot
            data={[{
              z: data.map(item => item[zValue]),
              x: data.map(item => item[xValue]),
              y: data.map(item => item[yValue]),
              type: 'surface'
            }]}
            layout={{ width: 700, height: 500, title: '3D Surface Chart' }}
          />
        );
      case '3D Pie Chart':
        return (
          <Plot
            data={[{
              type: 'scatter3d',
              mode: 'markers',
              x: data.map(item => item[xValue]),
              y: data.map(item => item[yValue]),
              z: data.map(item => item[zValue]),
              marker: {
                size: 12,
                color: data.map(item => item[yValue]),
                colorscale: 'Viridis',
                opacity: 0.8,
              }
            }]}
            layout={{ width: 700, height: 500, title: '3D Pie Chart' }}
          />
        );
      case '3D Scatter Chart':
        return (
          <Plot
            data={[{
              x: data.map(item => item[xValue]),
              y: data.map(item => item[yValue]),
              z: data.map(item => item[zValue]),
              mode: 'markers',
              type: 'scatter3d',
              marker: { size: 6, color: 'red' }
            }]}
            layout={{ width: 700, height: 500, title: '3D Scatter Chart' }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="analyzer-container">
      <h2>Analyze Your Data</h2>
      <input
        type="text"
        className="input-title"
        placeholder="Enter analysis title..."
        value={analysisTitle}
        onChange={(e) => setAnalysisTitle(e.target.value)}
      />

      <div className="chart-type-section">
        <h3>Select a 2D Chart</h3>
        <div className="chart-options">
          {chartTypes2D.map((type) => (
            <button
              key={type}
              className={`chart-btn ${selectedChart === type ? 'selected' : ''}`}
              onClick={() => handleChartClick(type, '2D')}
            >
              {type}
            </button>
          ))}
        </div>

        <h3>Select a 3D Chart</h3>
        <div className="chart-options">
          {chartTypes3D.map((type) => (
            <button
              key={type}
              className={`chart-btn ${selectedChart === type ? 'selected' : ''}`}
              onClick={() => handleChartClick(type, '3D')}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="value-inputs">
        <div>
          <label>X values</label>
          <select value={xValue} onChange={(e) => setXValue(e.target.value)}>
            <option value="">Select X value</option>
            {headers.map(header => (
              <option key={header} value={header}>{header}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Y values</label>
          <select value={yValue} onChange={(e) => setYValue(e.target.value)}>
            <option value="">Select Y value</option>
            {headers.map(header => (
              <option key={header} value={header}>{header}</option>
            ))}
          </select>
        </div>
        {chartType === '3D' && (
          <div>
            <label>Z values</label>
            <select value={zValue} onChange={(e) => setZValue(e.target.value)}>
              <option value="">Select Z value</option>
              {headers.map(header => (
                <option key={header} value={header}>{header}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <button className="create-btn" onClick={createChart}>Create Chart</button>

      {chartCreated && (
        <div ref={chartRef} className="chart-placeholder">
          <h4>{analysisTitle}</h4>
          <p>Chart Type: {selectedChart}</p>
          <p>X: {xValue} | Y: {yValue}{chartType === '3D' && ` | Z: ${zValue}`}</p>
          {renderChart()}
        </div>
      )}

      {chartCreated && (
        <div className="download-buttons">
          <button onClick={downloadAsImage}>Download as PNG</button>
          <button onClick={exportAsPDF}>Export to PDF</button>
        </div>
      )}

    </div>
  );
}
