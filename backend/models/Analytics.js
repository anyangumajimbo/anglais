const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  eventType: {
    type: String,
    enum: ['click', 'attempt', 'recording_submit', 'ai_requested', 'ai_completed'],
    required: true
  },
  sessionDate: {
    type: Date,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Indexes for analytics queries
analyticsSchema.index({ eventType: 1, timestamp: 1 });
analyticsSchema.index({ sessionDate: 1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
