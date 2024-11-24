'use strict';

module.exports = (sequelize, DataTypes) => {
  const Business = sequelize.define('Business', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hours: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    logos: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    backgroundPic: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    staffMembers: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    services: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  });

  return Business;
};



