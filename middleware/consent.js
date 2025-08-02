// middleware/consent.js
const { query } = require('../db');

/**
 * Creates a middleware function to check if a user has granted a specific type of consent.
 * @param {string} requiredConsentType - The type of consent to check for (e.g., 'file_upload').
 * @returns {function} An Express middleware function.
 */
exports.checkConsent = (requiredConsentType) => {
  return async (req, res, next) => {
    // Guard Clause: Ensure userId is present from the auth middleware.
    const { userId } = req;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    try {
      const consentQuery = `
        SELECT 1 FROM user_consents
        WHERE user_id = $1 AND consent_type = $2;
      `;
      const { rows } = await query(consentQuery, [userId, requiredConsentType]);

      // If no consent record is found, deny access.
      if (rows.length === 0) {
        return res.status(403).json({
          error: 'Consent required for this action',
          required_consent: requiredConsentType
        });
      }

      // Consent found, proceed to the next handler.
      next();
    } catch (err) {
      // Catch any database or unexpected errors.
      console.error('Consent check failed:', err);
      return res.status(500).json({ error: 'Server error during consent check' });
    }
  };
};