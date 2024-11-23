'use strict';

module.exports = (sequelize, DataTypes) => {
    const Service = sequelize.define('Service', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
    return Service;
};
