const Transaction = require('../models/transaction');
const TransactionArray = require('../db/TransactionArray');

async function getTransactions(filter) {
    const mongoFilter = {};
    if (filter.accounts) {
        mongoFilter.account = { $in: filter.accounts };
    }
    if (filter.startDate && filter.endDate) {
        mongoFilter.date = { $gte: filter.startDate.toIso(), $lte: filter.endDate.toIso() };
    } else if (filter.startDate) {
        mongoFilter.date = { $gte: filter.startDate.toIso() };
    } else if (filter.endDate) {
        mongoFilter.date = { $lte: filter.endDate.toIso() };
    }
    if (filter.notes) {
        mongoFilter.notes = new RegExp(filter.notes);
    }
    if (filter.categories) {
        mongoFilter.category = { $in: filter.categories };
    }

    const transactions = await Transaction.find(mongoFilter);
    return new TransactionArray(transactions);
}

exports.getTransactions = getTransactions;