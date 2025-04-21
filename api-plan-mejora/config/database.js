// config/database.js
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'AndersonMora06',
    password: 'AndersonMora1025521323',
    database: 'trabajo guia',
    waitForConnections: true,
    connectionLimit: 10,  
    queueLimit: 0
});

module.exports = pool.promise();