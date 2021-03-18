const Transaction = require('../models/transaction');

async function getTransactions(filter) {
    const mongoFilter = {};
    if (filter.accountId) {
        mongoFilter.accountId = filter.accountId;
    }
    if (filter.startDate && filter.endDate) {
        mongoFilter.date = { $gte: filter.startDate, $lte: filter.endDate };
    } else if (filter.startDate) {
        mongoFilter.date = { $gte: filter.startDate };
    } else if (filter.endDate) {
        mongoFilter.date = { $lte: filter.endDate };
    }
    if (filter.description) {
        mongoFilter.description = new RegExp(filter.description);
    }
    if (filter.categories) {
        mongoFilter.category = { $in: filter.categories };
    }

    const transactions = await Transaction.find(mongoFilter);
    return transactions;
}

exports.getTransactions = getTransactions;