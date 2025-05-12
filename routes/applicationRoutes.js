const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const { Application, Job, User } = require("../models");
const { verifyToken, checkRole } = require("../middleware/roleMiddleware");
const { applyForJob } = require("../controllers/applicationController");
const { exportToCSV, exportToExcel } = require("../utils/exporter");
const {
  generateOfferLetter,
  generateJobSummary,
} = require("../utils/pdfGenerator");

router.get(
  "/employer/applications",
  verifyToken,
  checkRole(["employer"]),
  async (req, res) => {
    try {
      const employerId = req.user.id;
      const jobs = await Job.findAll({ where: { employerId } });
      const jobIds = jobs.map((job) => job.id);

      const applications = await Application.findAll({
        where: { jobId: jobIds },
        include: [
          { model: Job, as: "Job" },
          { model: User, as: "User" },
        ],
      });

      res.json(applications);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  }
);
router.get(
  "/applications/export/excel",
  verifyToken,
  checkRole(["employer"]),
  async (req, res) => {
    try {
      const employerId = req.user.id;
      const jobs = await Job.findAll({ where: { employerId } });
      const jobIds = jobs.map((job) => job.id);

      const applications = await Application.findAll({
        where: { jobId: jobIds },
        include: [
          { model: Job, as: "Job" },
          { model: User, as: "User", attributes: ["name"] },
        ],
      });

      const flattenedData = applications.map((app) => ({
        id: app.id,
        jobId: app.jobId,
        jobTitle: app.Job?.title || "N/A",
        userName: app.User?.name || "N/A",
        status: app.status,
        createdAt: app.createdAt.toISOString().split("T")[0],
      }));

      const buffer = await exportToExcel(flattenedData, "Applications");

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=applications.xlsx"
      );
      res.send(buffer);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to export data" });
    }
  }
);
router.get(
  "/jobs/export/stats",
  verifyToken,
  checkRole(["admin"]),
  async (req, res) => {
    try {
      const jobs = await Job.findAll({
        include: [{ model: Application, as: "Applications" }],
      });

      const stats = jobs.map((job) => ({
        jobId: job.id,
        title: job.title,
        totalApplications: job.Applications.length,
      }));

      const fields = ["jobId", "title", "totalApplications"];
      const csv = exportToCSV(stats, fields);

      res.header("Content-Type", "text/csv");
      res.attachment("job_stats.csv");
      res.send(csv);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to export job stats" });
    }
  }
);

router.get(
  "/applications/export/csv",
  verifyToken,
  checkRole(["employer"]),
  async (req, res) => {
    try {
      const employerId = req.user.id;
      const jobs = await Job.findAll({ where: { employerId } });
      const jobIds = jobs.map((job) => job.id);

      const applications = await Application.findAll({
        where: { jobId: jobIds },
        include: [
          { model: Job, as: "Job" },
          { model: User, as: "User" },
        ],
      });

      const flattenedData = applications.map((app) => ({
        id: app.id,
        jobId: app.jobId,
        jobTitle: app.Job?.title || "N/A",
        userName: app.User?.name || "N/A",
        status: app.status,
        createdAt: app.createdAt.toISOString().split("T")[0],
      }));

      const fields = [
        "id",
        "jobId",
        "jobTitle",
        "userName",
        "status",
        "createdAt",
      ];
      const csv = exportToCSV(flattenedData, fields);

      res.header("Content-Type", "text/csv");
      res.attachment("applications.csv");
      res.send(csv);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to export data" });
    }
  }
);
router.get(
  "/jobs/:id/summary",
  verifyToken,
  checkRole(["employer"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const job = await Job.findByPk(id, {
        include: [{ model: Application, as: "Applications" }],
      });

      if (!job) return res.status(404).json({ error: "Job not found" });

      const topSkills = ["JavaScript", "React"];
      const filePath = path.join(__dirname, `../uploads/job_summary_${id}.pdf`);
      generateJobSummary(
        {
          jobTitle: job.title,
          totalApplications: job.Applications.length,
          topSkills,
        },
        filePath
      );

      res.json({ message: "Job summary generated", filePath });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to generate job summary" });
    }
  }
);
router.post(
  "/jobs/:id/apply",
  verifyToken,
  checkRole(["job_seeker"]),
  applyForJob
);

router.patch(
  "/applications/:id/status",
  verifyToken,
  checkRole(["employer"]),
  async (req, res) => {
    const { status } = req.body;
    try {
      const app = await Application.findByPk(req.params.id);
      if (!app) return res.status(404).json({ error: "Application not found" });

      await app.update({ status });
      res.json({ message: "Status updated", app });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error updating status" });
    }
  }
);

router.post(
  "/applications/:id/schedule",
  verifyToken,
  checkRole(["employer"]),
  async (req, res) => {
    const { interviewDate } = req.body;
    try {
      const app = await Application.findByPk(req.params.id);
      if (!app) return res.status(404).json({ error: "Application not found" });

      await app.update({ status: "interview scheduled", interviewDate });
      res.json({ message: "Interview scheduled", app });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error scheduling interview" });
    }
  }
);

router.post(
  "/applications/:id/offer-letter",
  verifyToken,
  checkRole(["employer"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, position, company, startDate, salary } = req.body;

      // Validate request body
      if (!name || !position || !company || !startDate || !salary) {
        return res
          .status(400)
          .json({
            error:
              "All fields (name, position, company, startDate, salary) are required",
          });
      }

      const dirPath = path.join(__dirname, "../uploads/offer_letters");
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      const filePath = path.join(dirPath, `offer_letter_${id}.pdf`);
      generateOfferLetter(
        { name, position, company, startDate, salary },
        filePath
      );

      res.json({ message: "Offer letter generated", filePath });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to generate offer letter" });
    }
  }
);
module.exports = router;
