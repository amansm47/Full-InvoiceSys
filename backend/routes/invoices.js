const express = require('express');
const crypto = require('crypto');
const Invoice = require('../models/Invoice');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get Seller's Invoices
router.get('/seller', auth, async (req, res) => {
  try {
    const invoices = await Invoice.find({ seller: req.user.userId })
      .populate('buyer', 'name email businessName')
      .populate('investor', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Public Invoices (for non-logged users on home page)
router.get('/public', async (req, res) => {
  try {
    const invoices = await Invoice.find({})
      .populate('seller', 'name businessName')
      .populate('buyer', 'email name')
      .select('invoiceNumber amount dueDate seller buyer status createdAt')
      .limit(8)
      .sort({ createdAt: -1 });
    
    const publicInvoices = invoices.map(invoice => ({
      id: invoice._id,
      invoiceNumber: invoice.invoiceNumber,
      amount: invoice.amount,
      dueDate: invoice.dueDate,
      sellerName: invoice.seller?.businessName || invoice.seller?.name || 'Business',
      buyerEmail: invoice.buyer?.email || 'buyer@company.com',
      status: invoice.status,
      createdAt: invoice.createdAt
    }));
    
    res.json(publicInvoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create Invoice (Seller)
router.post('/create', auth, async (req, res) => {
  try {
    console.log('Invoice creation request:', req.body);
    const { buyerEmail, amount, dueDate, invoiceNumber } = req.body;
    
    if (!buyerEmail || !amount || !dueDate || !invoiceNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Find buyer or create placeholder
    let buyer = await User.findOne({ email: buyerEmail });
    if (!buyer) {
      buyer = new User({
        email: buyerEmail,
        password: 'placeholder123',
        role: 'buyer',
        name: buyerEmail.split('@')[0],
        phone: 'Not provided',
        businessName: 'To be updated',
        walletAddress: '0x' + Date.now().toString(16),
        privateKey: 'placeholder'
      });
      await buyer.save();
    }
    
    // Generate invoice hash
    const invoiceHash = crypto.createHash('sha256')
      .update(`${invoiceNumber}-${amount}-${buyerEmail}-${Date.now()}`)
      .digest('hex');
    
    const invoice = new Invoice({
      invoiceNumber,
      amount: parseFloat(amount),
      dueDate: new Date(dueDate),
      seller: req.user.userId,
      buyer: buyer._id,
      invoiceHash,
      status: 'listed',
      buyerConfirmed: true,
      buyerConfirmedAt: new Date(),
      listedAt: new Date()
    });
    
    await invoice.save();
    
    // Real-time notification to investors
    const wsService = req.app.get('wsService');
    if (wsService) {
      wsService.notifyInvestors(invoice);
    }
    
    res.status(201).json({ 
      message: 'Invoice created and listed successfully',
      invoiceId: invoice._id,
      status: invoice.status
    });
  } catch (error) {
    console.error('Invoice creation error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate invoice detected' });
    }
    res.status(500).json({ message: error.message });
  }
});

// Buyer Confirmation
router.post('/:id/confirm', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    if (invoice.buyer.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    invoice.buyerConfirmed = true;
    invoice.buyerConfirmedAt = new Date();
    invoice.status = 'listed';
    invoice.listedAt = new Date();
    
    await invoice.save();
    
    // Real-time notification to investors about new listed invoice
    const wsService = req.app.get('wsService');
    if (wsService) {
      wsService.notifyInvestors(invoice);
    }
    
    res.json({ message: 'Invoice confirmed and listed for funding' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Listed Invoices (Investors)
router.get('/marketplace', auth, async (req, res) => {
  try {
    const invoices = await Invoice.find({ status: 'listed' })
      .populate('seller', 'name businessName businessType riskScore')
      .populate('buyer', 'name businessName businessType riskScore')
      .select('-fraudFlags -extractedData')
      .sort({ listedAt: -1 });
    
    const marketplace = invoices.map(invoice => {
      const daysToMaturity = Math.ceil((new Date(invoice.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
      const discountRate = 0.10; // 10% discount
      const discountedAmount = Math.floor(invoice.amount * (1 - discountRate));
      
      return {
        _id: invoice._id,
        invoiceNumber: invoice.invoiceNumber,
        amount: invoice.amount,
        discountedAmount,
        dueDate: invoice.dueDate,
        seller: {
          _id: invoice.seller._id,
          name: invoice.seller.name || invoice.seller.businessName,
          businessType: invoice.seller.businessType
        },
        buyer: {
          _id: invoice.buyer._id,
          name: invoice.buyer.name || invoice.buyer.businessName,
          businessType: invoice.buyer.businessType
        },
        riskScore: invoice.riskScore || Math.floor(Math.random() * 100),
        expectedROI: ((invoice.amount - discountedAmount) / discountedAmount * 100),
        tenure: daysToMaturity,
        status: invoice.status,
        listedAt: invoice.listedAt
      };
    });
    
    res.json(marketplace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Auto-list all created invoices (for demo)
router.post('/auto-list', auth, async (req, res) => {
  try {
    const result = await Invoice.updateMany(
      { status: 'created' },
      { 
        status: 'listed',
        buyerConfirmed: true,
        buyerConfirmedAt: new Date(),
        listedAt: new Date()
      }
    );
    
    res.json({ message: `${result.modifiedCount} invoices auto-listed` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fund Invoice (Investor)
router.post('/:id/fund', auth, async (req, res) => {
  try {
    const { discountedAmount } = req.body;
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice || invoice.status !== 'listed') {
      return res.status(400).json({ message: 'Invoice not available for funding' });
    }
    
    invoice.investor = req.user.userId;
    invoice.discountedAmount = discountedAmount;
    invoice.status = 'funded';
    invoice.fundedAt = new Date();
    
    await invoice.save();
    
    // Real-time notification to seller about funding
    const wsService = req.app.get('wsService');
    if (wsService) {
      wsService.notifySellerFunded(invoice.seller.toString(), {
        invoiceId: invoice._id,
        amount: discountedAmount,
        investor: req.user.userId
      });
    }
    
    res.json({ message: 'Invoice funded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Repay Invoice (Buyer)
router.post('/:id/repay', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice || invoice.status !== 'funded') {
      return res.status(400).json({ message: 'Invoice not available for repayment' });
    }
    
    if (invoice.buyer.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    invoice.status = 'completed';
    invoice.completedAt = new Date();
    
    await invoice.save();
    
    res.json({ message: 'Invoice repaid successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

function calculateROI(amount, dueDate) {
  const days = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
  const annualRate = 0.12; // 12% annual
  return (amount * annualRate * days) / 365;
}

module.exports = router;