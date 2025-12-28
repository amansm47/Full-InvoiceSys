const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../config/auth');

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Use cloud-enhanced token verification
    const decoded = auth.verifyToken(token);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    // Add cloud security context
    req.user = user;
    req.cloudContext = {
      projectId: process.env.CLOUD_PROJECT_ID,
      region: process.env.CLOUD_REGION,
      timestamp: Date.now()
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { authenticateToken };