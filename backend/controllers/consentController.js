const { query } = require('../db');

exports.grantConsent = async (req, res) => {
  const { userId } = req;
  const { consent_type } = req.body;
  const ip_address = req.ip;
  const user_agent = req.get('User-Agent');

  if (!consent_type) {
    return res.status(400).json({ error: 'consent_type is required' });
  }

  try {
    // Use an "UPSERT" operation:
    // It will INSERT a new consent record. If a record for that user and consent_type
    // already exists, it will UPDATE the granted_at timestamp.
    const consentQuery = `
      INSERT INTO user_consents (user_id, consent_type, ip_address, user_agent)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, consent_type)
      DO UPDATE SET granted_at = NOW(), ip_address = $3, user_agent = $4
      RETURNING *;
    `;

    const { rows } = await query(consentQuery, [userId, consent_type, ip_address, user_agent]);

    res.status(201).json({
      message: 'Consent granted successfully',
      consent: rows[0]
    });
  } catch (err) {
    console.error('Failed to grant consent:', err);
    res.status(500).json({ error: 'Server error while granting consent' });
  }
};