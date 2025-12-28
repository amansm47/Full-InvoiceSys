const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Cloud security middleware
const cloudSecurity = {
  // Enhanced rate limiting with cloud configuration
  apiRateLimit: rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: {
      error: 'Too many requests from this IP',
      retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000) / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      return req.ip + ':' + (req.headers['x-api-key'] || 'anonymous');
    }
  }),

  // Cloud security headers
  securityHeaders: helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", process.env.FRONTEND_URL]
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }),

  // API key validation middleware
  validateApiKey: (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const timestamp = req.headers['x-timestamp'];
    
    if (!apiKey || !timestamp) {
      return res.status(401).json({ error: 'Missing API credentials' });
    }

    const auth = require('../config/auth');
    if (!auth.validateCloudRequest(apiKey, timestamp)) {
      return res.status(401).json({ error: 'Invalid API credentials' });
    }

    next();
  },

  // Cloud project validation
  validateCloudProject: (req, res, next) => {
    const projectId = req.headers['x-project-id'];
    const expectedProjectId = process.env.CLOUD_PROJECT_ID;

    if (expectedProjectId && projectId !== expectedProjectId) {
      return res.status(403).json({ error: 'Invalid project access' });
    }

    next();
  }
};

module.exports = cloudSecurity;