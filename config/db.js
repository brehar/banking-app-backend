'use strict';

var mysql = require('mysql');

var db = mysql.createConnection(process.env.JAWSDB_URL || {
    host: 'localhost',
    user: 'root',
    password: 'secret',
    database: 'banking'
});

db.connect();

db.query('CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTO_INCREMENT, date TEXT, description TEXT, credit DECIMAL(10,2), debit DECIMAL(10,2), notes TEXT)', function(err) {
    if (err) throw err;
});

module.exports = db;