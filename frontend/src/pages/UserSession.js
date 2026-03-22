import React, { useState, useEffect, useRef } from 'react';
import { getSessionToday, uploadRecording } from '../services/api';
import AudioRecorder from '../components/AudioRecorder';
import '../styles/UserSession.css';

function UserSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recording, setRecording] = useState(null);
  const [wantsFeedback, setWantsFeedback] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [transcription, setTranscription] = useState(null);
  const [message, setMessage] = useState(null);
  const [playbackUrl, setPlaybackUrl] = useState(null);
  const [fontSize, setFontSize] = useState(18); // Default font size in pixels
  const audioRef = useRef(null);

  useEffect(() => {
    fetchSession();
  }, []);

  const fetchSession = async () => {
    try {
      setLoading(true);
      const response = await getSessionToday();
      setSession(response.data.session);
      if (!response.data.session) {
        setMessage(response.data.message);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load session. Please try again later.');
      console.error('Error fetching session:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordingComplete = (audioBlob) => {
    setRecording(audioBlob);
  };

  const handleSubmit = async () => {
    if (!recording) {
      setError('Please record your voice before submitting.');
      return;
    }

    if (wantsFeedback && !hasConsent) {
      setError('You must give consent to receive AI feedback.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('audio', recording, 'recording.wav');
      formData.append('wantsFeedback', wantsFeedback);
      formData.append('hasConsent', hasConsent);
      formData.append('sessionId', session?._id);
      formData.append('sessionDate', session?.date);
      formData.append('expectedText', session?.scriptText);

      const response = await uploadRecording(recording, formData);

      if (response.data.success) {
        setFeedback(response.data.feedback);
        setTranscription(response.data.transcription);
        setMessage(response.data.message);
        // Set the playback URL so user can hear their uploaded recording
        if (response.data.audioUrl) {
          const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
          setPlaybackUrl(`${baseUrl}${response.data.audioUrl}`);
        }
        setRecording(null);
      } else if (response.data.audioUrl) {
        // Even if AI processing failed, show the audio URL for playback
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        setPlaybackUrl(`${baseUrl}${response.data.audioUrl}`);
        setError(response.data.message || 'Feedback could not be generated, but your recording was saved.');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error submitting recording. Please try again.';
      setError(errorMessage);
      console.error('Error submitting recording:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="user-session">
        <div className="loading-spinner">Loading session...</div>
      </div>
    );
  }

  if (!session && !message) {
    return (
      <div className="user-session">
        <div className="error-message">Failed to load session. Please refresh.</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="user-session">
        <div className="session-container">
          <div className="no-session">
            <h1>Semaine des Langues</h1>
            <p>{message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-session">
      <div className="session-container">
        <header className="session-header">
          <h1>Semaine des Langues</h1>
          <p className="subtitle">English Speaking Practice</p>
        </header>

        <div className="session-content">
          <div className="session-info">
            <h2>{session.title}</h2>
            <p className="session-date">
              {new Date(session.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {session.referenceAudioUrl && (
            <div className="reference-audio">
              <h3>📢 Listen to Reference Audio</h3>
              <audio
                ref={audioRef}
                controls
                src={`http://localhost:5000${session.referenceAudioUrl}`}
              >
                Your browser does not support the audio element.
              </audio>
              <p className="audio-note">Listen carefully to the pronunciation before recording.</p>
            </div>
          )}

          <div className="script-section">
            <div className="script-header">
              <h3>📖 Read This Text</h3>
              <div className="font-size-controls">
                <button 
                  className="font-btn font-minus"
                  onClick={() => setFontSize(prev => Math.max(12, prev - 2))}
                  title="Decrease font size"
                >
                  −
                </button>
                <span className="font-size-display">{fontSize}px</span>
                <button 
                  className="font-btn font-plus"
                  onClick={() => setFontSize(prev => Math.min(36, prev + 2))}
                  title="Increase font size"
                >
                  +
                </button>
              </div>
            </div>
            <div className="script-text" style={{ fontSize: `${fontSize}px` }}>
              {session.scriptText}
            </div>
          </div>

          <AudioRecorder onRecordingComplete={handleRecordingComplete} playbackUrl={playbackUrl} />

          {recording && !playbackUrl && (
            <div className="recorded-message">
              ✓ Recording captured. Ready to submit!
            </div>
          )}

          <div className="feedback-options">
            <label className="feedback-toggle">
              <input
                type="checkbox"
                checked={wantsFeedback}
                onChange={(e) => setWantsFeedback(e.target.checked)}
              />
              <span>I want AI feedback on my reading</span>
            </label>

            {wantsFeedback && (
              <div className="consent-section">
                <label className="consent-checkbox">
                  <input
                    type="checkbox"
                    checked={hasConsent}
                    onChange={(e) => setHasConsent(e.target.checked)}
                  />
                  <span>
                    I consent to provide my audio for AI analysis. My data will not be stored or shared.
                  </span>
                </label>
              </div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          {feedback && (
            <div className="feedback-section">
              <h3>Your AI Feedback 🎯</h3>
              <div className="scores">
                <div className="score-item">
                  <div className="score-label">Overall Score</div>
                  <div className="score-value">{feedback.overallScore}</div>
                </div>
                <div className="score-item">
                  <div className="score-label">Pronunciation</div>
                  <div className="score-value">{feedback.pronunciationScore}</div>
                </div>
                <div className="score-item">
                  <div className="score-label">Fluency</div>
                  <div className="score-value">{feedback.fluencyScore}</div>
                </div>
                <div className="score-item">
                  <div className="score-label">Accuracy</div>
                  <div className="score-value">{feedback.accuracyScore}</div>
                </div>
              </div>

              {transcription && (
                <div className="transcription-section">
                  <h4>What was heard 👂</h4>
                  <p className="transcription-text">{transcription}</p>
                </div>
              )}

              <div className="comments">
                <h4>Comments</h4>
                {feedback.comments && feedback.comments.map((comment, index) => (
                  <p key={index} className="comment">
                    {index + 1}. {comment}
                  </p>
                ))}
              </div>

              <button className="new-session-btn" onClick={() => window.location.reload()}>
                Check Back Tomorrow
              </button>
            </div>
          )}

          {!feedback && (
            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={submitting || !recording}
            >
              {submitting ? 'Processing...' : 'Submit Recording'}
            </button>
          )}
        </div>

        <footer className="session-footer">
          <p><a href="/admin/login">Admin Access</a></p>
        </footer>
      </div>
    </div>
  );
}

export default UserSession;
