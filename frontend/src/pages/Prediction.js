import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './Prediction.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Prediction() {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState('');
  const [trainingDays, setTrainingDays] = useState(30);
  const [daysToPredict, setDaysToPredict] = useState(1);
  const [predictions, setPredictions] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get('http://localhost:5000/stations', { headers });
      setStations(response.data);
      if (response.data.length > 0) {
        setSelectedStation(response.data[0].Id);
      }
    } catch (err) {
      setError('Failed to load stations');
      console.error(err);
    }
  };

  const fetchHistoricalData = async (stationId) => {
    try {
      const token = localStorage.getItem('access_token');
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get(`http://localhost:5000/hydrological/station/${stationId}`, {
        headers,
      });
      setHistoricalData(response.data);
    } catch (err) {
      console.error('Failed to load historical data:', err);
    }
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setError('');
    setPredictions(null);
    setLoading(true);

    if (!selectedStation) {
      setError('Please select a station');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const headers = { Authorization: `Bearer ${token}` };

      await fetchHistoricalData(selectedStation);

      const response = await axios.post(
        `http://localhost:5000/predict/hydrological/${selectedStation}`,
        {
          training_days: trainingDays,
          days_to_predict: daysToPredict,
        },
        { headers }
      );

      setPredictions(response.data);
      generateChart(response.data);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to generate predictions. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateChart = (predictionData) => {
    if (historicalData.length === 0) return;

    const historicalDates = historicalData.map((d) => d.RecordDate);
    const historicalWaterLevels = historicalData.map((d) => d.ReservoirWaterLevel || 0);

    const predictionDates = predictionData.Predictions.map((p) => p.RecordDate);
    const predictionWaterLevels = predictionData.Predictions.map((p) => p.ReservoirWaterLevel);

    const allDates = [...historicalDates, ...predictionDates];
    const allWaterLevels = [...historicalWaterLevels, ...predictionWaterLevels];

    setChartData({
      labels: allDates,
      datasets: [
        {
          label: 'Historical Water Level',
          data: [...historicalWaterLevels, ...Array(predictionDates.length).fill(null)],
          borderColor: '#3498db',
          backgroundColor: 'rgba(52, 152, 219, 0.1)',
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: '#3498db',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Predicted Water Level',
          data: [...Array(historicalDates.length).fill(null), ...predictionWaterLevels],
          borderColor: '#e74c3c',
          backgroundColor: 'rgba(231, 76, 60, 0.1)',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 4,
          pointBackgroundColor: '#e74c3c',
          tension: 0.4,
          fill: true,
        },
      ],
    });
  };

  const stationName = stations.find((s) => s.Id === selectedStation)?.StationName || '';

  return (
    <div className="container">
      <div className="page-header">
        <h1>Hydrological Data Prediction</h1>
        <p>Predict water level and hydrological metrics for the next day using machine learning</p>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="prediction-container">
        <div className="prediction-form-section">
          <div className="prediction-card">
            <h2>Prediction Settings</h2>
            <form onSubmit={handlePredict}>
              <div className="form-group">
                <label htmlFor="station">Select Station *</label>
                <select
                  id="station"
                  value={selectedStation}
                  onChange={(e) => setSelectedStation(parseInt(e.target.value))}
                  required
                  disabled={loading}
                >
                  <option value="">-- Select a station --</option>
                  {stations.map((station) => (
                    <option key={station.Id} value={station.Id}>
                      {station.StationName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="trainingDays">Training Days</label>
                  <input
                    id="trainingDays"
                    type="number"
                    value={trainingDays}
                    onChange={(e) => setTrainingDays(Math.max(2, parseInt(e.target.value) || 2))}
                    min="2"
                    max="365"
                    disabled={loading}
                  />
                  <small>Use {trainingDays} days of historical data</small>
                </div>

                <div className="form-group">
                  <label htmlFor="daysPredict">Days to Predict</label>
                  <input
                    id="daysPredict"
                    type="number"
                    value={daysToPredict}
                    onChange={(e) => setDaysToPredict(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max="30"
                    disabled={loading}
                  />
                  <small>Predict next {daysToPredict} day(s)</small>
                </div>
              </div>

              <button type="submit" disabled={loading} className="predict-btn">
                {loading ? 'Generating Predictions...' : 'Generate Predictions'}
              </button>
            </form>
          </div>

          {predictions && (
            <div className="prediction-card results-card">
              <h2>Prediction Results for {stationName}</h2>
              <div className="results-info">
                <p>
                  <strong>Training Data Points:</strong> {predictions.TrainingDataPoints}
                </p>
                <p>
                  <strong>Predictions Generated:</strong> {predictions.Predictions.length}
                </p>
              </div>

              <div className="predictions-table">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Water Level (m)</th>
                      <th>Inbound Flow</th>
                      <th>Outbound Flow</th>
                      <th>Storage Capacity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {predictions.Predictions.map((pred, idx) => (
                      <tr key={idx}>
                        <td>{pred.RecordDate}</td>
                        <td className="metric-value">{pred.ReservoirWaterLevel.toFixed(2)}</td>
                        <td>{pred.InboundFlow.toFixed(2)}</td>
                        <td>{pred.OutboundFlow.toFixed(2)}</td>
                        <td>{pred.WaterStorageCapacity.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {chartData && (
          <div className="chart-section">
            <div className="prediction-card">
              <h2>Water Level Trend</h2>
              <div className="chart-container">
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: false,
                        title: {
                          display: true,
                          text: 'Water Level (m)',
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Prediction;
