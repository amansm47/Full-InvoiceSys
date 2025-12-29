const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  tlsAllowInvalidCertificates: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

const User = require('./models/User');
const Wallet = require('./models/Wallet');

const testUsers = [
  {
    email: 'seller@test.com',
    password: 'password123',
    role: 'seller',
    profile: {
      firstName: 'John',
      lastName: 'Seller',
      company: 'ABC Enterprises',
      phone: '+91-9876543210'
    },
    kyc: {
      status: 'verified',
      documents: {
        pan: 'ABCDE1234F',
        gst: '27ABCDE1234F1Z5'
      }
    }
  },
  {
    email: 'investor@test.com',
    password: 'password123',
    role: 'investor',
    profile: {
      firstName: 'Jane',
      lastName: 'Investor',
      company: 'Investment Corp',
      phone: '+91-9876543211'
    },
    kyc: {
      status: 'verified',
      documents: {
        pan: 'XYZAB5678C'
      }
    }
  },
  {
    email: 'buyer@test.com',
    password: 'password123',
    role: 'buyer',
    profile: {
      firstName: 'Bob',
      lastName: 'Buyer',
      company: 'XYZ Corporation',
      phone: '+91-9876543212'
    },
    kyc: {
      status: 'verified',
      documents: {
        pan: 'PQRST9012D',
        gst: '29PQRST9012D1Z8'
      }
    }
  }
];

async function seedUsers() {
  try {
    console.log('🌱 Seeding test users...\n');

    for (const userData of testUsers) {
      // Check if user exists
      let user = await User.findOne({ email: userData.email });
      
      if (user) {
        console.log(`⚠️  User ${userData.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      // Create user
      user = new User({
        ...userData,
        password: hashedPassword
      });
      
      await user.save();
      console.log(`✅ Created user: ${userData.email} (${userData.role})`);

      // Create wallet with demo balance
      const wallet = new Wallet({
        userId: user._id,
        balance: 1000000, // 10 lakh rupees
        transactions: [{
          type: 'credit',
          amount: 1000000,
          description: 'Initial demo balance',
          timestamp: new Date()
        }]
      });
      
      await wallet.save();
      console.log(`   💰 Created wallet with ₹10,00,000 demo balance\n`);
    }

    console.log('✅ Seeding completed!\n');
    console.log('📝 Test Users Created:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Seller:');
    console.log('  Email: seller@test.com');
    console.log('  Password: password123');
    console.log('  Balance: ₹10,00,000\n');
    console.log('Investor:');
    console.log('  Email: investor@test.com');
    console.log('  Password: password123');
    console.log('  Balance: ₹10,00,000\n');
    console.log('Buyer:');
    console.log('  Email: buyer@test.com');
    console.log('  Password: password123');
    console.log('  Balance: ₹10,00,000\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
}

// Define Wallet schema if not already defined
if (!mongoose.models.Wallet) {
  const walletSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    balance: { type: Number, default: 1000000 },
    transactions: [{
      type: { type: String, enum: ['credit', 'debit'] },
      amount: Number,
      description: String,
      invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
      timestamp: { type: Date, default: Date.now }
    }]
  }, { timestamps: true });
  
  mongoose.model('Wallet', walletSchema);
}

seedUsers();
