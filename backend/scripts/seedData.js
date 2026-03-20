const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');
const Session = require('../models/Session');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

async function seedData() {
  try {
    // Clear existing data
    await Admin.deleteMany({});
    await Session.deleteMany({});

    // Create default admin
    const admin = new Admin({
      username: 'admin',
      password: 'password123'
    });
    await admin.save();
    console.log('Default admin created - username: admin, password: password123');

    // Create sample sessions for testing
    const sessions = [
      {
        title: 'Morning Reading',
        date: new Date('2026-03-20'),
        scriptText: 'Good morning, everyone! Today we are going to practice English reading together. Please read this text slowly and clearly. Focus on your pronunciation and try to sound natural. This is a great opportunity to improve your speaking skills.',
        referenceAudioUrl: null,
        isActive: true
      },
      {
        title: 'Afternoon Session',
        date: new Date('2026-03-21'),
        scriptText: 'Welcome to the afternoon reading session. In this lesson, we will focus on fluency and natural speech patterns. Remember to take your time and speak with confidence. Pronunciation is important, but don\'t worry about being perfect.',
        referenceAudioUrl: null,
        isActive: true
      },
      {
        title: 'Evening Practice',
        date: new Date('2026-03-22'),
        scriptText: 'This is our evening practice session. We will work on improving your accent and intonation. Please pay attention to the stress patterns in the words. Listen carefully to the reference audio before recording your own voice.',
        referenceAudioUrl: null,
        isActive: true
      },
      {
        title: 'Official Event - Day 1',
        date: new Date('2026-03-23'),
        scriptText: 'Welcome to the Semaine des Langues official event! This is our first official day of the language week. We are excited to hear you practice English. Remember to speak clearly and confidently. Your effort is what matters most.',
        referenceAudioUrl: null,
        isActive: true
      }
    ];

    await Session.insertMany(sessions);
    console.log('Sample sessions created');

    console.log('Seed data completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
