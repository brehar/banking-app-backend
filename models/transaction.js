'use strict';

var db = require('../config/db');

exports.getTransactions = function(cb) {
    db.query('SELECT * FROM transactions', cb);
};

exports.getTransactionById = function(id, cb) {
    db.query(`SELECT * FROM transactions WHERE id = ${id}`, cb);
};

exports.getTotalCredits = function(cb) {
    db.query('SELECT SUM(credit) AS credit_total FROM transactions', cb);
};

exports.getTotalDebits = function(cb) {
    db.query('SELECT SUM(debit) AS debit_total FROM transactions', cb);
};

exports.createTransaction = function(transaction, cb) {
    if (!transaction.date || !transaction.description || (!transaction.credit && !transaction.debit)) {
        return cb('Missing required field(s).');
    }

    db.query(`INSERT INTO transactions (date, description, credit, debit, notes) VALUES ('${transaction.date}', '${transaction.description}', '${transaction.credit}', '${transaction.debit}', '${transaction.notes}')`, (err) => {
        if (err) return cb(err);

        db.query('SELECT * FROM transactions WHERE id = (SELECT MAX(id) FROM transactions)', cb);
    });
};

exports.removeTransactionById = function(id, cb) {
    if (!id) return cb('Transaction id required.');

    db.query(`DELETE FROM transactions WHERE id = ${id}`, function(err) {
        cb(err);
    });
};

exports.updateTransactionById = function(id, newTransaction, cb) {
    if (!id) return cb('Transaction id required.');

    if (!newTransaction.date || !newTransaction.description || (!newTransaction.credit && !newTransaction.debit)) {
        return cb('Missing required field(s).');
    }

    db.query(`UPDATE transactions SET date = '${newTransaction.date}', description = '${newTransaction.description}', credit = '${newTransaction.credit}', debit = '${newTransaction.debit}', notes = '${newTransaction.notes}' WHERE id = ${id}`, cb);
};