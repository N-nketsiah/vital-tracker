const logger = require('morgan');

// Configure morgan for request logging
const morganMiddleware = logger(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms');

module.exports = morganMiddleware;
