const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/invoice-finance', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Real-time Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined room`);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Helper function to emit real-time updates
const emitToUser = (userId, event, data) => {
  io.to(`user-${userId}`).emit(event, data);
};

const emitToRole = (role, event, data) => {
  io.emit(`${role}-update`, data);
};

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['seller', 'buyer', 'investor'], required: true },
  company: String,
  phone: String,
  kycStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  kycDocuments: [String],
  settings: {
    emailNotifications: { type: Boolean, default: true },
    smsAlerts: { type: Boolean, default: false },
    pushNotifications: { type: Boolean, default: true },
    weeklyReports: { type: Boolean, default: true }
  }
}, { timestamps: true });

// Invoice Schema
const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  buyerName: { type: String, required: true },
  buyerEmail: { type: String, required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'verified', 'funded', 'repaid', 'rejected'], 
    default: 'pending' 
  },
  documents: [String],
  discountedAmount: Number,
  investorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fundedAt: Date,
  repaidAt: Date,
  description: String,
  category: String
}, { timestamps: true });

// Investment Schema
const investmentSchema = new mongoose.Schema({
  investorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
  amount: { type: Number, required: true },
  expectedReturn: { type: Number, required: true },
  actualReturn: Number,
  status: { type: String, enum: ['active', 'completed', 'defaulted'], default: 'active' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Invoice = mongoose.model('Invoice', invoiceSchema);
const Investment = mongoose.model('Investment', investmentSchema);

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
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
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, company, phone } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      company,
      phone
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        kycStatus: user.kycStatus
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        kycStatus: user.kycStatus
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// User Routes
app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/users/dashboard', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;

    if (userRole === 'seller') {
      const totalInvoices = await Invoice.countDocuments({ sellerId: userId });
      const fundedInvoices = await Invoice.find({ sellerId: userId, status: 'funded' });
      const totalFunded = fundedInvoices.reduce((sum, inv) => sum + (inv.discountedAmount || 0), 0);
      const successRate = totalInvoices > 0 ? Math.round((fundedInvoices.length / totalInvoices) * 100) : 0;
      const activeInvoices = await Invoice.countDocuments({ sellerId: userId, status: { $in: ['pending', 'verified'] } });
      
      // Get recent activity
      const recentInvoices = await Invoice.find({ sellerId: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('investorId', 'name');
      
      // Calculate monthly metrics
      const currentMonth = new Date();
      currentMonth.setDate(1);
      const monthlyInvoices = await Invoice.find({
        sellerId: userId,
        createdAt: { $gte: currentMonth }
      });
      const monthlyRevenue = monthlyInvoices
        .filter(inv => inv.status === 'funded')
        .reduce((sum, inv) => sum + (inv.discountedAmount || 0), 0);

      res.json({
        stats: {
          totalInvoices,
          totalFunded,
          successRate,
          activeInvoices,
          monthlyRevenue,
          avgFundingTime: '2.5 days',
          totalCustomers: await Invoice.distinct('buyerEmail', { sellerId: userId }).then(emails => emails.length)
        },
        recentActivity: recentInvoices,
        monthlyData: {
          revenue: monthlyRevenue,
          invoicesCreated: monthlyInvoices.length,
          fundingRate: monthlyInvoices.length > 0 ? 
            Math.round((monthlyInvoices.filter(inv => inv.status === 'funded').length / monthlyInvoices.length) * 100) : 0
        }
      });
    } else if (userRole === 'investor') {
      const investments = await Investment.find({ investorId: userId }).populate('invoiceId');
      const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
      const completedInvestments = investments.filter(inv => inv.status === 'completed');
      const actualReturns = completedInvestments.reduce((sum, inv) => sum + (inv.actualReturn || 0), 0);
      const activeInvestments = investments.filter(inv => inv.status === 'active').length;
      
      // Calculate portfolio performance
      const portfolioValue = totalInvested + actualReturns;
      const avgROI = totalInvested > 0 ? ((actualReturns / totalInvested) * 100) : 0;
      
      // Get monthly performance data
      const monthlyPerformance = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const monthInvestments = investments.filter(inv => 
          inv.createdAt >= monthStart && inv.createdAt <= monthEnd
        );
        const monthReturns = monthInvestments.reduce((sum, inv) => sum + (inv.actualReturn || 0), 0);
        
        monthlyPerformance.push({
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          returns: monthReturns,
          invested: monthInvestments.reduce((sum, inv) => sum + inv.amount, 0)
        });
      }

      res.json({
        stats: {
          totalInvested,
          actualReturns,
          activeInvestments,
          avgROI: avgROI.toFixed(1),
          portfolioValue,
          successRate: investments.length > 0 ? 
            Math.round((completedInvestments.length / investments.length) * 100) : 0
        },
        monthlyPerformance,
        recentInvestments: investments.slice(-5).reverse()
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Invoice Routes
app.post('/api/invoices/create', authenticateToken, upload.array('documents'), async (req, res) => {
  try {
    const { invoiceNumber, buyerName, buyerEmail, amount, dueDate, description, category } = req.body;
    
    const existingInvoice = await Invoice.findOne({ invoiceNumber });
    if (existingInvoice) {
      return res.status(400).json({ message: 'Invoice number already exists' });
    }

    const documents = req.files ? req.files.map(file => file.filename) : [];

    const invoice = new Invoice({
      invoiceNumber,
      sellerId: req.user.userId,
      buyerName,
      buyerEmail,
      amount: parseFloat(amount),
      dueDate: new Date(dueDate),
      documents,
      description,
      category
    });

    await invoice.save();
    
    // Real-time notification to seller
    emitToUser(req.user.userId, 'invoice-created', {
      message: 'Invoice created successfully',
      invoice: invoice
    });
    
    // Notify all investors about new invoice in marketplace (when verified)
    if (invoice.status === 'verified') {
      emitToRole('investor', 'new-marketplace-invoice', invoice);
    }
    
    res.status(201).json({ message: 'Invoice created successfully', invoice });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/invoices/seller', authenticateToken, async (req, res) => {
  try {
    const invoices = await Invoice.find({ sellerId: req.user.userId })
      .sort({ createdAt: -1 })
      .populate('investorId', 'name email');
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/invoices/marketplace', authenticateToken, async (req, res) => {
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

app.post('/api/invoices/:id/fund', authenticateToken, async (req, res) => {
  try {
    const { discountedAmount } = req.body;
    const invoiceId = req.params.id;
    
    const invoice = await Invoice.findById(invoiceId).populate('sellerId', 'name email');
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    if (invoice.status !== 'verified') {
      return res.status(400).json({ message: 'Invoice not available for funding' });
    }

    invoice.status = 'funded';
    invoice.discountedAmount = parseFloat(discountedAmount);
    invoice.investorId = req.user.userId;
    invoice.fundedAt = new Date();
    
    await invoice.save();

    // Create investment record
    const investment = new Investment({
      investorId: req.user.userId,
      invoiceId: invoice._id,
      amount: parseFloat(discountedAmount),
      expectedReturn: invoice.amount
    });
    
    await investment.save();
    
    // Real-time notifications
    emitToUser(invoice.sellerId._id, 'invoice-funded', {
      message: `Your invoice ${invoice.invoiceNumber} has been funded!`,
      invoice: invoice,
      amount: discountedAmount
    });
    
    emitToUser(req.user.userId, 'investment-created', {
      message: 'Investment successful!',
      investment: investment,
      invoice: invoice
    });
    
    // Update marketplace for other investors
    emitToRole('investor', 'marketplace-update', {
      action: 'remove',
      invoiceId: invoice._id
    });

    res.json({ message: 'Invoice funded successfully', invoice, investment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Analytics Routes
app.get('/api/users/analytics', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;
    const { period = '6m' } = req.query;
    
    const months = period === '6m' ? 6 : period === '1y' ? 12 : 3;
    const analyticsData = [];
    
    if (userRole === 'seller') {
      for (let i = months - 1; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const monthInvoices = await Invoice.find({
          sellerId: userId,
          createdAt: { $gte: monthStart, $lte: monthEnd }
        });
        
        const fundedInvoices = monthInvoices.filter(inv => inv.status === 'funded');
        const revenue = fundedInvoices.reduce((sum, inv) => sum + (inv.discountedAmount || 0), 0);
        
        analyticsData.push({
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          revenue,
          invoices: monthInvoices.length,
          funded: fundedInvoices.length,
          successRate: monthInvoices.length > 0 ? Math.round((fundedInvoices.length / monthInvoices.length) * 100) : 0
        });
      }
    } else if (userRole === 'investor') {
      for (let i = months - 1; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const monthInvestments = await Investment.find({
          investorId: userId,
          createdAt: { $gte: monthStart, $lte: monthEnd }
        });
        
        const invested = monthInvestments.reduce((sum, inv) => sum + inv.amount, 0);
        const returns = monthInvestments.reduce((sum, inv) => sum + (inv.actualReturn || 0), 0);
        
        analyticsData.push({
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          invested,
          returns,
          investments: monthInvestments.length,
          roi: invested > 0 ? ((returns / invested) * 100).toFixed(1) : 0
        });
      }
    }
    
    res.json({ analytics: analyticsData, period });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get investor portfolio
app.get('/api/users/portfolio', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'investor') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const investments = await Investment.find({ investorId: req.user.userId })
      .populate({
        path: 'invoiceId',
        populate: {
          path: 'sellerId',
          select: 'name company'
        }
      })
      .sort({ createdAt: -1 });
    
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalReturns = investments.reduce((sum, inv) => sum + (inv.actualReturn || 0), 0);
    const activeInvestments = investments.filter(inv => inv.status === 'active');
    
    res.json({
      investments,
      summary: {
        totalInvested,
        totalReturns,
        activeCount: activeInvestments.length,
        completedCount: investments.filter(inv => inv.status === 'completed').length,
        avgROI: totalInvested > 0 ? ((totalReturns / totalInvested) * 100).toFixed(1) : 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Marketplace Routes
app.get('/api/marketplace/investors', authenticateToken, async (req, res) => {
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

app.post('/api/marketplace/connect/:investorId', authenticateToken, async (req, res) => {
  try {
    // In a real app, this would create a connection request
    res.json({ message: 'Connection request sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO enabled for real-time updates`);
});

module.exports = { app, io };