const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const http = require('http');
const socketIo = require('socket.io');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

const PORT = process.env.PORT || 5001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads', { recursive: true });
}

// MongoDB connection with better error handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/invoice-finance', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Real-time Socket.IO
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);
  
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    connectedUsers.set(userId, socket.id);
    console.log(`👤 User ${userId} joined room`);
  });
  
  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
    // Remove from connected users
    for (let [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
  });
});

// Real-time notification helpers
const emitToUser = (userId, event, data) => {
  io.to(`user-${userId}`).emit(event, data);
  console.log(`📡 Emitted ${event} to user ${userId}`);
};

const emitToRole = (role, event, data) => {
  io.emit(`${role}-update`, data);
  console.log(`📡 Emitted ${event} to all ${role}s`);
};

// Enhanced Schemas
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['seller', 'buyer', 'investor'], required: true },
  company: { type: String, trim: true },
  phone: { type: String, trim: true },
  address: { type: String, trim: true },
  kycStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  kycDocuments: [{ type: String }],
  profileImage: { type: String },
  settings: {
    emailNotifications: { type: Boolean, default: true },
    smsAlerts: { type: Boolean, default: false },
    pushNotifications: { type: Boolean, default: true },
    weeklyReports: { type: Boolean, default: true }
  },
  lastLogin: { type: Date },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true, trim: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  buyerName: { type: String, required: true, trim: true },
  buyerEmail: { type: String, required: true, lowercase: true, trim: true },
  amount: { type: Number, required: true, min: 1000 },
  dueDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'verified', 'funded', 'repaid', 'rejected', 'overdue'], 
    default: 'pending' 
  },
  documents: [{ type: String }],
  discountedAmount: { type: Number },
  investorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fundedAt: { type: Date },
  repaidAt: { type: Date },
  description: { type: String, trim: true },
  category: { type: String, trim: true },
  riskScore: { type: Number, min: 0, max: 100, default: 50 },
  interestRate: { type: Number, min: 0, max: 50 },
  paymentTerms: { type: String },
  currency: { type: String, default: 'INR' }
}, { timestamps: true });

const investmentSchema = new mongoose.Schema({
  investorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
  amount: { type: Number, required: true, min: 1000 },
  expectedReturn: { type: Number, required: true },
  actualReturn: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'completed', 'defaulted'], default: 'active' },
  roi: { type: Number },
  maturityDate: { type: Date },
  notes: { type: String }
}, { timestamps: true });

// Models
const User = mongoose.model('User', userSchema);
const Invoice = mongoose.model('Invoice', invoiceSchema);
const Investment = mongoose.model('Investment', investmentSchema);

// Enhanced Auth middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    req.user = { ...decoded, userData: user };
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Enhanced file upload with validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images and documents are allowed'));
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// AUTH ROUTES
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, company, phone, address } = req.body;
    
    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      company,
      phone,
      address,
      kycStatus: 'pending'
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    // Real-time notification
    emitToUser(user._id, 'welcome', {
      message: 'Welcome to InvoiceFinance! Complete your KYC to get started.',
      user: user
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
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
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
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
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});

// USER ROUTES
app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/users/dashboard', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;

    if (userRole === 'seller') {
      // Get all seller's invoices
      const allInvoices = await Invoice.find({ sellerId: userId });
      const totalInvoices = allInvoices.length;
      
      // Calculate funded invoices
      const fundedInvoices = allInvoices.filter(inv => inv.status === 'funded');
      const totalFunded = fundedInvoices.reduce((sum, inv) => sum + (inv.discountedAmount || 0), 0);
      
      // Calculate success rate
      const successRate = totalInvoices > 0 ? Math.round((fundedInvoices.length / totalInvoices) * 100) : 0;
      
      // Active invoices (pending + verified)
      const activeInvoices = allInvoices.filter(inv => ['pending', 'verified'].includes(inv.status)).length;
      
      // Monthly data
      const currentMonth = new Date();
      currentMonth.setDate(1);
      const monthlyInvoices = allInvoices.filter(inv => inv.createdAt >= currentMonth);
      const monthlyRevenue = monthlyInvoices
        .filter(inv => inv.status === 'funded')
        .reduce((sum, inv) => sum + (inv.discountedAmount || 0), 0);
      
      // Get unique customers
      const uniqueCustomers = [...new Set(allInvoices.map(inv => inv.buyerEmail))].length;

      res.json({
        success: true,
        stats: {
          totalInvoices,
          totalFunded,
          successRate,
          activeInvoices,
          monthlyRevenue,
          totalCustomers: uniqueCustomers,
          avgFundingTime: '2.5 days'
        },
        recentActivity: allInvoices.slice(-5).reverse()
      });
    } 
    
    else if (userRole === 'investor') {
      // Get all investments
      const investments = await Investment.find({ investorId: userId }).populate('invoiceId');
      const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
      
      // Calculate returns
      const completedInvestments = investments.filter(inv => inv.status === 'completed');
      const actualReturns = completedInvestments.reduce((sum, inv) => sum + (inv.actualReturn || 0), 0);
      
      // Active investments
      const activeInvestments = investments.filter(inv => inv.status === 'active').length;
      
      // Calculate ROI
      const avgROI = totalInvested > 0 ? ((actualReturns / totalInvested) * 100) : 0;
      
      // Portfolio value
      const portfolioValue = totalInvested + actualReturns;
      
      // Success rate
      const successRate = investments.length > 0 ? 
        Math.round((completedInvestments.length / investments.length) * 100) : 0;

      res.json({
        success: true,
        stats: {
          totalInvested,
          actualReturns,
          activeInvestments,
          avgROI: avgROI.toFixed(1),
          portfolioValue,
          successRate
        },
        recentInvestments: investments.slice(-5).reverse()
      });
    }
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// INVOICE ROUTES
app.post('/api/invoices/create', authenticateToken, upload.array('documents', 5), async (req, res) => {
  try {
    const { invoiceNumber, buyerName, buyerEmail, amount, dueDate, description, category } = req.body;
    
    // Validation
    if (!invoiceNumber || !buyerName || !buyerEmail || !amount || !dueDate) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    if (parseFloat(amount) < 1000) {
      return res.status(400).json({ message: 'Invoice amount must be at least ₹1,000' });
    }
    
    // Check for duplicate invoice number
    const existingInvoice = await Invoice.findOne({ invoiceNumber });
    if (existingInvoice) {
      return res.status(400).json({ message: 'Invoice number already exists' });
    }

    // Process uploaded files
    const documents = req.files ? req.files.map(file => file.filename) : [];

    // Create invoice
    const invoice = new Invoice({
      invoiceNumber,
      sellerId: req.user.userId,
      buyerName,
      buyerEmail,
      amount: parseFloat(amount),
      dueDate: new Date(dueDate),
      documents,
      description,
      category,
      status: 'pending', // Start as pending, then verify
      riskScore: Math.floor(Math.random() * 30) + 20, // Mock risk calculation
      interestRate: Math.floor(Math.random() * 5) + 8 // 8-12%
    });

    await invoice.save();
    
    // Auto-verify for demo (in production, this would be manual/automated verification)
    setTimeout(async () => {
      invoice.status = 'verified';
      await invoice.save();
      
      // Real-time notifications
      emitToUser(req.user.userId, 'invoice-verified', {
        message: `Invoice ${invoice.invoiceNumber} has been verified and is now available for funding!`,
        invoice: invoice
      });
      
      // Notify all investors about new marketplace opportunity
      emitToRole('investor', 'new-marketplace-invoice', {
        message: 'New investment opportunity available!',
        invoice: invoice
      });
    }, 3000); // 3 second delay for demo
    
    // Immediate notification to seller
    emitToUser(req.user.userId, 'invoice-created', {
      message: `Invoice ${invoice.invoiceNumber} created successfully! Verification in progress...`,
      invoice: invoice
    });
    
    res.status(201).json({ 
      success: true, 
      message: 'Invoice created successfully', 
      invoice 
    });
  } catch (error) {
    console.error('Invoice creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/invoices/seller', authenticateToken, async (req, res) => {
  try {
    const invoices = await Invoice.find({ sellerId: req.user.userId })
      .sort({ createdAt: -1 })
      .populate('investorId', 'name email company');
    
    res.json({ success: true, invoices });
  } catch (error) {
    console.error('Get seller invoices error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/invoices/marketplace', authenticateToken, async (req, res) => {
  try {
    const invoices = await Invoice.find({ 
      status: 'verified',
      investorId: { $exists: false }
    })
    .populate('sellerId', 'name company kycStatus')
    .sort({ createdAt: -1 });
    
    res.json({ success: true, invoices });
  } catch (error) {
    console.error('Get marketplace error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/invoices/:id/fund', authenticateToken, async (req, res) => {
  try {
    const { discountedAmount } = req.body;
    const invoiceId = req.params.id;
    
    if (!discountedAmount || parseFloat(discountedAmount) < 1000) {
      return res.status(400).json({ message: 'Invalid funding amount' });
    }
    
    const invoice = await Invoice.findById(invoiceId).populate('sellerId', 'name email');
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    if (invoice.status !== 'verified') {
      return res.status(400).json({ message: 'Invoice not available for funding' });
    }

    if (invoice.sellerId._id.toString() === req.user.userId) {
      return res.status(400).json({ message: 'Cannot fund your own invoice' });
    }

    // Update invoice
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
      expectedReturn: invoice.amount,
      roi: ((invoice.amount - parseFloat(discountedAmount)) / parseFloat(discountedAmount) * 100).toFixed(2),
      maturityDate: invoice.dueDate
    });
    
    await investment.save();
    
    // Real-time notifications
    emitToUser(invoice.sellerId._id, 'invoice-funded', {
      message: `🎉 Your invoice ${invoice.invoiceNumber} has been funded for ₹${discountedAmount.toLocaleString()}!`,
      invoice: invoice,
      amount: discountedAmount
    });
    
    emitToUser(req.user.userId, 'investment-created', {
      message: `✅ Successfully invested ₹${discountedAmount.toLocaleString()} in invoice ${invoice.invoiceNumber}!`,
      investment: investment,
      invoice: invoice
    });
    
    // Update marketplace for other investors
    emitToRole('investor', 'marketplace-update', {
      action: 'remove',
      invoiceId: invoice._id,
      message: 'Invoice has been funded by another investor'
    });

    res.json({ 
      success: true, 
      message: 'Invoice funded successfully', 
      invoice, 
      investment 
    });
  } catch (error) {
    console.error('Fund invoice error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PORTFOLIO ROUTES
app.get('/api/users/portfolio', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'investor') {
      return res.status(403).json({ message: 'Access denied - Investors only' });
    }
    
    const investments = await Investment.find({ investorId: req.user.userId })
      .populate({
        path: 'invoiceId',
        populate: {
          path: 'sellerId',
          select: 'name company kycStatus'
        }
      })
      .sort({ createdAt: -1 });
    
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalReturns = investments.reduce((sum, inv) => sum + (inv.actualReturn || 0), 0);
    const activeInvestments = investments.filter(inv => inv.status === 'active');
    
    res.json({
      success: true,
      totalInvested,
      actualReturns: totalReturns,
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
    console.error('Portfolio error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// MARKETPLACE ROUTES
app.get('/api/marketplace/investors', authenticateToken, async (req, res) => {
  try {
    const investors = await User.find({ 
      role: 'investor',
      kycStatus: 'verified',
      isActive: true
    }).select('name email company createdAt');
    
    // Add calculated data for each investor
    const investorsWithData = await Promise.all(investors.map(async (investor) => {
      const investments = await Investment.find({ investorId: investor._id });
      const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
      const avgInvestment = investments.length > 0 ? totalInvested / investments.length : 50000;
      
      return {
        ...investor.toObject(),
        interestRate: '8-12%',
        minAmount: Math.floor(avgInvestment * 0.5),
        maxAmount: Math.floor(avgInvestment * 2),
        responseTime: '24 hours',
        rating: (4.5 + Math.random() * 0.5).toFixed(1),
        totalInvestments: investments.length,
        successRate: 95 + Math.floor(Math.random() * 5)
      };
    }));
    
    res.json({ success: true, investors: investorsWithData });
  } catch (error) {
    console.error('Get investors error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ANALYTICS ROUTES
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
    } 
    
    else if (userRole === 'investor') {
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
    
    res.json({ success: true, analytics: analyticsData, period });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.IO enabled for real-time updates`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
  console.log(`📁 File uploads: http://localhost:${PORT}/uploads`);
});

module.exports = { app, io };