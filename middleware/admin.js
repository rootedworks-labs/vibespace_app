const { query } = require('../db');

const checkAdmin = async (req, res, next) => {
    const { userId } = req;

    try {
        const userResult = await query('SELECT role FROM users WHERE id = $1', [userId]);
        
        if (userResult.rows.length === 0 || userResult.rows[0].role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: Admin access required.' });
        }

        next();
    } catch (err) {
        console.error('Admin check failed:', err);
        return res.status(500).json({ error: 'Server error during admin check.' });
    }
};

module.exports = { checkAdmin };