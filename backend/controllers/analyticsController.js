const Analytics = require('../models/Analytics');

exports.trackEvent = async (req, res) => {
  try {
    const { eventType, sessionDate } = req.body;

    const event = new Analytics({
      eventType,
      sessionDate: sessionDate ? new Date(sessionDate) : null
    });

    await event.save();

    res.status(201).json({
      success: true,
      message: 'Event tracked'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error tracking event',
      error: error.message
    });
  }
};
