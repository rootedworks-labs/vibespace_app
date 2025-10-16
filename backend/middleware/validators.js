const { query, validationResult } = require('express-validator');

const validateFeedQuery = [
    query('time_window')
        .optional()
        .isIn(['morning', 'afternoon', 'evening', 'all'])
        .withMessage("Invalid time_window. Must be one of: 'morning', 'afternoon', 'evening', 'all'."),
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer.'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be an integer between 1 and 100.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

module.exports = {
    validateFeedQuery,
};