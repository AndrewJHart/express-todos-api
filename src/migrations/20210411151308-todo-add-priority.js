'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn(
          'Todos',
          'priority',
          {
            type: Sequelize.DataTypes.ENUM(['low', 'medium', 'high']),
            defaultValue: 'low'
          },
      );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
        'Todos',
        'priority'
    );
  }
};
