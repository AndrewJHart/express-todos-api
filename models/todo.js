'use strict';
const { Model } = require('sequelize');

/**
 * Todos model
 *
 * @param sequelize
 * @param DataTypes
 * @return {Object} TodoModel
 */
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Model.belongsTo(models.User, {
      //   foreignKey: 'id',
      //   onDelete: 'CASCADE'
      // })
    }
  }

  Todo.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    rank: {
      type: DataTypes.ENUM('low', 'mid', 'high'),
      defaultValue: 'low'
    }
  }, {
    sequelize,
    modelName: 'Todo',
  });

  Todo.associate = (models) => {
    Todo.belongsTo(models.User, {
      foreignKey: 'user',
      onDelete: 'CASCADE',
    });
  };

  return Todo;
};
