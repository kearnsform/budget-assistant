const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { categorySchema } = require('./../schemas.js');
const categories = require('../controllers/categories');
const { isLoggedIn } = require('../middleware');

const validateCategory = (req, res, next) => {
    const { error } = categorySchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/new', isLoggedIn, categories.renderNewForm);

router.post('/', isLoggedIn, validateCategory, catchAsync(categories.createCategory));

router.get('/:id/edit', isLoggedIn, catchAsync(categories.renderEditForm));

router.patch('/:id', isLoggedIn, validateCategory, catchAsync(categories.updateCategory));

module.exports = router;