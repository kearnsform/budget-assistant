const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AllowedUserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('AllowedUser', AllowedUserSchema);