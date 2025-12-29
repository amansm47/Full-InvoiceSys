const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration - Allow multiple origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://full-invoice-sys.vercel.app',
  'https://full-invoice-j3cb3dlml-amans-projects-ea2fa66e.vercel.app',
  /https:\/\/full-invoice-.*\.vercel\.app$/
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') return allowed === origin;
      if (allowed instanceof RegExp) return allowed.test(origin);
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB connection with TLS options
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  tlsAllowInvalidCertificates: true,
  serverSelectionTimeoutMS: 5000,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Import models
const User = require('./models/User');
const Invoice = require('./models/Invoice');

// Investment Schema - Check if model exists first to avoid recompilation
const Investment = mongoose.models.Investment || mongoose.model('Investment', new mongoose.Schema({
  investorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
  amount: { type: Number, required: true },
  expectedReturn: { type: Number, required: true },
  actualReturn: Number,
  status: { type: String, enum: ['active', 'completed', 'defaulted'], default: 'active' }
}, { timestamps: true }));

// Auth middleware
const { authenticateToken } = require('./middleware/auth');
const auth = authenticateToken;

const requireRole = (roles) => (req, res, next) => {
  if (roles.includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied' });
  }
};

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

// Auth Routes
app.use('/api/auth', require('./routes/auth'));

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

app.get('/api/users/portfolio', auth, async (req, res) => {
  try {
    const investments = await Investment.find({ investorId: req.user.id })
      .populate('invoiceId', 'invoiceNumber amount dueDate status sellerId')
      .populate('invoiceId.sellerId', 'name company')
      .sort({ createdAt: -1 });
    
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const completedInvestments = investments.filter(inv => inv.status === 'completed');
    const actualReturns = completedInvestments.reduce((sum, inv) => sum + (inv.actualReturn || 0), 0);
    const activeInvestments = investments.filter(inv => inv.status === 'active');
    
    res.json({
      totalInvested,
      actualReturns,
      activeInvestments: activeInvestments.length,
      investments,
      summary: {
        totalInvestments: investments.length,
        avgReturn: totalInvested > 0 ? ((actualReturns / totalInvested) * 100).toFixed(2) : 0,
        pendingReturns: activeInvestments.reduce((sum, inv) => sum + (inv.expectedReturn - inv.amount), 0)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Invoice Routes
app.post('/api/invoices/create', auth, upload.array('documents'), async (req, res) => {
  try {
    const { invoiceNumber, buyerName, buyerEmail, amount, dueDate, description } = req.body;
    
    if (!invoiceNumber || !buyerName || !buyerEmail || !amount || !dueDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const existingInvoice = await Invoice.findOne({ invoiceNumber });
    if (existingInvoice) {
      return res.status(400).json({ message: 'Invoice number already exists' });
    }

    const documents = req.files ? req.files.map(file => ({
      type: 'invoice',
      filename: file.filename,
      originalName: file.originalname,
      size: file.size
    })) : [];

    const invoice = new Invoice({
      invoiceNumber,
      sellerId: req.user.id,
      details: {
        amount: parseFloat(amount),
        issueDate: new Date(),
        dueDate: new Date(dueDate),
        description: description || 'Invoice payment'
      },
      financing: {
        requestedAmount: parseFloat(amount)
      },
      status: 'listed',
      documents,
      metadata: {
        source: 'web'
      }
    });

    await invoice.save();
    
    res.status(201).json({ 
      message: 'Invoice created successfully', 
      invoice: {
        _id: invoice._id,
        invoiceNumber: invoice.invoiceNumber,
        amount: invoice.details.amount,
        status: invoice.status,
        createdAt: invoice.createdAt
      }
    });
  } catch (error) {
    console.error('Invoice creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/invoices/:id/confirm', auth, requireRole(['buyer']), async (req, res) => {
  try {
    const { confirmed, notes } = req.body;
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    invoice.status = confirmed ? 'verified' : 'rejected';
    invoice.buyerConfirmation = {
      confirmed,
      notes,
      confirmedAt: new Date(),
      confirmedBy: req.user.id
    };
    
    await invoice.save();
    res.json({ message: 'Invoice confirmation updated', invoice });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/invoices/seller', auth, async (req, res) => {
  try {
    const invoices = await Invoice.find({ sellerId: req.user.id })
      .sort({ createdAt: -1 })
      .populate('investorId', 'name email');
    
    const transformedInvoices = invoices.map(invoice => ({
      _id: invoice._id,
      invoiceNumber: invoice.invoiceNumber,
      amount: invoice.details.amount,
      dueDate: invoice.details.dueDate,
      status: invoice.status,
      createdAt: invoice.createdAt,
      buyerName: invoice.buyerName || 'N/A',
      customerName: invoice.buyerName || 'N/A',
      discountedAmount: invoice.financing.fundedAmount
    }));
    
    res.json(transformedInvoices);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/invoices/marketplace', auth, async (req, res) => {
  try {
    const invoices = await Invoice.find({ 
      status: { $in: ['pending_buyer_confirmation', 'confirmed', 'listed'] },
      investorId: { $exists: false }
    })
    .populate('sellerId', 'name company profile')
    .sort({ createdAt: -1 });
    
    const marketplaceInvoices = invoices.map(invoice => ({
      _id: invoice._id,
      invoiceNumber: invoice.invoiceNumber,
      amount: invoice.details.amount,
      dueDate: invoice.details.dueDate,
      status: invoice.status,
      createdAt: invoice.createdAt,
      sellerId: {
        _id: invoice.sellerId._id,
        name: invoice.sellerId.profile?.firstName + ' ' + invoice.sellerId.profile?.lastName,
        company: invoice.sellerId.profile?.company
      },
      description: invoice.details.description,
      riskScore: invoice.riskAssessment?.score || 50,
      requestedAmount: invoice.financing.requestedAmount
    }));
    
    res.json(marketplaceInvoices);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/invoices/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    invoice.status = status;
    await invoice.save();
    res.json({ message: 'Invoice status updated', invoice });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/invoices/:id/fund', auth, requireRole(['investor']), async (req, res) => {
  try {
    const { discountedAmount } = req.body;
    const invoiceId = req.params.id;
    
    const invoice = await Invoice.findById(invoiceId).populate('sellerId', 'name email');
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    if (invoice.status !== 'verified' && invoice.status !== 'listed') {
      return res.status(400).json({ message: 'Invoice not available for funding' });
    }

    if (invoice.investorId) {
      return res.status(400).json({ message: 'Invoice already funded' });
    }

    invoice.status = 'funded';
    invoice.discountedAmount = parseFloat(discountedAmount);
    invoice.investorId = req.user.id;
    invoice.fundedAt = new Date();
    
    await invoice.save();

    const investment = new Investment({
      investorId: req.user.id,
      invoiceId: invoice._id,
      amount: parseFloat(discountedAmount),
      expectedReturn: invoice.details.amount
    });
    
    await investment.save();

    res.json({ 
      message: 'Invoice funded successfully', 
      invoice,
      investment,
      profit: invoice.details.amount - parseFloat(discountedAmount)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/marketplace/investors', auth, async (req, res) => {
  try {
    const investors = await User.find({ 
      role: 'investor',
      'kyc.status': 'verified'
    }).select('name email company');
    
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
    res.json({ message: 'Connection request sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'BLC Server Running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Invoice Financing Platform API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
      invoices: '/api/invoices/*',
      users: '/api/users/*',
      marketplace: '/api/marketplace/*'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
