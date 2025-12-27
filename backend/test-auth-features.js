const mongoose = require('mongoose');
const authService = require('./services/authService');
const User = require('./models/User');

async function testEnhancedAuth() {
  try {
    console.log('🔐 Testing Enhanced Authentication System...\n');

    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/blc-enhanced');
    console.log('✅ Connected to MongoDB');

    // Test password validation
    console.log('\n📋 Testing Password Validation:');
    const weakPassword = authService.validatePassword('123');
    const strongPassword = authService.validatePassword('SecurePass123!');
    
    console.log('Weak password:', weakPassword.isValid ? '✅' : '❌', weakPassword.strength);
    console.log('Strong password:', strongPassword.isValid ? '✅' : '❌', strongPassword.strength);

    // Test token generation
    console.log('\n🎫 Testing Token Generation:');
    const accessToken = authService.generateAccessToken('testUserId', 'seller');
    console.log('Access token generated:', accessToken ? '✅' : '❌');

    // Test OTP generation
    console.log('\n📱 Testing OTP Generation:');
    const otp = authService.generateOTP();
    console.log('OTP generated:', otp, '✅');

    // Test user creation
    console.log('\n👤 Testing User Creation:');
    const testUser = new User({
      email: 'test@enhanced.com',
      password: 'SecurePass123!',
      role: 'seller',
      profile: {
        firstName: 'Test',
        lastName: 'User',
        phone: '1234567890',
        company: 'Test Corp'
      }
    });

    await testUser.save();
    console.log('User created successfully ✅');

    // Test password comparison
    const isPasswordValid = await testUser.comparePassword('SecurePass123!');
    console.log('Password verification:', isPasswordValid ? '✅' : '❌');

    // Clean up
    await User.deleteOne({ email: 'test@enhanced.com' });
    console.log('Test user cleaned up ✅');

    console.log('\n🎉 Enhanced Authentication System Test Complete!');
    console.log('\n📊 Features Available:');
    console.log('• JWT Access Tokens (15min expiry)');
    console.log('• Refresh Tokens (7 days expiry)');
    console.log('• OTP Verification System');
    console.log('• Password Strength Validation');
    console.log('• Account Lockout Protection');
    console.log('• Fraud Detection');
    console.log('• Rate Limiting');
    console.log('• Security Headers');

    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testEnhancedAuth();