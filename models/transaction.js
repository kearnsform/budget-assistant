const mongoose = require('mongoose');
const budgetDao = require('../db/BudgetDao');

const transactionSchema = new mongoose.Schema({
    account: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        required: true,
        validate: {
            validator: async function(value) {
                return (await budgetDao.getCategories()).includes(value);
            },
            message: props => `${props.value} is not valid`
        }
    },
    company: {
        type: String
    },
    notes: {
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