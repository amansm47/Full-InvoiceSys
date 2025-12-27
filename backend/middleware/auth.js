const admin = require('../config/firebase');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Find or create user in MongoDB
    let user = await User.findOne({ firebaseUid: decodedToken.uid });
    
    if (!user) {
      user = new User({
        firebaseUid: decodedToken.uid,
        email: decodedToken.email,
        profile: {
          firstName: decodedToken.name?.split(' ')[0] || '',
          lastName: decodedToken.name?.split(' ')[1] || ''
        }
      });
      await user.save();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { authenticateToken };