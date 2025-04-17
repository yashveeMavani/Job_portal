'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Jobs', 'views', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
    await queryInterface.addColumn('Jobs', 'applicationsCount', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Jobs', 'views');
    await queryInterface.removeColumn('Jobs', 'applicationsCount');
  }
};