import React, { useState } from 'react';
import { BarChart, LineChart, PieChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, Line, Pie, Cell } from 'recharts';
import axios from 'axios';

function ChartComponent() {
  const [query, setQuery] = useState('');
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState('');

  const handleQuerySubmit = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/charts/chart-with-db/", { query });
      setChartData(res.data.chart_data);
      setChartType(res.data.chart_type);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  return (
    <div>
      <input 
        type="text" 
        placeholder="Type your query here..." 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
      />
      <button onClick={handleQuerySubmit}>Generate Chart</button>

      {chartData.length > 0 && chartType === "bar chart" && (
        <div>
          <h4>Bar Chart:</h4>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {chartData.length > 0 && chartType === "line chart" && (
        <div>
          <h4>Line Chart:</h4>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="y" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Add more chart types like PieChart, ScatterPlot, etc., based on chartType */}

    </div>
  );
}

export default ChartComponent;
