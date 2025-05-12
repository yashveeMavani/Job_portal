"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Setting extends Model {}
  Setting.init(
    {
      key: DataTypes.STRING,
      value: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Setting",
    }
  );
  return Setting;
};
