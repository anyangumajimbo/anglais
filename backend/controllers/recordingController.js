const mongoose = require('mongoose');
const Analytics = require('../models/Analytics');
const AIService = require('../services/aiService');
const fs = require('fs');
const path = require('path');

// Submit recording
exports.submitRecording = async (req, res) => {
  try {
    const { audioData, wantsFeedback, hasConsent, sessionId, sessionDate, expectedText } = req.body;

    // Track recording submission
    await Analytics.create({
      eventType: 'recording_submit',
      sessionDate: sessionDate ? new Date(sessionDate) : null
    });

    // Track attempt
    await Analytics.create({
      eventType: 'attempt',
      sessionDate: sessionDate ? new Date(sessionDate) : null
    });

    if (!audioData) {
      return res.status(400).json({
        success: false,
        message: 'Please record your voice before submitting.'
      });
    }

    if (wantsFeedback && !hasConsent) {
      return res.status(400).json({
        success: false,
        message: 'You must give consent to receive AI feedback.'
      });
    }

    if (!wantsFeedback) {
      return res.json({
        success: true,
        message: 'Thank you for taking part in today\'s session. Please check tomorrow for tomorrow\'s session.',
        feedback: null
      });
    }

    // Process with AI feedback
    try {
      // Track AI request
      await Analytics.create({
        eventType: 'ai_requested',
        sessionDate: sessionDate ? new Date(sessionDate) : null
      });

      console.log('Processing recording with AI feedback...');

      // Decode base64 audio
      const audioBuffer = Buffer.from(audioData.replace(/^data:audio\/\w+;base64,/, ''), 'base64');
      
      console.log('Audio buffer size:', audioBuffer.length, 'bytes');

      // Transcribe with Whisper API
      console.log('Calling AIService.transcribeAudio()...');
      const transcriptionResult = await AIService.transcribeAudio(audioBuffer, 'english');
      const userText = transcriptionResult.transcript;

      console.log('Transcription received:', userText);

      // Generate feedback (without calling GPT)
      console.log('Generating feedback...');
      const feedback = await AIService.generateFeedback(
        expectedText || 'No text provided',
        userText,
        10 // Default duration in seconds
      );

      // Track AI completion
      await Analytics.create({
        eventType: 'ai_completed',
        sessionDate: sessionDate ? new Date(sessionDate) : null
      });

      console.log('Feedback generated successfully');

      return res.json({
        success: true,
        message: 'Feedback generated successfully',
        feedback,
        transcription: userText
      });
    } catch (aiError) {
      console.error('AI processing error:', aiError);
      
      // Return the detailed error message
      const errorMessage = aiError instanceof Error ? aiError.message : 'AI feedback is currently unavailable. Please try again later.';
      
      return res.status(500).json({
        success: false,
        message: errorMessage,
        error: aiError instanceof Error ? aiError.message : String(aiError)
      });
    }
  } catch (error) {
    console.error('Error submitting recording:', error);
    // Client error: invalid input (validation or cast error)
    if (error instanceof mongoose.ValidationError || error instanceof mongoose.CastError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input: ' + (error instanceof Error ? error.message : String(error)),
        error: error instanceof Error ? error.message : String(error)
      });
    }
    // Server error: unexpected failure
    res.status(500).json({
      success: false,
      message: 'Error processing recording',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};
