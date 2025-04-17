const { Application, Job } = require('../models'); 

const applyForJob = async (req, res) => {
  try {
    const { id: jobId } = req.params;
    const { resume, coverLetter } = req.body;

    if (req.user.role !== 'job_seeker') {
      return res.status(403).json({ message: 'Only job seekers can apply for jobs' });
    }
    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const application = await Application.create({
      jobId,
      userId: req.user.id,
      resume,
      coverLetter,
    });
    await job.increment('applicationsCount');
    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { applyForJob };