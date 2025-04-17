const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/roleMiddleware');

// Only admin can access
router.get('/admin-data', verifyToken, checkRole(['admin']), (req, res) => {
  res.json({ message: 'Welcome Admin!' });
});

// Admin and HR can access
router.get('/hr-data', verifyToken, checkRole(['admin', 'hr']), (req, res) => {
  res.json({ message: 'Welcome HR/Admin!' });
});

module.exports = router;
