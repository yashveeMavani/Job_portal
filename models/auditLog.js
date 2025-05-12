"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AuditLog extends Model {}
  AuditLog.init(
    {
      adminId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      endpoint: DataTypes.STRING,
      method: DataTypes.STRING,
      requestData: DataTypes.JSON,
      responseData: DataTypes.JSON,
      statusCode: DataTypes.INTEGER,
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "AuditLog",
    }
  );
  return AuditLog;
};
