const functions = require('./../functions.js');
const Transaction = require('../models/transaction');
const transactionDao = require('../db/TransactionDao');
const TransactionFilter = require('../db/TransactionFilter');
const categoryDao = require('../db/CategoryDao');
const Account = require('../models/account');

module.exports.index = async(req, res) => {
    const filter = new TransactionFilter(req);
    const expiration = new Date(Date.now() + (60 * 60 * 1000)); // filter expires after 1 hour
    res.cookie('filter', filter, { expires: expiration, httpOnly: true });
    const transactions = await transactionDao.getTransactions(filter);
    const categories = (await categoryDao.getCategories()).map((category) => { return category.name });
    const accounts = (await Account.find({})).map((account) => { return account.name; });
    res.render('transactions/index', { helpers: functions, transactions: transactions.get(), filter: filter, categories, accounts });
}

module.exports.renderNewForm = async(req, res) => {
    const categories = (await categoryDao.getCategories(true)).map((category) => { return category.name });
    const accounts = (await Account.find({})).map((account) => { return account.name; })
    res.render('transactions/new', { categories, accounts });
}

module.exports.createTransaction = async(req, res) => {
    const newTransaction = new Transaction(req.body.transaction);
    await newTransaction.save();
    res.redirect('/transactions');
}

module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);
    const categories = (await categoryDao.getCategories(true)).map((category) => { return category.name });
    if (!categories.includes(transaction.category)) {
        categories.push(transaction.category);
    }
    const accounts = (await Account.find({})).map((account) => { return account.name; })
    res.render('transactions/edit', { helpers: functions, transaction, categories, accounts });
}

module.exports.updateTransaction = async(req, res) => {
    const { id } = req.params;
    await Transaction.findByIdAndUpdate(id, req.body.transaction, { runValidators: true, new: true });
    res.redirect('/transactions')
}

module.exports.deleteTransaction = async(req, res) => {
    const { id } = req.params;
    await Transaction.findByIdAndDelete(id);
    res.redirect('/transactions');
}