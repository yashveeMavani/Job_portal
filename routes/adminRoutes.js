const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/roleMiddleware');
const adminController = require('../controllers/adminController');

// User Management
router.get('/users', verifyToken, checkRole(['admin']), adminController.getAllUsers);
router.patch('/users/:id/block', verifyToken, checkRole(['admin']), adminController.blockUser);
router.delete('/users/:id', verifyToken, checkRole(['admin']), adminController.deleteUser);
router.patch('/users/:id/verify', verifyToken, checkRole(['admin']), adminController.verifyUser);

// Job Moderation
router.get('/jobs', verifyToken, checkRole(['admin']), adminController.getAllJobs);
router.patch('/jobs/:id/approve', verifyToken, checkRole(['admin']), adminController.approveJob);
router.patch('/jobs/:id/flag', verifyToken, checkRole(['admin']), adminController.flagJob);
router.delete('/jobs/:id', verifyToken, checkRole(['admin']), adminController.deleteJob);

// System Settings
router.get('/settings', verifyToken, checkRole(['admin']), adminController.getSettings);
router.patch('/settings', verifyToken, checkRole(['admin']), adminController.updateSettings);

module.exports = router;