'use strict';

var express = require('express');
var router = express.Router();

router.use('/transactions', require('./transactions'));

module.exports = router;