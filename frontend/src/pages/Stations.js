import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Stations.css';

// Fix Leaflet marker icons
const DefaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const SelectedIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNSIgaGVpZ2h0PSI0MSIgdmlld0JveD0iMCAwIDI1IDQxIj48cGF0aCBmaWxsPSIjMzQ5OGRiIiBkPSJNMTIuNSAwQzUuNiAwIDAgNS42IDAgMTIuNWMwIDEyLjUgMTIuNSAyOC4xIDEyLjUgMjguMXMxMi41LTE1LjYgMTIuNS0yOC4xQzI1IDUuNiAxOS40IDAgMTIuNSAweiIvPjwvc3ZnPg==',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.setIcon(DefaultIcon);

function Stations() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStation, setSelectedStation] = useState(null);
  const [stationDetails, setStationDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get('http://localhost:5000/stations', { headers });
      setStations(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load stations. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStationDetails = async (stationId) => {
    setDetailsLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get(`http://localhost:5000/stations/${stationId}`, { headers });
      setStationDetails(response.data);
    } catch (err) {
      console.error('Failed to load station details:', err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleMarkerClick = (station) => {
    setSelectedStation(station.Id);
    fetchStationDetails(station.Id);
  };

  const parseCoordinates = (coordString) => {
    if (!coordString) return [30.0, 100.0]; // Default to China center
    try {
      const [lat, lng] = coordString.split(',').map((c) => parseFloat(c.trim()));
      return [lat, lng];
    } catch {
      return [30.0, 100.0];
    }
  };

  if (loading) return <div className="loading">Loading stations...</div>;

  return (
    <div className="stations-page">
      <div className="stations-header">
        <h1>Water Stations Map</h1>
        <p>Click on any marker to view station details</p>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="stations-container">
        <div className="map-container">
          {stations.length > 0 ? (
            <MapContainer center={[30.0, 100.0]} zoom={5} className="leaflet-map">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {stations.map((station) => {
                const [lat, lng] = parseCoordinates(station.LongitudeLatitude);
                const isSelected = selectedStation === station.Id;
                return (
                  <Marker
                    key={station.Id}
                    position={[lat, lng]}
                    icon={isSelected ? SelectedIcon : DefaultIcon}
                    eventHandlers={{
                      click: () => handleMarkerClick(station),
                    }}
                  >
                    <Popup>
                      <div className="popup-content">
                        <h3>{station.StationName}</h3>
                        <p><strong>Water Level:</strong> {station.WaterLevel ? `${station.WaterLevel} m` : 'N/A'}</p>
                        <p><strong>Province:</strong> {station.Province || 'N/A'}</p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          ) : (
            <div className="no-data">No stations available</div>
          )}
        </div>

        <div className="details-panel">
          {selectedStation && stationDetails ? (
            <div className="station-details">
              <h2>{stationDetails.StationName}</h2>
              <div className="details-grid">
                <div className="detail-item">
                  <label>Water Level</label>
                  <p>{stationDetails.WaterLevel ? `${stationDetails.WaterLevel} m` : 'N/A'}</p>
                </div>
                <div className="detail-item">
                  <label>Normal Pool Level</label>
                  <p>{stationDetails.NormalPoolLevel ? `${stationDetails.NormalPoolLevel} m` : 'N/A'}</p>
                </div>
                <div className="detail-item">
                  <label>Flood Control Level</label>
                  <p>{stationDetails.FloodControlLevel ? `${stationDetails.FloodControlLevel} m` : 'N/A'}</p>
                </div>
                <div className="detail-item">
                  <label>Installed Capacity</label>
                  <p>{stationDetails.InstalledCapacity ? `${stationDetails.InstalledCapacity} MW` : 'N/A'}</p>
                </div>
                <div className="detail-item">
                  <label>Regulation Type</label>
                  <p>{stationDetails.RegulationType || 'N/A'}</p>
                </div>
                <div className="detail-item">
                  <label>Province</label>
                  <p>{stationDetails.Province || 'N/A'}</p>
                </div>
                <div className="detail-item full-width">
                  <label>Parent Organization</label>
                  <p>{stationDetails.ParentOrganization || 'N/A'}</p>
                </div>
                <div className="detail-item full-width">
                  <label>Coordinates</label>
                  <p>{stationDetails.LongitudeLatitude || 'N/A'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <p>👈 Click on a marker to view station details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Stations;
