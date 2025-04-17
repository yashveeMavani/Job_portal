const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/roleMiddleware');
const employerController = require('../controllers/employerProfileController');

// Only employers can create profile
router.post('/employer-profile', verifyToken, checkRole(['employer']), employerController.createEmployerProfile);

router.get('/employer-profile', verifyToken, checkRole(['employer']), employerController.getEmployerProfile);

module.exports = router;
