const { Job, User, Application, sequelize } = require("../models");
const { Op } = require("sequelize");

const getDateRange = (filter) => {
  const now = new Date();
  let startDate;

  switch (filter) {
    case "daily":
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case "weekly":
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case "monthly":
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case "yearly":
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      throw new Error("Invalid filter");
  }

  return { startDate, endDate: new Date() };
};

exports.getJobAnalytics = async (req, res) => {
  try {
    const { filter } = req.query;
    const { startDate, endDate } = getDateRange(filter);

    const jobCount = await Job.count({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    res.json({ filter, jobCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch job analytics" });
  }
};

exports.getUserAnalytics = async (req, res) => {
  try {
    const { filter } = req.query;
    const { startDate, endDate } = getDateRange(filter);

    const userTrends = await User.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      where: {
        role: "job_seeker",
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: ["date"],
      order: [["date", "ASC"]],
    });

    res.json({ filter, userTrends });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user analytics" });
  }
};

exports.getApplicationAnalytics = async (req, res) => {
  try {
    const { filter } = req.query;
    const { startDate, endDate } = getDateRange(filter);

    const applicationTrends = await Application.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: ["date"],
      order: [["date", "ASC"]],
    });

    res.json({ filter, applicationTrends });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch application analytics" });
  }
};
