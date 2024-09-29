const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('patrol', 'admin_patrol', '3h49?4Wwx', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
