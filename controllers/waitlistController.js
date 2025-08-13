// In controllers/waitlistController.js
const { query } = require('../db');

exports.subscribe = async (req, res) => {
    const { email } = req.body;

    try {
        // Use "ON CONFLICT DO NOTHING" to gracefully handle duplicate signups
        const result = await query(
            'INSERT INTO waitlist_subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING RETURNING id',
            [email]
        );

        // If a new row was inserted, the status is 201 Created.
        // If the email already existed, the status is 200 OK.
        const status = result.rows.length > 0 ? 201 : 200;
        
        res.status(status).json({ message: 'Subscription successful.' });
    } catch (err) {
        console.error('Waitlist subscription error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
};
