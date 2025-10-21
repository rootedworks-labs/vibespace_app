const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { viewUserData, exportUserData } = require('../controllers/dataExportController');

/**
 * @route   GET /api/data/view
 * @desc    Get all data for the authenticated user (for viewing on-site)
 * @access  Private
 */
router.get('/view', authenticate, viewUserData);

/**
 * @route   GET /api/data/export
 * @desc    Export all data for the authenticated user as a JSON file
 * @access  Private
 */
router.get('/export', authenticate, exportUserData);

module.exports = router;