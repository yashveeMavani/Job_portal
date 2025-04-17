const express = require('express');
const router = express.Router();
const controller = require('../controllers/jobSeekerProfileController');
const upload = require('../middleware/upload');
const { verifyToken, checkRole } = require('../middleware/roleMiddleware');


router.post('/', verifyToken, checkRole(['job_seeker']), upload.single('resume'), controller.createOrUpdateProfile);
router.put('/job-seeker-profile',verifyToken,checkRole(['job_seeker']),upload.single('resume'),controller.updateJobSeekerProfile );
  

module.exports = router;
