'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SavedJob extends Model {
    static associate(models) {
      SavedJob.belongsTo(models.Job, { foreignKey: 'jobId' });
      SavedJob.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  SavedJob.init({
    jobId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'SavedJob',
  });
  return SavedJob;
};