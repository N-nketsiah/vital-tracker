const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // very high for development
  skip: (req, res) => process.env.NODE_ENV !== 'production'
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // very high for development
  skip: (req, res) => process.env.NODE_ENV !== 'production'
});

module.exports = {
  limiter,
  strictLimiter
};
