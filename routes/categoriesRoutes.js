const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Category = require('../models/category');
const ExpressError = require('../utils/ExpressError');
const { categorySchema } = require('./../schemas.js');

const validateCategory = (req, res, next) => {
    const { error } = categorySchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/new', (req, res) => {
    res.render('categories/new', {});
})

router.post('/', validateCategory, catchAsync(async(req, res) => {
    const category = new Category(req.body.category);
    await category.save();
    res.redirect('/setup');
}))

router.get('/:id/edit', catchAsync(async(req, res) => {
    const { id } = req.params;
    const category = await Category.findById(id);
    res.render('categories/edit', { category });
}))

router.patch('/:id', validateCategory, catchAsync(async(req, res) => {
    const { id } = req.params;
    await Category.findByIdAndUpdate(id, req.body.category, { runValidators: true, new: true });
    res.redirect('/setup');
}))

module.exports = router;