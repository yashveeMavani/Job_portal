const { User, Job, Setting } = require("../models");

// User Management
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.update({ isBlocked: true });
    res.json({ message: "User blocked successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to block user" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.update({ is_verified: true });
    res.json({ message: "User verified successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to verify user" });
  }
};

// Job Moderation
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

exports.approveJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    await job.update({ isApproved: true });
    res.json({ message: "Job approved successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to approve job" });
  }
};

exports.flagJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    await job.update({ isFlagged: true });
    res.json({ message: "Job flagged successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to flag job" });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    await job.destroy();
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete job" });
  }
};

// System Settings
exports.getSettings = async (req, res) => {
  try {
    const settings = await Setting.findAll();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { key, value } = req.body;

    const setting = await Setting.findOne({ where: { key } });
    if (!setting) return res.status(404).json({ error: "Setting not found" });

    await setting.update({ value });
    res.json({ message: "Setting updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update setting" });
  }
};
