const Admin = require('../models/Admin');
const Session = require('../models/Session');
const Analytics = require('../models/Analytics');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Admin login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      admin: { id: admin._id, username: admin.username }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login error',
      error: error.message
    });
  }
};

// Get all sessions
exports.getSessions = async (req, res) => {
  try {
    const sessions = await Session.find().sort({ date: 1 });
    
    res.json({
      success: true,
      sessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sessions',
      error: error.message
    });
  }
};

// Create session
exports.createSession = async (req, res) => {
  try {
    const { title, date, scriptText } = req.body;

    if (!title || !date || !scriptText) {
      return res.status(400).json({
        success: false,
        message: 'Title, date, and script text are required'
      });
    }

    const session = new Session({
      title,
      date: new Date(date),
      scriptText,
      isActive: true
    });

    await session.save();

    res.status(201).json({
      success: true,
      session,
      message: 'Session created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating session',
      error: error.message
    });
  }
};

// Update session
exports.updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, scriptText, isActive } = req.body;

    const session = await Session.findByIdAndUpdate(
      id,
      {
        title,
        date: date ? new Date(date) : undefined,
        scriptText,
        isActive,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      session,
      message: 'Session updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating session',
      error: error.message
    });
  }
};

// Upload audio for session
exports.uploadAudio = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const session = await Session.findById(id);
    if (!session) {
      // Delete uploaded file
      fs.unlinkSync(file.path);
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Remove old audio if exists
    if (session.referenceAudioUrl) {
      const oldPath = path.join(__dirname, '../', session.referenceAudioUrl);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const audioUrl = `/uploads/${file.filename}`;
    session.referenceAudioUrl = audioUrl;
    await session.save();

    res.json({
      success: true,
      session,
      message: 'Audio uploaded successfully'
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: 'Error uploading audio',
      error: error.message
    });
  }
};

// Get analytics dashboard
exports.getAnalytics = async (req, res) => {
  try {
    const allEvents = await Analytics.find();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentEvents = await Analytics.find({ timestamp: { $gte: thirtyDaysAgo } });

    const analytics = {
      totalClicks: allEvents.filter(e => e.eventType === 'click').length,
      totalAttempts: allEvents.filter(e => e.eventType === 'attempt').length,
      totalRecordings: allEvents.filter(e => e.eventType === 'recording_submit').length,
      totalAIRequests: allEvents.filter(e => e.eventType === 'ai_requested').length,
      totalAICompletions: allEvents.filter(e => e.eventType === 'ai_completed').length,
      currentWeekStats: {
        clicks: recentEvents.filter(e => e.eventType === 'click').length,
        attempts: recentEvents.filter(e => e.eventType === 'attempt').length,
        recordings: recentEvents.filter(e => e.eventType === 'recording_submit').length,
        aiRequests: recentEvents.filter(e => e.eventType === 'ai_requested').length,
        aiCompletions: recentEvents.filter(e => e.eventType === 'ai_completed').length
      }
    };

    // Participation per day
    const participationPerDay = {};
    allEvents.forEach(event => {
      const dateKey = new Date(event.timestamp).toISOString().split('T')[0];
      if (!participationPerDay[dateKey]) {
        participationPerDay[dateKey] = { clicks: 0, attempts: 0, recordings: 0 };
      }
      if (event.eventType === 'click') participationPerDay[dateKey].clicks++;
      if (event.eventType === 'attempt') participationPerDay[dateKey].attempts++;
      if (event.eventType === 'recording_submit') participationPerDay[dateKey].recordings++;
    });

    analytics.participationPerDay = participationPerDay;

    res.json({
      success: true,
      analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
};
