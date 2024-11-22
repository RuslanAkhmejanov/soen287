'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ContactMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ContactMessage.init({
    name: DataTypes.STRING(50),
    email: DataTypes.STRING(100),
    message: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'ContactMessage',
  });
  return ContactMessage;
};