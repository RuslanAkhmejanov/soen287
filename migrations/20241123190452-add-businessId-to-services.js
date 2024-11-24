'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('Services', 'businessId', {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'Businesses',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('Services', 'businessId');
}