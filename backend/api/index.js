const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');

dotenv.config();

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  isConnected = true;
};

const User = require('../models/User');
const Invoice = require('../models/Invoice');

const Investment = mongoose.models.Investment || mongoose.model('Investment', new mongoose.Schema({
  investorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
  amount: { type: Number, required: true },
  expectedReturn: { type: Number, required: true },
  actualReturn: Number,
  status: { type: String, enum: ['active', 'completed', 'defaulted'], default: 'active' }
}, { timestamps: true }));

const { authenticateToken } = require('../middleware/auth');
const auth = authenticateToken;

const requireRole = (roles) => (req, res, next) => {
  if (roles.includes(req.user.role)) next();
  else res.status(403).json({ message: 'Access denied' });
};

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use('/api/auth', require('../routes/auth'));

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
        stats: { totalInvoices, totalFunded, successRate, activeInvoices }
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

app.get('/health', (req, res) => res.json({ success: true }));
app.get('/', (req, res) => res.json({ message: 'API Running' }));

module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
