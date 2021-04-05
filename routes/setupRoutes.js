const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const setup = require('../controllers/setup');
const { isLoggedIn } = require('../middleware');

router.get('/', isLoggedIn, catchAsync(setup.index));


module.exports = router;