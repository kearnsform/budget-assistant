const mongoose = require('mongoose');
const categoryDao = require('../db/CategoryDao');
const Account = require('../models/account');

const transactionSchema = new mongoose.Schema({
    account: {
        type: String,
        required: true,
        validate: {
            validator: async function(value) {
                return (await Account.find({})).map((account) => { return account.name; }).includes(value);
            },
            message: props => `${props.value} is not valid`
        }
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
                return (await categoryDao.getCategories()).map((category) => { return category.name }).includes(value);
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