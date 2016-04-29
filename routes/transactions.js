'use strict';

var express = require('express');
var router = express.Router();

var Transaction = require('../models/transaction');

router.route('/').get((req, res) => {
    Transaction.getTransactions((err, transactions) => {
        if (err) return res.status(400).send(err);

        res.send(transactions);
    });
}).post((req, res) => {
    Transaction.createTransaction(req.body, (err, newTransaction) => {
        if (err) return res.status(400).send(err);

        res.send(newTransaction);
    });
});

router.get('/totalcredits', (req, res) => {
    Transaction.getTotalCredits((err, totalCredits) => {
        if (err) return res.status(400).send(err);

        res.send(totalCredits);
    });
});

router.get('/totaldebits', (req, res) => {
    Transaction.getTotalDebits((err, totalDebits) => {
        if (err) return res.status(400).send(err);

        res.send(totalDebits);
    });
});

router.route('/:id').get((req, res) => {
    var id = req.params.id;

    Transaction.getTransactionById(id, (err, transaction) => {
        if (err || !transaction) {
            return res.status(400).send(err || 'Transaction not found.');
        }

        res.send(transaction);
    });
}).put((req, res) => {
    var id = req.params.id;

    Transaction.updateTransactionById(id, req.body, err => {
        res.send();
    });
}).delete((req, res) => {
    var id = req.params.id;

    Transaction.removeTransactionById(id, err => {
        if (err) return res.status(400).send(err);

        res.send();
    });
});

module.exports = router;