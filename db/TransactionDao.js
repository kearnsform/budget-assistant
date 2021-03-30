const Transaction = require('../models/transaction');
const TransactionArray = require('../db/TransactionArray');

async function getTransactions(filter) {
    const mongoFilter = {};
    if (filter.accounts) {
        mongoFilter.account = { $in: filter.accounts };
    }
    if (filter.startDate && filter.endDate) {
        mongoFilter.date = { $gte: filter.startDate, $lte: filter.endDate };
    } else if (filter.startDate) {
        mongoFilter.date = { $gte: filter.startDate };
    } else if (filter.endDate) {
        mongoFilter.date = { $lte: filter.endDate };
    }
    if (filter.notes) {
        mongoFilter.description = new RegExp(filter.notes);
    }
    if (filter.categories) {
        mongoFilter.category = { $in: filter.categories };
    }

    const transactions = await Transaction.find(mongoFilter);
    return new TransactionArray(transactions);
}

exports.getTransactions = getTransactions;