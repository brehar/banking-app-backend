'use strict';

var app = angular.module('myApp');

app.controller('mainCtrl', function($scope, Transaction) {
    Transaction.getAll().then(res => {
        $scope.transactions = res.data;
    }).catch(err => {
        console.log('err:', err);
    });

    Transaction.getTotalCredits().then(res => {
        $scope.totalCredits = res.data[0]['credit_total'] || 0;

        return Transaction.getTotalDebits();
    }).then(res => {
        $scope.totalDebits = res.data[0]['debit_total'] || 0;

        $scope.runningTotal = $scope.totalCredits - $scope.totalDebits;
    }).catch(err => {
        console.log('err:', err);
    });
    
    $scope.addTransaction = function() {
        Transaction.create($scope.newTransaction).then(function(res) {
            var transaction = res.data[0];
            $scope.transactions.push(transaction);

            if (transaction.credit) {
                $scope.totalCredits += transaction.credit;
                $scope.runningTotal += transaction.credit;
            } else {
                $scope.totalDebits += transaction.debit;
                $scope.runningTotal -= transaction.debit;
            }

            $scope.newTransaction = {};
        }).catch(err => {
            console.log('err:', err);
        });
    };

    var deletingIndex;
    var deletingAmount;
    var deletingType;
    var removalIndex;

    $scope.confirmDelete = function(transaction) {
        deletingIndex = $scope.transactions.indexOf(transaction);
        deletingAmount = transaction.credit || transaction.debit;
        deletingType = transaction.credit ? 'credit' : 'debit';
        removalIndex = transaction.id;
    };

    $scope.removeTransaction = function() {
        Transaction.remove(removalIndex).then(function() {
            if (deletingType === 'credit') {
                $scope.totalCredits -= deletingAmount;
                $scope.runningTotal -= deletingAmount;
            } else {
                $scope.totalDebits -= deletingAmount;
                $scope.runningTotal += deletingAmount;
            }

            $scope.transactions.splice(deletingIndex, 1);

            $('#deleteModal').modal('hide');
        }).catch(err => {
            console.log('err:', err);
        });
    };

    $scope.sortBy = function(order) {
        if ($scope.sortOrder === order) {
            $scope.sortOrder = `-${order}`;
        } else if ($scope.sortOrder === `-${order}`) {
            $scope.sortOrder = '';
        } else {
            $scope.sortOrder = order;
        }
    };

    var editingIndex;
    var editingAmount;
    var editingType;

    $scope.editTransaction = function(transaction) {
        editingIndex = $scope.transactions.indexOf(transaction);
        editingAmount = transaction.credit || transaction.debit;
        editingType = transaction.credit ? 'credit' : 'debit';
        $scope.transactionToEdit = angular.copy(transaction);
    };

    $scope.saveEdit = function() {
        Transaction.update($scope.transactionToEdit).then(function() {
            $scope.transactions[editingIndex] = $scope.transactionToEdit;

            if (editingType === 'credit') {
                $scope.totalCredits -= editingAmount;
                $scope.runningTotal -= editingAmount;
            } else {
                $scope.totalDebits -= editingAmount;
                $scope.runningTotal += editingAmount;
            }

            if ($scope.transactionToEdit.credit) {
                $scope.totalCredits += $scope.transactionToEdit.credit;
                $scope.runningTotal += $scope.transactionToEdit.credit;
            } else {
                $scope.totalDebits += $scope.transactionToEdit.debit;
                $scope.runningTotal -= $scope.transactionToEdit.debit;
            }

            $scope.transactionToEdit = null;

            $('#editModal').modal('hide');
        });
    };

    $scope.cancelEdit = function() {
        $scope.transactionToEdit = null;
    };
});