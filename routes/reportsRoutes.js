const express = require('express');
const router = express.Router();
const functions = require('./../functions.js');
const catchAsync = require('../utils/catchAsync');
const transactionDao = require('../db/TransactionDao');
const TransactionFilter = require('../db/TransactionFilter');
const ReportFactory = require('../service/report/ReportFactory.js');



router.get('/', catchAsync(async(req, res) => {
    const groupingColumn = req.query.groupingColumn;
    let groupings = [];
    let reportEntries = [];
    if (groupingColumn) {
        const filter = new TransactionFilter(req);
        const transactions = await transactionDao.getTransactions(filter);
        groupings = await transactions.groupBy(groupingColumn);
        const reportFactory = new ReportFactory(groupings, req.query, filter);
        reportEntries = await reportFactory.build();
    }
    res.render('reports/index', { reportEntries, reportName: req.query.reportName, groupingColumn: functions.capitalizeFirst(groupingColumn) });
}));

module.exports = router;