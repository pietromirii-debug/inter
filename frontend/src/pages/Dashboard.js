import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    totalStations: 0,
    totalRecords: 0,
    averageWaterLevel: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const headers = { Authorization: `Bearer ${token}` };

      const [stationsRes, hydrologicalRes] = await Promise.all([
        axios.get('http://localhost:5000/stations', { headers }),
        axios.get('http://localhost:5000/hydrological', { headers }),
      ]);

      const totalStations = stationsRes.data.length;
      const totalRecords = hydrologicalRes.data.length;
      const avgWaterLevel =
        totalRecords > 0
          ? (
              hydrologicalRes.data.reduce((sum, r) => sum + (r.ReservoirWaterLevel || 0), 0) /
              totalRecords
            ).toFixed(2)
          : 0;

      setStats({
        totalStations,
        totalRecords,
        averageWaterLevel: avgWaterLevel,
      });
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="container">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome to Hydrological Data Management System</p>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📍</div>
          <div className="stat-content">
            <h3>Total Stations</h3>
            <p className="stat-value">{stats.totalStations}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total Records</h3>
            <p className="stat-value">{stats.totalRecords}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💧</div>
          <div className="stat-content">
            <h3>Avg Water Level</h3>
            <p className="stat-value">{stats.averageWaterLevel} m</p>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h2>Quick Start</h2>
        <div className="info-cards">
          <div className="info-card">
            <h4>🗺️ View Stations Map</h4>
            <p>View all water stations on an interactive map with detailed information about each station.</p>
            <a href="/stations" className="info-link">Go to Stations Map →</a>
          </div>
          <div className="info-card">
            <h4>🔮 Predict Data</h4>
            <p>Use machine learning to predict hydrological data for the next day based on historical trends.</p>
            <a href="/predict" className="info-link">Go to Prediction →</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
