const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    active: {
        type: Boolean,
        default: false
    }
})

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;