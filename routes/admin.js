const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
const { checkAdmin } = require('../middleware/admin');
const { 
    reportIdRule, 
    updateReportStatusRules, 
    suspendUserRules, 
    userIdRule, 
    validate 
} = require('../middleware/validation');

// --- Report Management ---
router.get(
    '/reports',
    authMiddleware.authenticate,
    checkAdmin,
    reportController.getOpenReports
);

router.patch(
    '/reports/:reportId',
    authMiddleware.authenticate,
    checkAdmin,
    reportIdRule(), // This needs to be a function call
    updateReportStatusRules(),
    validate,
    reportController.updateReportStatus
);

// --- User Management ---
router.post(
    '/users/:userId/suspend',
    authMiddleware.authenticate,
    checkAdmin,
    userIdRule(), // This also needs to be a function call
    suspendUserRules(),
    validate,
    adminController.suspendUser
);

module.exports = router;

