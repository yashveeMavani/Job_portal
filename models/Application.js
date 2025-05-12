module.exports = (sequelize, DataTypes) => {
    const Application = sequelize.define('Application', {
      status: {
        type: DataTypes.STRING,
        defaultValue: 'applied',
      },
      interviewDate: {
        type: DataTypes.DATE,
        allowNull: true
      }
    });
  
    Application.associate = (models) => {
      Application.belongsTo(models.User, { foreignKey: 'jobSeekerId', as: 'User'});
      Application.belongsTo(models.Job, { foreignKey: 'jobId' , as: 'Job' });
    };
  
    return Application;
  };
  