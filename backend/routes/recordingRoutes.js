const express = require('express');
const router = express.Router();
const recordingController = require('../controllers/recordingController');

router.post('/submit', recordingController.submitRecording);

module.exports = router;
