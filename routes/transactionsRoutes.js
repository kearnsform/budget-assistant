const express = require('express');
const router = express.Router();
const functions = require('./../functions.js');
const Transaction = require('../models/transaction');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { transactionSchema } = require('./../schemas.js');
const transactionDao = require('../db/TransactionDao');
const TransactionFilter = require('../db/TransactionFilter');
const budgetDao = require('../db/BudgetDao');
const Account = require('../models/account');

const validateTransaction = (req, res, next) => {
    const { error } = transactionSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async(req, res) => {
    const filter = new TransactionFilter(req);
    const expiration = new Date(Date.now() + (60 * 60 * 1000)); // filter expires after 1 hour
    res.cookie('filter', filter, { expires: expiration, httpOnly: true });
    const transactions = await transactionDao.getTransactions(filter);
    const categories = await budgetDao.getCategories();
    const accounts = (await Account.find({})).map((account) => { return account.name; });
    res.render('transactions/index', { helpers: functions, transactions: transactions.get(), filter: filter, categories, accounts });
}))

router.get('/new', catchAsync(async(req, res) => {
    const categories = await budgetDao.getCategories();
    const accounts = (await Account.find({})).map((account) => { return account.name; })
    res.render('transactions/new', { categories, accounts });
}))

router.post('/', validateTransaction, catchAsync(async(req, res) => {
    const newTransaction = new Transaction(req.body.transaction);
    await newTransaction.save();
    res.redirect('/transactions');
}))

router.get('/:id/edit', catchAsync(async(req, res) => {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);
    const categories = await budgetDao.getCategories();
    const accounts = (await Account.find({})).map((account) => { return account.name; })
    res.render('transactions/edit', { helpers: functions, transaction, categories, accounts });
}))

router.patch('/:id', validateTransaction, catchAsync(async(req, res) => {
    const { id } = req.params;
    await Transaction.findByIdAndUpdate(id, req.body.transaction, { runValidators: true, new: true });
    res.redirect('/transactions')
}))

router.delete('/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    await Transaction.findByIdAndDelete(id);
    res.redirect('/transactions');
}))

module.exports = router;