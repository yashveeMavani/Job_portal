"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Job extends Model {
    static associate(models) {
      Job.hasMany(models.Application, {
        foreignKey: "jobId",
        as: "Applications",
      });
    }
  }
  Job.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      location: DataTypes.STRING,
      salary: DataTypes.STRING,
      jobType: DataTypes.STRING,
      industry: DataTypes.STRING,
      requirements: DataTypes.TEXT,
      employerId: DataTypes.INTEGER,
      views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isFlagged: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      applicationsCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Job",
    }
  );
  return Job;
};
