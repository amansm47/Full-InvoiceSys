const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');

// Import enhanced auth components
const authService = require('./services/authService');
const { securityHeaders, apiRateLimit } = require('./middleware/enhancedAuth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;

// Enhanced security middleware
app.use(helmet());
app.use(compression());
app.use(securityHeaders);
app.use(cors());
app.use(express.json());
app.use(apiRateLimit);
app.use('/uploads', express.static('uploads'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blc-enhanced', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  // Clean expired tokens on startup
  authService.cleanExpiredTokens()
    .then(() => console.log('🧹 Cleaned expired tokens'))
    .catch(err => console.error('❌ Error cleaning tokens:', err));
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Import enhanced models
const User = require('./models/User');
const Invoice = require('./models/Invoice');
const RefreshToken = require('./models/RefreshToken');
const OTP = require('./models/OTP');



// Investment Schema (keeping for compatibility)
const investmentSchema = new mongoose.Schema({
  investorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
  amount: { type: Number, required: true },
  expectedReturn: { type: Number, required: true },
  actualReturn: Number,
  status: { type: String, enum: ['active', 'completed', 'defaulted'], default: 'active' }
}, { timestamps: true });

const Investment = mongoose.model('Investment', investmentSchema);

// Import enhanced auth middleware
const { auth, requireRole, requireKYC } = require('./middleware/enhancedAuth');

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Enhanced Auth Routes
app.use('/api/auth', require('./routes/enhancedAuth'));

// User Routes
app.get('/api/users/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/users/dashboard', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    if (userRole === 'seller') {
      const totalInvoices = await Invoice.countDocuments({ sellerId: userId });
      const fundedInvoices = await Invoice.find({ sellerId: userId, status: 'funded' });
      const totalFunded = fundedInvoices.reduce((sum, inv) => sum + (inv.discountedAmount || 0), 0);
      const successRate = totalInvoices > 0 ? Math.round((fundedInvoices.length / totalInvoices) * 100) : 0;
      const activeInvoices = await Invoice.countDocuments({ sellerId: userId, status: { $in: ['pending', 'verified'] } });

      res.json({
        stats: {
          totalInvoices,
          totalFunded,
          successRate,
          activeInvoices
        }
      });
    } else if (userRole === 'investor') {
      const investments = await Investment.find({ investorId: userId }).populate('invoiceId');
      const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
      const completedInvestments = investments.filter(inv => inv.status === 'completed');
      const actualReturns = completedInvestments.reduce((sum, inv) => sum + (inv.actualReturn || 0), 0);
      const activeInvestments = investments.filter(inv => inv.status === 'active').length;

      res.json({
        stats: {
          totalInvested,
          actualReturns,
          activeInvestments,
          avgROI: totalInvested > 0 ? ((actualReturns / totalInvested) * 100).toFixed(1) : 0
        }
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Invoice Routes
app.post('/api/invoices/create', auth, requireKYC, upload.array('documents'), async (req, res) => {
  try {
    const { invoiceNumber, buyerName, buyerEmail, amount, dueDate, description, category } = req.body;
    
    const existingInvoice = await Invoice.findOne({ invoiceNumber });
    if (existingInvoice) {
      return res.status(400).json({ message: 'Invoice number already exists' });
    }

    const documents = req.files ? req.files.map(file => file.filename) : [];

    const invoice = new Invoice({
      invoiceNumber,
      sellerId: req.user.id,
      buyerName,
      buyerEmail,
      amount: parseFloat(amount),
      dueDate: new Date(dueDate),
      documents,
      description,
      category
    });

    await invoice.save();
    res.status(201).json({ message: 'Invoice created successfully', invoice });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/invoices/seller', auth, async (req, res) => {
  try {
    const invoices = await Invoice.find({ sellerId: req.user.id })
      .sort({ createdAt: -1 })
      .populate('investorId', 'name email');
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/invoices/marketplace', auth, async (req, res) => {
  try {
    const invoices = await Invoice.find({ 
      status: 'verified',
      investorId: { $exists: false }
    })
    .populate('sellerId', 'name company')
    .sort({ createdAt: -1 });
    
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/invoices/:id/fund', auth, requireRole(['investor']), requireKYC, async (req, res) => {
  try {
    const { discountedAmount } = req.body;
    const invoiceId = req.params.id;
    
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    if (invoice.status !== 'verified') {
      return res.status(400).json({ message: 'Invoice not available for funding' });
    }

    invoice.status = 'funded';
    invoice.discountedAmount = parseFloat(discountedAmount);
    invoice.investorId = req.user.id;
    invoice.fundedAt = new Date();
    
    await invoice.save();

    // Create investment record
    const investment = new Investment({
      investorId: req.user.id,
      invoiceId: invoice._id,
      amount: parseFloat(discountedAmount),
      expectedReturn: invoice.amount
    });
    
    await investment.save();

    res.json({ message: 'Invoice funded successfully', invoice });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Marketplace Routes
app.get('/api/marketplace/investors', auth, async (req, res) => {
  try {
    const investors = await User.find({ 
      role: 'investor',
      kycStatus: 'verified'
    }).select('name email company');
    
    // Add mock data for demo
    const investorsWithData = investors.map(investor => ({
      ...investor.toObject(),
      interestRate: '8-12%',
      minAmount: 50000,
      responseTime: '24 hours',
      rating: 4.8
    }));
    
    res.json({ investors: investorsWithData });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/marketplace/connect/:investorId', auth, async (req, res) => {
  try {
    // In a real app, this would create a connection request
    res.json({ message: 'Connection request sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'BLC Enhanced Server Running',
    timestamp: new Date().toISOString(),
    features: ['Enhanced Auth', 'JWT Tokens', 'OTP Verification', 'Rate Limiting']
  });
});

// Clean expired tokens every hour
setInterval(async () => {
  try {
    await authService.cleanExpiredTokens();
    console.log('🧹 Cleaned expired tokens');
  } catch (error) {
    console.error('❌ Error cleaning tokens:', error);
  }
}, 60 * 60 * 1000);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 BLC Enhanced Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Enhanced authentication active`);
});

module.exports = app;