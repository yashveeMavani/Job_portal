"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.JobSeekerProfile, { foreignKey: "userId" });
      User.hasOne(models.EmployerProfile, { foreignKey: "userId" });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: {
        type: DataTypes.STRING,
        allowNull: false,

        set(value) {
          if (value && !value.startsWith("$2b$")) {
            const hashedPassword = bcrypt.hashSync(value, 10);
            this.setDataValue("password", hashedPassword);
          } else {
            this.setDataValue("password", value);
          }
        },
      },
      role: DataTypes.ENUM("job_seeker", "employer", "admin", "hr"),
      isBlocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      phone: DataTypes.STRING,
      is_verified: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
