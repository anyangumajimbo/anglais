import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SessionManager from '../components/SessionManager';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import '../styles/AdminDashboard.css';

function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('sessions');
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <p>Semaine des Langues Management System</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="dashboard-nav">
        <button
          className={`nav-btn ${activeTab === 'sessions' ? 'active' : ''}`}
          onClick={() => setActiveTab('sessions')}
        >
          Sessions
        </button>
        <button
          className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'sessions' && <SessionManager />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
      </div>
    </div>
  );
}

export default AdminDashboard;
