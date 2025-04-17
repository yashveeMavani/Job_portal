module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('JobSeekerProfiles', 'skills', Sequelize.TEXT);
    await queryInterface.addColumn('JobSeekerProfiles', 'education', Sequelize.TEXT);
    await queryInterface.addColumn('JobSeekerProfiles', 'experience', Sequelize.TEXT);
    await queryInterface.addColumn('JobSeekerProfiles', 'certifications', Sequelize.TEXT);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('JobSeekerProfiles', 'skills');
    await queryInterface.removeColumn('JobSeekerProfiles', 'education');
    await queryInterface.removeColumn('JobSeekerProfiles', 'experience');
    await queryInterface.removeColumn('JobSeekerProfiles', 'certifications');
  }
};
