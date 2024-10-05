import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('patrol', 'admin_patrol', '3h49?4Wwx', {
    host: 'localhost',
    dialect: 'mysql'
});

export default sequelize;
