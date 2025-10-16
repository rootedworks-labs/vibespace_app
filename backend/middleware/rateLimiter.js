// In middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

// Limiter for authentication routes (login, register, etc.)
// Allows 10 requests per 15 minutes to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: 'Too many login/registration attempts. Please try again in 15 minutes.' },
});

// A more general limiter for the rest of the API
// Allows 100 requests per 15 minutes
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests. Please try again later.' },
});

module.exports = {
  authLimiter,
  apiLimiter,
};