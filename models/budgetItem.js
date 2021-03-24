const mongoose = require('mongoose');

const budgetItemSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    category: {
        type: String,
        required: true,
        immutable: true
    },
    amount: {
        type: Number,
        required: true
    }
})

const BudgetItem = mongoose.model('BudgetItem', budgetItemSchema);

module.exports = BudgetItem;