const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('patrol', 'root', 'toor', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
