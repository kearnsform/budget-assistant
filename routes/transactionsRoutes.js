const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { transactionSchema } = require('./../schemas.js');
const transactions = require('../controllers/transactions');
const { isLoggedIn } = require('../middleware');

const validateTransaction = (req, res, next) => {
    const { error } = transactionSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.route('/')
    .get(isLoggedIn, catchAsync(transactions.index))
    .post(isLoggedIn, validateTransaction, catchAsync(transactions.createTransaction));

router.get('/new', isLoggedIn, catchAsync(transactions.renderNewForm));

router.get('/:id/edit', isLoggedIn, catchAsync(transactions.renderEditForm));

router.route('/:id')
    .patch(isLoggedIn, validateTransaction, catchAsync(transactions.updateTransaction))
    .delete(isLoggedIn, catchAsync(transactions.deleteTransaction));

module.exports = router;