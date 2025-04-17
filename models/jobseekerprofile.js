'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JobSeekerProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      JobSeekerProfile.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  JobSeekerProfile.init({
    userId: DataTypes.INTEGER,
    fullName: DataTypes.STRING,
    dob: DataTypes.DATE,
    gender: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.TEXT,
    resume: DataTypes.STRING,
    skills: DataTypes.TEXT,
    education: DataTypes.TEXT,
    experience: DataTypes.TEXT,
    certifications: DataTypes.TEXT
        
  }, {
    sequelize,
    modelName: 'JobSeekerProfile',
  });
  return JobSeekerProfile;
};