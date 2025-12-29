yconst mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  tlsAllowInvalidCertificates: true
}).then(() => console.log('✅ Connected')).catch(err => process.exit(1));

const User = require('./models/User');

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

const Wallet = mongoose.models.Wallet || mongoose.model('Wallet', walletSchema);

async function createWallets() {
  const users = await User.find({ email: { $in: ['seller@test.com', 'investor@test.com', 'test@test.com'] } });
  
  for (const user of users) {
    const existing = await Wallet.findOne({ userId: user._id });
    if (existing) {
      console.log(`⚠️  Wallet exists for ${user.email}`);
      continue;
    }
    
    await Wallet.create({
      userId: user._id,
      balance: 1000000,
      transactions: [{
        type: 'credit',
        amount: 1000000,
        description: 'Initial demo balance',
        timestamp: new Date()
      }]
    });
    
    console.log(`✅ Created wallet for ${user.email} with ₹10,00,000`);
  }
  
  process.exit(0);
}

createWallets();
