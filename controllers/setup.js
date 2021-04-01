const Account = require('../models/account');
const Category = require('../models/category');

module.exports.index = async(req, res) => {
    const accounts = await Account.find({});
    const categories = await Category.find({});
    res.render('setup/index', { accounts, categories });
}