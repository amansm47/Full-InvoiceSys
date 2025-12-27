const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/invoice-finance');

// Schemas
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  company: String,
  phone: String,
  kycStatus: String
}, { timestamps: true });

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: String,
  sellerId: mongoose.Schema.Types.ObjectId,
  buyerName: String,
  buyerEmail: String,
  amount: Number,
  dueDate: Date,
  status: String,
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
  status: String
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Invoice = mongoose.model('Invoice', invoiceSchema);
const Investment = mongoose.model('Investment', investmentSchema);

async function clearData() {
  try {
    console.log('🗑️ Clearing all data from database...');
    
    await User.deleteMany({});
    await Invoice.deleteMany({});
    await Investment.deleteMany({});
    
    console.log('✅ All data cleared successfully!');
    console.log('🚀 You can now create new accounts at http://localhost:3000/register');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    process.exit(1);
  }
}

clearData();