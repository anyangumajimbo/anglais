import React, { useState, useRef } from 'react';
import '../styles/AudioRecorder.css';

function AudioRecorder({ onRecordingComplete, playbackUrl }) {
  const [recording, setRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setRecordedAudio(audioBlob);
        onRecordingComplete(audioBlob);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      setError('Microphone access is required. Please grant permission.');
      console.error('Microphone error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const resetRecording = () => {
    setRecordedAudio(null);
    audioChunksRef.current = [];
    onRecordingComplete(null);
  };

  return (
    <div className="audio-recorder">
      <h3>🎤 Record Your Voice</h3>

      {error && <div className="error-message">{error}</div>}

      {!recordedAudio && !playbackUrl ? (
        <div className="recording-controls">
          {!recording ? (
            <button className="start-btn" onClick={startRecording}>
              Start Recording
            </button>
          ) : (
            <div className="recording-indicator">
              <span className="pulse"></span>
              <span>Recording...</span>
              <button className="stop-btn" onClick={stopRecording}>
                Stop Recording
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="playback-controls">
          <div className="playback-info">
            <p>✓ Recording ready</p>
          </div>
          <div className="button-group">
            {!playbackUrl && (
              <button className="reset-btn" onClick={resetRecording}>
                🔄 Re-record
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AudioRecorder;
