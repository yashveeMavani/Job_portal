const express = require('express');
const router = express.Router();
const { getJobAnalytics, getUserAnalytics, getApplicationAnalytics } = require('../controllers/analyticsController');
const { verifyToken, checkRole } = require('../middleware/roleMiddleware');

// Admin-only routes
router.get('/jobs', verifyToken, checkRole(['admin']), getJobAnalytics);
router.get('/users', verifyToken, checkRole(['admin']), getUserAnalytics);
router.get('/applications', verifyToken, checkRole(['admin']), getApplicationAnalytics);

module.exports = router;
