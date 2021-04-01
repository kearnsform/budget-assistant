const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const setup = require('../controllers/setup');

router.get('/', catchAsync(setup.index));


module.exports = router;