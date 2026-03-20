import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserSession from './pages/UserSession';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import './styles/globals.css';
import './styles/App.css';

function App() {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setAdminToken(token);
  }, []);

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserSession />} />
        <Route
          path="/admin/login"
          element={adminToken ? <Navigate to="/admin/dashboard" /> : <AdminLogin onLoginSuccess={(token) => {
            setAdminToken(token);
            localStorage.setItem('adminToken', token);
          }} />}
        />
        <Route
          path="/admin/dashboard"
          element={adminToken ? <AdminDashboard onLogout={handleAdminLogout} /> : <Navigate to="/admin/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
