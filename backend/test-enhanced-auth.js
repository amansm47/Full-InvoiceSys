const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Import enhanced auth components
const authService = require('./services/authService');
const enhancedAuthRoutes = require('./routes/enhancedAuth');
const { securityHeaders, apiRateLimit } = require('./middleware/enhancedAuth');

const app = express();
const PORT = process.env.PORT || 5002;

// Basic middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(securityHeaders);
app.use(apiRateLimit);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blc-enhanced')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Enhanced Auth Server Running',
    timestamp: new Date().toISOString()
  });
});

// Enhanced auth routes
app.use('/api/auth', enhancedAuthRoutes);

// Test endpoint
app.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Enhanced authentication system is working!',
    features: [
      'JWT Access Tokens (15min)',
      'Refresh Tokens (7 days)',
      'OTP Verification',
      'Rate Limiting',
      'Fraud Detection',
      'Account Lockout',
      'Password Strength Validation'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Enhanced Auth Server running on port ${PORT}`);
  console.log(`📊 Test endpoint: http://localhost:${PORT}/test`);
});

module.exports = app;