const express = require('express');
const admin = require('../config/firebase');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Register user (creates Firebase user and MongoDB profile)
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, profile } = req.body;

    // Create Firebase user
    const firebaseUser = await admin.auth().createUser({
      email,
      password,
      displayName: `${profile.firstName} ${profile.lastName}`
    });

    // Create MongoDB user profile
    const user = new User({
      firebaseUid: firebaseUser.uid,
      email,
      role,
      profile
    });

    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: user.getPublicProfile()
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json(req.user.getPublicProfile());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update KYC
router.post('/kyc', authenticateToken, async (req, res) => {
  try {
    const { documents, gstNumber, panNumber } = req.body;
    
    req.user.kyc.status = 'submitted';
    req.user.kyc.documents = documents;
    req.user.profile.gstNumber = gstNumber;
    req.user.profile.panNumber = panNumber;
    
    await req.user.save();
    
    res.json({ message: 'KYC submitted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;