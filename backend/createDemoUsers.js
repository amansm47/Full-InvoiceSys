const mongoose = require('mongoose');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/invoice-financing', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function createDemoUsers() {
  try {
    // Clear existing demo users
    await User.deleteMany({ email: { $in: ['seller@demo.com', 'investor@demo.com', 'buyer@demo.com'] } });
    
    // Create demo users
    const demoUsers = [
      {
        email: 'seller@demo.com',
        password: 'demo123',
        role: 'seller',
        name: 'Demo Seller',
        phone: '9876543210',
        businessName: 'Demo Business',
        walletAddress: '0x' + Date.now().toString(16),
        privateKey: 'temp_key',
        isActive: true,
        kyc: {
          status: 'verified',
          pan: 'ABCDE1234F',
          gst: '12ABCDE1234F1Z5',
          aadhaar: '123456789012',
          bankAccount: '1234567890',
          ifsc: 'DEMO0001234'
        }
      },
      {
        email: 'investor@demo.com',
        password: 'demo123',
        role: 'investor',
        name: 'Demo Investor',
        phone: '9876543211',
        businessName: 'Demo Investment Firm',
        walletAddress: '0x' + (Date.now() + 1).toString(16),
        privateKey: 'temp_key',
        isActive: true,
        kyc: {
          status: 'verified',
          pan: 'FGHIJ5678K',
          gst: '34FGHIJ5678K2Y6',
          aadhaar: '123456789013',
          bankAccount: '1234567891',
          ifsc: 'DEMO0001235'
        }
      },
      {
        email: 'buyer@demo.com',
        password: 'demo123',
        role: 'buyer',
        name: 'Demo Buyer',
        phone: '9876543212',
        businessName: 'Demo Corporation',
        walletAddress: '0x' + (Date.now() + 2).toString(16),
        privateKey: 'temp_key',
        isActive: true,
        kyc: {
          status: 'verified',
          pan: 'LMNOP9012Q',
          gst: '56LMNOP9012Q3X7',
          aadhaar: '123456789014',
          bankAccount: '1234567892',
          ifsc: 'DEMO0001236'
        }
      }
    ];

    for (const userData of demoUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`Created demo user: ${userData.email} (${userData.role})`);
    }

    console.log('Demo users created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating demo users:', error);
    process.exit(1);
  }
}

createDemoUsers();