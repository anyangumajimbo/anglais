import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Session APIs
export const getSessionToday = () => api.get('/session/today');
export const getSessionByDate = (date) => api.get(`/session/${date}`);

// Recording APIs - Upload audio file (multipart/form-data)
export const uploadRecording = (audioBlob, formData) => {
  const uploadApi = axios.create({
    baseURL: API_BASE_URL
  });

  const token = localStorage.getItem('adminToken');
  if (token) {
    uploadApi.defaults.headers.Authorization = `Bearer ${token}`;
  }

  return uploadApi.post('/recording/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// Legacy endpoint for backward compatibility
export const submitRecording = (data) => api.post('/recording/submit', data);

// Analytics APIs
export const trackEvent = (eventType, sessionDate) =>
  api.post('/analytics/event', { eventType, sessionDate });

// Admin APIs
export const adminLogin = (username, password) =>
  api.post('/admin/login', { username, password });

export const getAdminSessions = () => api.get('/admin/sessions');

export const createSession = (sessionData) =>
  api.post('/admin/sessions', sessionData);

export const updateSession = (id, sessionData) =>
  api.put(`/admin/sessions/${id}`, sessionData);

export const uploadAudio = (sessionId, formData) => {
  const uploadApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  const token = localStorage.getItem('adminToken');
  if (token) {
    uploadApi.defaults.headers.Authorization = `Bearer ${token}`;
  }

  return uploadApi.post(`/admin/sessions/${sessionId}/audio`, formData);
};

export const getAdminAnalytics = () => api.get('/admin/analytics');

export default api;
