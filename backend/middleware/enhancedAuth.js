const rateLimit = require('express-rate-limit');
const authService = require('../services/authService');
const User = require('../models/User');

// Enhanced authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Access token required',
        code: 'NO_TOKEN'
      });
    }
    
    // Verify access token
    const decoded = authService.verifyAccessToken(token);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid or expired token',
        code: 'INVALID_TOKEN'
      });
    }

    // Check if account is locked
    if (user.isLocked()) {
      return res.status(423).json({
        success: false,
        message: 'Account temporarily locked',
        code: 'ACCOUNT_LOCKED'
      });
    }
    
    req.user = {
      id: user._id,
      role: user.role,
      email: user.email,
      kycStatus: user.kyc.status
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    return res.status(401).json({ 
      success: false,
      message: 'Invalid token',
      code: 'INVALID_TOKEN'
    });
  }
};

// Optional authentication (for public endpoints that can benefit from user context)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = authService.verifyAccessToken(token);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.isActive && !user.isLocked()) {
        req.user = {
          id: user._id,
          role: user.role,
          email: user.email,
          kycStatus: user.kyc.status
        };
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};

// Role-based access control
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        message: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }
    
    next();
  };
};

// KYC verification requirement
const requireKYC = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      message: 'Authentication required',
      code: 'AUTH_REQUIRED'
    });
  }

  if (req.user.kycStatus !== 'verified') {
    return res.status(403).json({ 
      success: false,
      message: 'KYC verification required',
      code: 'KYC_REQUIRED',
      kycStatus: req.user.kycStatus
    });
  }
  
  next();
};

// Rate limiting configurations
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message,
      code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message,
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.round(windowMs / 1000)
      });
    }
  });
};

// Different rate limits for different endpoints
const authRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts
  'Too many authentication attempts, please try again later'
);

const loginRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts
  'Too many login attempts, please try again later'
);

const otpRateLimit = createRateLimit(
  5 * 60 * 1000, // 5 minutes
  3, // 3 attempts
  'Too many OTP requests, please try again later'
);

const passwordResetRateLimit = createRateLimit(
  60 * 60 * 1000, // 1 hour
  3, // 3 attempts
  'Too many password reset attempts, please try again later'
);

const apiRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests
  'Too many API requests, please try again later'
);

// Security headers middleware
const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Remove server information
  res.removeHeader('X-Powered-By');
  
  next();
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id || 'anonymous',
      timestamp: new Date().toISOString()
    };
    
    console.log(`${logData.method} ${logData.url} - ${logData.status} - ${logData.duration} - ${logData.ip}`);
  });
  
  next();
};

// Device fingerprinting
const deviceFingerprint = (req, res, next) => {
  req.deviceInfo = {
    userAgent: req.get('User-Agent'),
    ipAddress: req.ip || req.connection.remoteAddress,
    acceptLanguage: req.get('Accept-Language'),
    acceptEncoding: req.get('Accept-Encoding')
  };
  
  next();
};

module.exports = {
  auth,
  optionalAuth,
  requireRole,
  requireKYC,
  authRateLimit,
  loginRateLimit,
  otpRateLimit,
  passwordResetRateLimit,
  apiRateLimit,
  securityHeaders,
  requestLogger,
  deviceFingerprint
};