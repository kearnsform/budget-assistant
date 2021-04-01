const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { categorySchema } = require('./../schemas.js');
const categories = require('../controllers/categories');

const validateCategory = (req, res, next) => {
    const { error } = categorySchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/new', categories.renderNewForm);

router.post('/', validateCategory, catchAsync(categories.createCategory));

router.get('/:id/edit', catchAsync(categories.renderEditForm));

router.patch('/:id', validateCategory, catchAsync(categories.updateCategory));

module.exports = router;