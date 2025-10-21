const dataExportService = require('../services/dataExportService');

/**
 * @desc    Get all data for the authenticated user for viewing.
 * @route   GET /api/data/view
 * @access  Private
 */
const viewUserData = async (req, res) => {
  try {
    // --- THE FIX ---
    const userId = req.userId; // Changed from req.user.id
    // --- END FIX ---

    const userData = await dataExportService.gatherUserData(userId);
    res.status(200).json(userData);
  } catch (error) {
    console.error('Error retrieving user data for view:', error);
    res.status(500).json({ message: 'Failed to retrieve user data.' });
  }
};

/**
 * @desc    Export all data for the authenticated user as a JSON file.
 * @route   GET /api/data/export
 * @access  Private
 */
const exportUserData = async (req, res) => {
  try {
    // --- THE FIX ---
    const userId = req.userId; // Changed from req.user.id
    // --- END FIX ---
    
    const userData = await dataExportService.gatherUserData(userId);
    
    const fileName = `vibespace_data_export_${userId}_${Date.now()}.json`;

    // Set headers to trigger a file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    // Send the data as a stringified JSON
    res.status(200).send(JSON.stringify(userData, null, 2));
  } catch (error) {
    console.error('Error exporting user data:', error);
    res.status(500).json({ message: 'Failed to export user data.' });
  }
};

module.exports = {
  viewUserData,
  exportUserData,
};