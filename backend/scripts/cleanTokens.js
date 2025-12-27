const mongoose = require('mongoose');
const authService = require('../services/authService');
require('dotenv').config();

async function cleanExpiredTokens() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blc-enhanced');
    console.log('✅ Connected to MongoDB');

    // Clean expired tokens
    await authService.cleanExpiredTokens();
    console.log('🧹 Successfully cleaned expired tokens');

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error cleaning tokens:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  cleanExpiredTokens();
}

module.exports = cleanExpiredTokens;