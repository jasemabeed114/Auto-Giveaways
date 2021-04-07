const config = require('../config');
const mysql = require('mysql2');
const createConnextion = mysql.createPool({ host: config.mysql.host, port: config.mysql.port, user: config.mysql.user, password: config.mysql.password, database: config.mysql.database, waitForConnections: true, connectionLimit: 1, queueLimit: 0 });

module.exports = createConnextion;