'use strict';

var app = angular.module('myApp');

app.service('Transaction', function($http) {
    this.getAll = () => {
        return $http.get('/api/transactions');
    };

    this.getTotalCredits = () => {
        return $http.get('/api/transactions/totalcredits');
    };
    
    this.getTotalDebits = () => {
        return $http.get('/api/transactions/totaldebits');
    };
    
    this.create = transaction => {
        if (!transaction.credit) {
            transaction.credit = 0;
        } else {
            transaction.debit = 0;
        }

        return $http.post('/api/transactions', transaction);
    };
    
    this.remove = id => {
        return $http.delete(`/api/transactions/${id}`);
    };
    
    this.update = transaction => {
        return $http.put(`/api/transactions/${transaction.id}`, transaction);
    };
});