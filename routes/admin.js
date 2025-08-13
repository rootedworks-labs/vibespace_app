const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/auth');
const { checkAdmin } = require('../middleware/admin');

// This route is protected by both authentication and admin checks
router.get(
    '/reports',
    authMiddleware.authenticate,
    checkAdmin,
    reportController.getOpenReports
);

module.exports = router