const Session = require('../models/Session');
const Analytics = require('../models/Analytics');

// Get session for today
exports.getSessionForToday = async (req, res) => {
  try {
    // Track click event
    await Analytics.create({ eventType: 'click' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const session = await Session.findOne({
      date: { $gte: today, $lt: tomorrow },
      isActive: true
    });

    const currentDate = new Date();
    const eventStart = new Date('2026-03-20');
    const eventEnd = new Date('2026-03-27');

    if (currentDate < eventStart) {
      return res.json({
        success: true,
        session: null,
        message: 'The sessions will begin soon.'
      });
    }

    if (currentDate > eventEnd) {
      return res.json({
        success: true,
        session: null,
        message: 'The Semaine des Langues sessions have ended. Thank you for participating.'
      });
    }

    if (!session) {
      return res.json({
        success: true,
        session: null,
        message: 'No session is available for today. Please check back later.'
      });
    }

    res.json({
      success: true,
      session: {
        id: session._id,
        title: session.title,
        date: session.date,
        scriptText: session.scriptText,
        referenceAudioUrl: session.referenceAudioUrl
      }
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching session',
      error: error.message
    });
  }
};

// Get session by date (admin preview)
exports.getSessionByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);
    
    const nextDate = new Date(queryDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const session = await Session.findOne({
      date: { $gte: queryDate, $lt: nextDate }
    });

    if (!session) {
      return res.json({
        success: true,
        session: null
      });
    }

    res.json({
      success: true,
      session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching session',
      error: error.message
    });
  }
};
