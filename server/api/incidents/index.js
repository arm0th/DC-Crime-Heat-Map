/*jslint node: true */
'use strict';

var express = require('express');
var controller = require('./incidents.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/year/:year', controller.showYear);
router.get('/totals', controller.showTotals);
router.get('/totals/:year', controller.showTotalsForYear);

module.exports = router;
