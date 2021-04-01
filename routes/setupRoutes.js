const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Account = require('../models/account');
const Category = require('../models/category');

router.get('/', catchAsync(async(req, res) => {
    const accounts = await Account.find({});
    const categories = await Category.find({});
    res.render('setup/index', { accounts, categories });
}));


module.exports = router;