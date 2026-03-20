import React, { useState, useRef } from 'react';
import '../styles/AudioRecorder.css';

function AudioRecorder({ onRecordingComplete }) {
  const [recording, setRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [playingBack, setPlayingBack] = useState(false);
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioPlayRef = useRef(null);

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
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64data = reader.result;
          setRecordedAudio(base64data);
          onRecordingComplete(base64data);
        };

        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
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

  const playRecording = () => {
    if (recordedAudio && audioPlayRef.current) {
      audioPlayRef.current.play();
      setPlayingBack(true);
    }
  };

  const stopPlayback = () => {
    if (audioPlayRef.current) {
      audioPlayRef.current.pause();
      audioPlayRef.current.currentTime = 0;
      setPlayingBack(false);
    }
  };

  const resetRecording = () => {
    setRecordedAudio(null);
    audioChunksRef.current = [];
    setPlayingBack(false);
    onRecordingComplete(null);
  };

  return (
    <div className="audio-recorder">
      <h3>🎤 Record Your Voice</h3>

      {error && <div className="error-message">{error}</div>}

      {!recordedAudio ? (
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
            {!playingBack ? (
              <button className="play-btn" onClick={playRecording}>
                ▶ Play Recording
              </button>
            ) : (
              <button className="pause-btn" onClick={stopPlayback}>
                ⏸ Stop Playback
              </button>
            )}
            <button className="reset-btn" onClick={resetRecording}>
              🔄 Re-record
            </button>
          </div>
          <audio
            ref={audioPlayRef}
            onEnded={() => setPlayingBack(false)}
          />
        </div>
      )}
    </div>
  );
}

export default AudioRecorder;
