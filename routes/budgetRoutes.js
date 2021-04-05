const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { budgetItemSchema } = require('./../schemas.js');
const budget = require('../controllers/budget');
const { isLoggedIn } = require('../middleware');


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
    .get(isLoggedIn, catchAsync(budget.index))
    .post(isLoggedIn, validateBudgetItem, catchAsync(budget.createNewBudgetItem));

router.get('/new', isLoggedIn, catchAsync(budget.renderNewForm));

router.get('/:id/edit', isLoggedIn, catchAsync(budget.renderEditForm));

router.route('/:id')
    .patch(isLoggedIn, validateBudgetItem, catchAsync(budget.updateBudgetItem))
    .delete(isLoggedIn, catchAsync(budget.deleteBudgetItem));


module.exports = router;