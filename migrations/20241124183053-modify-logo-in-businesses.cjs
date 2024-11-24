'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('Businesses', 'logo', 'logos');
    await queryInterface.changeColumn('Businesses', 'logos', {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('Businesses', 'logos', 'logo');
    await queryInterface.changeColumn('Businesses', 'logo', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
