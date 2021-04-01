const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { accountSchema } = require('./../schemas.js');
const Account = require('../models/account');

const validateAccount = (req, res, next) => {
    const { error } = accountSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/new', (req, res) => {
    res.render('accounts/new', {});
})

router.post('/', validateAccount, catchAsync(async(req, res) => {
    const account = new Account(req.body.account);
    await account.save();
    res.redirect('/setup');
}))

router.get('/:id/edit', catchAsync(async(req, res) => {
    const { id } = req.params;
    const account = await Account.findById(id);
    res.render('accounts/edit', { account });
}))

router.patch('/:id', validateAccount, catchAsync(async(req, res) => {
    const { id } = req.params;
    await Account.findByIdAndUpdate(id, req.body.account, { runValidators: true, new: true });
    res.redirect('/setup');
}))

module.exports = router;