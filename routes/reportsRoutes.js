const express = require('express');
const router = express.Router();
const functions = require('./../functions.js');
const catchAsync = require('../utils/catchAsync');
const transactionDao = require('../db/TransactionDao');
const TransactionFilter = require('../db/TransactionFilter');



router.get('/', catchAsync(async(req, res) => {
    const groupingColumn = req.query.groupingColumn;
    let groupings = [];
    if (groupingColumn) {
        const transactions = await transactionDao.getTransactions(new TransactionFilter(req));
        groupings = transactions.groupBy(groupingColumn);
        groupings.push({ key: 'Total', amount: transactions.total() });
    }
    res.render('reports/index', { groupings, reportName: req.query.reportName, groupingColumn: functions.capitalizeFirst(groupingColumn) });
}));

module.exports = router;