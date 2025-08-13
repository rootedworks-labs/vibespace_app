// In middleware/validation.js
const { body, param, query, validationResult } = require('express-validator');

// --- New: Validation rules for user registration ---
const registerRules = () => {
  return [
    body('email')
      .isEmail()
      .withMessage('Must be a valid email address'),

    body('username')
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters long'),

    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/\d/)
      .withMessage('Password must contain a number'),
  ];
};

const loginRules = () => {
  return [
    body('email')
      .isEmail()
      .withMessage('Must be a valid email address'),

    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ];
};

// --- Existing (Renamed): Validation rules for updating a profile ---
const updateProfileRules = () => {
  return [
    body('username')
      .optional()
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be 3-30 characters')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username contains invalid characters'),

    body('bio')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Bio exceeds 200 characters'),

    body('website')
      .optional()
      .trim()
      .isURL()
      .withMessage('Invalid website URL')
  ];
};

// --- New: Rules for Creating a Post ---
const createPostRules = () => {
    return [
        body('content')
            .trim()
            .notEmpty()
            .withMessage('Post content cannot be empty.')
            .isLength({ max: 1000 })
            .withMessage('Post content cannot exceed 1000 characters.'),
        body('is_public')
            .optional()
            .isBoolean()
            .withMessage('is_public must be a boolean value (true or false).')
    ];
};

// --- New: Rules for Granting Consent ---
const grantConsentRules = () => {
    return [
        body('consent_type')
            .trim()
            .notEmpty()
            .withMessage('consent_type is required.')
            .isString()
            .withMessage('consent_type must be a string.')
    ];
};

// --- New: Reusable rule for validating a post ID in the URL ---
const postIdRule = () => {
    return [
        param('postId')
            .isInt({ min: 1 })
            .withMessage('Post ID must be a positive integer.')
    ];
};

// --- New: Reusable rule for validating a username in the URL ---
const usernameRule = () => {
    return [
        param('username')
            .trim()
            .notEmpty()
            .withMessage('Username cannot be empty.')
            .isLength({ min: 3, max: 30 })
            .withMessage('Username must be 3-30 characters.')
    ];
};

const createCommentRules = () => {
    return [
        body('content')
            .trim()
            .notEmpty()
            .withMessage('Comment content cannot be empty.')
            .isLength({ max: 500 })
            .withMessage('Comment cannot exceed 500 characters.')
    ];
};

// --- New: Reusable rule for validating a comment ID in the URL ---
const commentIdRule = () => {
    return [
        param('commentId')
            .isInt({ min: 1 })
            .withMessage('Comment ID must be a positive integer.')
    ];
};

// --- New: Rules for User Search ---
const searchUsersRules = () => {
    return [
        query('q')
            .trim()
            .notEmpty()
            .withMessage('Search query "q" is required.')
            .isLength({ min: 1, max: 50 })
            .withMessage('Search query must be between 1 and 50 characters.')
    ];
};

// --- New: Rules for creating a conversation ---
const createConversationRules = () => {
    return [
        body('recipientId')
            .isInt({ min: 1 })
            .withMessage('Recipient ID must be a positive integer.')
    ];
};

// --- New: Rules for sending a message ---
const sendMessageRules = () => {
    return [
        body('content')
            .trim()
            .notEmpty()
            .withMessage('Message content cannot be empty.')
            .isLength({ max: 2000 })
            .withMessage('Message cannot exceed 2000 characters.')
    ];
};

// --- New: Reusable rule for validating a conversation ID in the URL ---
const conversationIdRule = () => {
    return [
        param('conversationId')
            .isInt({ min: 1 })
            .withMessage('Conversation ID must be a positive integer.')
    ];
};

// --- New: Rules for waitlist signup ---
const waitlistRules = () => {
    return [
        body('email')
            .isEmail()
            .withMessage('Must be a valid email address.')
            .normalizeEmail()
    ];
};


// --- New: Central middleware to handle all validation errors ---
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next(); // No errors, proceed
  }

  // Format and send back the errors
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

  return res.status(400).json({
    errors: extractedErrors,
  });
};

const createReportRules = () => {
    return [
        body('reported_content_type')
            .isIn(['post', 'comment', 'user'])
            .withMessage('Content type must be post, comment, or user.'),
        body('reported_id')
            .isInt({ min: 1 })
            .withMessage('Reported ID must be a positive integer.'),
        body('reason')
            .trim()
            .notEmpty()
            .withMessage('A reason for the report is required.')
            .isLength({ max: 500 })
            .withMessage('Reason cannot exceed 500 characters.')
    ];
};


module.exports = {
  registerRules,
  loginRules, // Added export
  updateProfileRules,
  createPostRules,
  grantConsentRules,
  postIdRule,
  usernameRule,
  validate,
  createCommentRules,
  commentIdRule,
  searchUsersRules, // Added export
  createConversationRules,
  sendMessageRules,
  conversationIdRule,
  waitlistRules,
  createReportRules,
};
