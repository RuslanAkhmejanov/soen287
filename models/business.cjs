'use strict';

module.exports = (sequelize, DataTypes) => {
  const Business = sequelize.define('Business', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hours: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    staffMembers: {
      type: DataTypes.TEXT, // Store JSON string for staff members
      allowNull: true,
      get() {
        const rawData = this.getDataValue('staffMembers');
        return rawData ? JSON.parse(rawData) : [];
      },
      set(value) {
        this.setDataValue('staffMembers', JSON.stringify(value));
      },
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pictures: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  return Business;
};


