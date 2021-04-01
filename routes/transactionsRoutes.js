const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { transactionSchema } = require('./../schemas.js');
const transactions = require('../controllers/transactions');

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
    .get(catchAsync(transactions.index))
    .post(validateTransaction, catchAsync(transactions.createTransaction));

router.get('/new', catchAsync(transactions.renderNewForm));

router.get('/:id/edit', catchAsync(transactions.renderEditForm));

router.route('/:id')
    .patch(validateTransaction, catchAsync(transactions.updateTransaction))
    .delete(catchAsync(transactions.deleteTransaction));

module.exports = router;