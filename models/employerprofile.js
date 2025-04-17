'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EmployerProfile extends Model {
    static associate(models) {
      EmployerProfile.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  EmployerProfile.init({
    userId: DataTypes.INTEGER,
    company_name: DataTypes.STRING,
    website: DataTypes.STRING,
    industry: DataTypes.STRING,
    company_size: DataTypes.STRING,
    location: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'EmployerProfile',
  });
  return EmployerProfile;
};
