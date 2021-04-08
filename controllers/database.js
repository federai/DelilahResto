const Sequelize = require('sequelize');

const databaseName = 'delilah_resto';
const databaseUsername = 'root';
const databasePassword = '';

const sequelize = new Sequelize(databaseName, databaseUsername, databasePassword, {
    host: 'localhost',
    port: '3306',
    dialect: 'mysql',
    logging: false
});

async function checkConnection() {
    await sequelize.authenticate();
}

exports.checkConnection = checkConnection;
exports.connection = sequelize;