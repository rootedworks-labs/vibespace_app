const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/auth');
const { createReportRules, validate } = require('../middleware/validation');

router.post(
    '/',
    authMiddleware.authenticate,
    createReportRules(),
    validate,
    reportController.createReport
);

module.exports = router;
