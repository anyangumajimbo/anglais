const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.post('/event', analyticsController.trackEvent);

module.exports = router;
