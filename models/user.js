'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
    User.hasOne(models.JobSeekerProfile, { foreignKey: 'userId' });
    User.hasOne(models.EmployerProfile, { foreignKey: 'userId' });

  }}
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.ENUM('job_seeker', 'employer', 'admin', 'hr'),
    phone: DataTypes.STRING,
    is_verified: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
