const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const reports = require('../controllers/reports');



router.get('/', catchAsync(reports.index));

module.exports = router;