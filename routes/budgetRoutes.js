const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { budgetItemSchema } = require('./../schemas.js');
const budget = require('../controllers/budget');


const validateBudgetItem = (req, res, next) => {
    const { error } = budgetItemSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.route('/')
    .get(catchAsync(budget.index))
    .post(validateBudgetItem, catchAsync(budget.createNewBudgetItem));

router.get('/new', catchAsync(budget.renderNewForm));

router.get('/:id/edit', catchAsync(budget.renderEditForm));

router.route('/:id')
    .patch(validateBudgetItem, catchAsync(budget.updateBudgetItem))
    .delete(catchAsync(budget.deleteBudgetItem));


module.exports = router;