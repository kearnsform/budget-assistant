const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { accountSchema } = require('./../schemas.js');
const accounts = require('../controllers/accounts');

const validateAccount = (req, res, next) => {
    const { error } = accountSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/new', accounts.renderNewForm);

router.post('/', validateAccount, catchAsync(accounts.createNewAccount));

router.get('/:id/edit', catchAsync(accounts.renderEditForm));

router.patch('/:id', validateAccount, catchAsync(accounts.updateAccount));

module.exports = router;