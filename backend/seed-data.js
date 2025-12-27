const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/invoice-finance');

// Schemas (same as in server)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  company: String,
  phone: String,
  kycStatus: { type: String, default: 'verified' }
}, { timestamps: true });

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: String,
  sellerId: mongoose.Schema.Types.ObjectId,
  buyerName: String,
  buyerEmail: String,
  amount: Number,
  dueDate: Date,
  status: { type: String, default: 'verified' },
  discountedAmount: Number,
  investorId: mongoose.Schema.Types.ObjectId,
  fundedAt: Date,
  description: String,
  category: String
}, { timestamps: true });

const investmentSchema = new mongoose.Schema({
  investorId: mongoose.Schema.Types.ObjectId,
  invoiceId: mongoose.Schema.Types.ObjectId,
  amount: Number,
  expectedReturn: Number,
  actualReturn: Number,
  status: { type: String, default: 'active' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Invoice = mongoose.model('Invoice', invoiceSchema);
const Investment = mongoose.model('Investment', investmentSchema);

async function seedData() {
  try {
    console.log('🌱 Starting to seed database...');
    
    // Clear existing data
    await User.deleteMany({});
    await Invoice.deleteMany({});
    await Investment.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const seller = await User.create({
      name: 'John Doe',
      email: 'seller@test.com',
      password: hashedPassword,
      role: 'seller',
      company: 'ABC Enterprises',
      phone: '+91 98765 43210',
      kycStatus: 'verified'
    });

    const investor = await User.create({
      name: 'Jane Smith',
      email: 'investor@test.com',
      password: hashedPassword,
      role: 'investor',
      company: 'Investment Corp',
      phone: '+91 87654 32109',
      kycStatus: 'verified'
    });

    const buyer = await User.create({
      name: 'Tech Corp',
      email: 'buyer@test.com',
      password: hashedPassword,
      role: 'buyer',
      company: 'Tech Corp Ltd',
      phone: '+91 76543 21098',
      kycStatus: 'verified'
    });

    console.log('👥 Created users');

    // Create sample invoices
    const invoices = [];
    for (let i = 1; i <= 10; i++) {
      const invoice = await Invoice.create({
        invoiceNumber: `INV-${String(i).padStart(3, '0')}`,
        sellerId: seller._id,
        buyerName: `Customer ${i}`,
        buyerEmail: `customer${i}@test.com`,
        amount: Math.floor(Math.random() * 200000) + 50000,
        dueDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000),
        status: i <= 6 ? 'funded' : 'verified',
        discountedAmount: i <= 6 ? Math.floor(Math.random() * 180000) + 45000 : null,
        investorId: i <= 6 ? investor._id : null,
        fundedAt: i <= 6 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null,
        description: `Invoice for services ${i}`,
        category: 'Services'
      });
      invoices.push(invoice);
    }

    console.log('📄 Created invoices');

    // Create sample investments
    for (let i = 0; i < 6; i++) {
      await Investment.create({
        investorId: investor._id,
        invoiceId: invoices[i]._id,
        amount: invoices[i].discountedAmount,
        expectedReturn: invoices[i].amount,
        actualReturn: i < 3 ? invoices[i].amount : null,
        status: i < 3 ? 'completed' : 'active'
      });
    }

    console.log('💰 Created investments');
    console.log('');
    console.log('✅ Sample data created successfully!');
    console.log('📧 Seller Login: seller@test.com / password123');
    console.log('💰 Investor Login: investor@test.com / password123');
    console.log('🏢 Buyer Login: buyer@test.com / password123');
    console.log('');
    console.log('🚀 Now go to http://localhost:3000 and login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedData();