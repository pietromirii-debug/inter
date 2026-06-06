import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navigation.css';

function Navigation({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/dashboard" className="nav-logo">
          💧 Hydro Manager
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/stations" className="nav-link">
              Stations Map
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/predict" className="nav-link">
              Prediction
            </Link>
          </li>
        </ul>
        <div className="nav-user">
          <span className="user-info">{user?.username}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
