const mongoose = require('mongoose');
const categoryDao = require('../db/CategoryDao');

const budgetItemSchema = new mongoose.Schema({
    category: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: async function(value) {
                return (await categoryDao.getCategories()).map((category) => { return category.name }).includes(value);
            },
            message: props => `${props.value} is not valid`
        }
    },
    amount: {
        type: Number,
        required: true
    }
})

const BudgetItem = mongoose.model('BudgetItem', budgetItemSchema);

module.exports = BudgetItem;