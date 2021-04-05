const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const reports = require('../controllers/reports');
const { isLoggedIn } = require('../middleware');



router.get('/', isLoggedIn, catchAsync(reports.index));

module.exports = router;