"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("AuditLogs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      adminId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      endpoint: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      method: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      requestData: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      responseData: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      statusCode: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      timestamp: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.addIndex("AuditLogs", ["adminId"]);
    await queryInterface.addIndex("AuditLogs", ["userId"]);
    await queryInterface.addIndex("AuditLogs", ["timestamp"]);
  },
};
