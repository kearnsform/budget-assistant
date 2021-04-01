const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    }
})

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;