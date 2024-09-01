const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Scan = sequelize.define('Scan', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
    },
    tag: {
        type: DataTypes.STRING,
        allowNull: false
    },
    readAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deviceInfo: {
        type: DataTypes.JSON,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = Scan;
