const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

router.get('/today', sessionController.getSessionForToday);
router.get('/:date', sessionController.getSessionByDate);

module.exports = router;
