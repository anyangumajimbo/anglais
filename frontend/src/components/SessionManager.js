import React, { useState, useEffect } from 'react';
import { getAdminSessions, createSession, updateSession, uploadAudio } from '../services/api';
import '../styles/SessionManager.css';

function SessionManager() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    scriptText: '',
    isActive: true
  });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await getAdminSessions();
      setSessions(response.data.sessions || []);
      setError('');
    } catch (err) {
      setError('Failed to load sessions');
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.scriptText) {
      setError('All fields are required');
      return;
    }

    try {
      setError('');
      if (editingId) {
        await updateSession(editingId, formData);
      } else {
        await createSession(formData);
      }
      fetchSessions();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        title: '',
        date: '',
        scriptText: '',
        isActive: true
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving session');
    }
  };

  const handleEdit = (session) => {
    setEditingId(session._id);
    setFormData({
      title: session.title,
      date: new Date(session.date).toISOString().split('T')[0],
      scriptText: session.scriptText,
      isActive: session.isActive
    });
    setShowForm(true);
  };

  const handleAudioUpload = async (e, sessionId) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadingId(sessionId);
      setError('');

      const formDataObj = new FormData();
      formDataObj.append('audio', file);

      await uploadAudio(sessionId, formDataObj);
      fetchSessions();
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading audio');
    } finally {
      setUploading(false);
      setUploadingId(null);
    }
  };

  const cancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      title: '',
      date: '',
      scriptText: '',
      isActive: true
    });
  };

  if (loading) {
    return <div className="sessions-container">Loading sessions...</div>;
  }

  return (
    <div className="sessions-container">
      <div className="sessions-header">
        <h2>Session Management</h2>
        <button
          className="add-session-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancel' : '+ New Session'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="session-form">
          <h3>{editingId ? 'Edit Session' : 'Create New Session'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Session Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                placeholder="e.g., Morning Reading"
              />
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleFormChange('date', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Script Text</label>
              <textarea
                value={formData.scriptText}
                onChange={(e) => handleFormChange('scriptText', e.target.value)}
                placeholder="Enter the text students will read"
                rows="6"
              />
            </div>

            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleFormChange('isActive', e.target.checked)}
                />
                <span>Active</span>
              </label>
            </div>

            <div className="form-buttons">
              <button type="submit" className="save-btn">
                {editingId ? 'Update Session' : 'Create Session'}
              </button>
              <button type="button" className="cancel-btn" onClick={cancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="sessions-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Script</th>
              <th>Audio</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-sessions">No sessions yet</td>
              </tr>
            ) : (
              sessions.map(session => (
                <tr key={session._id}>
                  <td>
                    {new Date(session.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                  <td>{session.title}</td>
                  <td className="script-preview">
                    {session.scriptText.substring(0, 30)}...
                  </td>
                  <td className="audio-status">
                    {session.referenceAudioUrl ? '✓' : '✕'}
                  </td>
                  <td>
                    <span className={`status ${session.isActive ? 'active' : 'inactive'}`}>
                      {session.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(session)}
                    >
                      Edit
                    </button>
                    <label className="upload-btn">
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => handleAudioUpload(e, session._id)}
                        disabled={uploading && uploadingId === session._id}
                        style={{ display: 'none' }}
                      />
                      {uploading && uploadingId === session._id ? 'Uploading...' : 'Audio'}
                    </label>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SessionManager;
