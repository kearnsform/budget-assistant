const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const BudgetItem = require('../models/budgetItem');
const ExpressError = require('../utils/ExpressError');
const { budgetItemSchema } = require('./../schemas.js');
const budgetDao = require('../db/BudgetDao');


const validateBudgetItem = (req, res, next) => {
    const { error } = budgetItemSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async(req, res) => {
    const budget = await budgetDao.getBudget();
    res.render('budget/index', { budget });
}));

router.get('/new', (req, res) => {
    res.render('budget/new', {});
})

router.post('/', validateBudgetItem, catchAsync(async(req, res) => {
    const budgetItem = new BudgetItem(req.body.budgetItem);
    await budgetItem.save();
    res.redirect('/budget');
}))

router.get('/:id/edit', catchAsync(async(req, res) => {
    const { id } = req.params;
    const budgetItem = await BudgetItem.findById(id);
    res.render('budget/edit', { budgetItem });
}))

router.patch('/:id', validateBudgetItem, catchAsync(async(req, res) => {
    const { id } = req.params;
    await BudgetItem.findByIdAndUpdate(id, req.body.budgetItem, { runValidators: true, new: true });
    res.redirect('/budget');
}))

module.exports = router;