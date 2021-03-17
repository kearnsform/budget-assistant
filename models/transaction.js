const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    accountId: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        enum: ['Groceries & Supplies', 'Travel', 'Home', 'Auto'],
        required: true
    },
    company: {
        type: String
    },
    description: {
        type: String
    },
    amount: {
        type: Number,
        required: true
    },
    clearingDate: {
        type: Date
    }
})

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;