const { Job } = require('../models');

exports.createJob = async (req, res) => {
  try {
    const {
      title, description, location, salary,
      jobType, industry, requirements
    } = req.body;

    const employerId = req.user.id; 

    const job = await Job.create({
      title,
      description,
      location,
      salary,
      jobType,
      industry,
      requirements,
      employerId
    });

    res.status(201).json({ message: 'Job posted successfully', job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to post job' });
  }
};
