const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

// Configure multer for file uploads
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `audio-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Public routes
router.post('/login', adminController.login);

// Protected routes
router.get('/sessions', authMiddleware, adminController.getSessions);
router.post('/sessions', authMiddleware, adminController.createSession);
router.put('/sessions/:id', authMiddleware, adminController.updateSession);
router.post('/sessions/:id/audio', authMiddleware, upload.single('audio'), adminController.uploadAudio);
router.get('/analytics', authMiddleware, adminController.getAnalytics);

module.exports = router;
