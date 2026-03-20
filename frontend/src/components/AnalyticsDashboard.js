import React, { useState, useEffect } from 'react';
import { getAdminAnalytics } from '../services/api';
import '../styles/AnalyticsDashboard.css';

function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await getAdminAnalytics();
      setAnalytics(response.data.analytics);
      setError('');
    } catch (err) {
      setError('Failed to load analytics');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="analytics-container">Loading analytics...</div>;
  }

  if (error) {
    return <div className="analytics-container error-message">{error}</div>;
  }

  if (!analytics) {
    return <div className="analytics-container">No analytics data available</div>;
  }

  const participationDates = Object.keys(analytics.participationPerDay || {}).sort();

  return (
    <div className="analytics-container">
      <h2>Event Analytics</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-label">Total Visitors</div>
            <div className="stat-value">{analytics.totalClicks || 0}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎤</div>
          <div className="stat-content">
            <div className="stat-label">Practice Attempts</div>
            <div className="stat-value">{analytics.totalAttempts || 0}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-label">Recordings Submitted</div>
            <div className="stat-value">{analytics.totalRecordings || 0}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🤖</div>
          <div className="stat-content">
            <div className="stat-label">AI Feedback Requests</div>
            <div className="stat-value">{analytics.totalAIRequests || 0}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <div className="stat-label">AI Feedback Completed</div>
            <div className="stat-value">{analytics.totalAICompletions || 0}</div>
          </div>
        </div>
      </div>

      <div className="current-week">
        <h3>Current Week Activity</h3>
        <div className="week-stats">
          <div className="week-stat">
            <span className="week-label">Clicks</span>
            <span className="week-value">{analytics.currentWeekStats?.clicks || 0}</span>
          </div>
          <div className="week-stat">
            <span className="week-label">Attempts</span>
            <span className="week-value">{analytics.currentWeekStats?.attempts || 0}</span>
          </div>
          <div className="week-stat">
            <span className="week-label">Recordings</span>
            <span className="week-value">{analytics.currentWeekStats?.recordings || 0}</span>
          </div>
          <div className="week-stat">
            <span className="week-label">AI Requests</span>
            <span className="week-value">{analytics.currentWeekStats?.aiRequests || 0}</span>
          </div>
        </div>
      </div>

      {participationDates.length > 0 && (
        <div className="daily-participation">
          <h3>Daily Participation</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Visitors</th>
                <th>Practice Attempts</th>
                <th>Recordings</th>
              </tr>
            </thead>
            <tbody>
              {participationDates.map(date => {
                const data = analytics.participationPerDay[date];
                return (
                  <tr key={date}>
                    <td>{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td>{data.clicks}</td>
                    <td>{data.attempts}</td>
                    <td>{data.recordings}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <button className="refresh-btn" onClick={fetchAnalytics}>
        🔄 Refresh Analytics
      </button>
    </div>
  );
}

export default AnalyticsDashboard;
