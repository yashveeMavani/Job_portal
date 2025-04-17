
const express = require('express');
const router = express.Router();
const { Application, Job, User } = require('../models');
const { verifyToken, checkRole } = require('../middleware/roleMiddleware');
const { applyForJob } = require('../controllers/applicationController'); // Import applyForJob

router.post('/jobs/:id/apply', verifyToken, checkRole(['job_seeker']), applyForJob);

router.get('/employer/applications', verifyToken, checkRole(['employer']), async (req, res) => {
  try {
    const employerId = req.user.id;
    const jobs = await Job.findAll({ where: { employerId } });
    const jobIds = jobs.map(job => job.id);

    const applications = await Application.findAll({
      where: { jobId: jobIds },
      include: [
        { model: Job },
        { model: User, as: 'User' }
      ]
    });

    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});


router.patch('/applications/:id/status', verifyToken, checkRole(['employer']), async (req, res) => {
  const { status } = req.body;
  try {
    const app = await Application.findByPk(req.params.id);
    if (!app) return res.status(404).json({ error: 'Application not found' });

    await app.update({ status });
    res.json({ message: 'Status updated', app });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating status' });
  }
});


router.post('/applications/:id/schedule', verifyToken, checkRole(['employer']), async (req, res) => {
  const { interviewDate } = req.body;
  try {
    const app = await Application.findByPk(req.params.id);
    if (!app) return res.status(404).json({ error: 'Application not found' });

    await app.update({ status: 'interview scheduled', interviewDate });
    res.json({ message: 'Interview scheduled', app });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error scheduling interview' });
  }
});

module.exports = router;