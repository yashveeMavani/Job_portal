const express = require('express');
const router = express.Router();
const { createJob } = require('../controllers/jobController');
const { verifyToken, checkRole } = require('../middleware/roleMiddleware');
const { Job } = require('../models');
const { SavedJob } = require('../models');
const { Op } = require('sequelize');
// Only employers can post jobs
router.post('/jobs', verifyToken, checkRole(['employer']), createJob);


router.get('/jobs', async (req, res) => {
    try {
      const { location, salaryMin, salaryMax, industry, jobType, search } = req.query;
  
      const where = {};
      if (location) where.location = { [Op.like]: `%${location}%` };
      if (industry) where.industry = { [Op.like]: `%${industry}%` };
      if (jobType) where.jobType = { [Op.like]: `%${jobType}%` };
      if (salaryMin && salaryMax) {
        where.salary = { [Op.between]: [salaryMin, salaryMax] };
      }
      if (search) {
        where.title = { [Op.like]: `%${search}%` };
      }
  
      const jobs = await Job.findAll({ where, order: [['createdAt', 'DESC']] });
      res.json(jobs);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.get('/employer/jobs/analytics', verifyToken, checkRole(['employer']), async (req, res) => {
    try {
      const employerId = req.user.id;
  
      // Fetch jobs posted by the employer with analytics data
      const jobs = await Job.findAll({
        where: { employerId },
        attributes: ['id', 'title', 'views', 'applicationsCount'],
      });
  
      res.json(jobs);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  });
  router.get('/jobs/saved', verifyToken, checkRole(['job_seeker']), async (req, res) => {
    try {
      const userId = req.user.id;
  
      const savedJobs = await SavedJob.findAll({
        where: { userId },
        include: [{ model: Job }],
      });
  
      res.json(savedJobs);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  router.post('/jobs/:id/save', verifyToken, checkRole(['job_seeker']), async (req, res) => {
    try {
      const { id: jobId } = req.params;
      const userId = req.user.id;
  
      // Check if the job is already saved
      const existingSavedJob = await SavedJob.findOne({ where: { jobId, userId } });
      if (existingSavedJob) {
        return res.status(400).json({ message: 'Job already saved' });
      }
  
      // Save the job
      const savedJob = await SavedJob.create({ jobId, userId });
      res.status(201).json({ message: 'Job saved successfully', savedJob });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.get('/jobs/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const job = await Job.findByPk(id);
  
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
  
      // Increment the views count
      await job.increment('views');
  
      res.json(job);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  module.exports = router;
