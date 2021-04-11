'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
        'Todos',
        'user',
        {
          type: Sequelize.INTEGER,
          onDelete: 'CASCADE',
          references: {
            model: 'Users',
            key: 'id',
            as: 'userId',
          }
        },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
        'Todos',
        'user'
    );
  }
};
