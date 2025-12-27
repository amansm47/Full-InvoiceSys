const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Invoice = require('../models/Invoice');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const realtimeService = require('../services/realtime');
const fraudDetection = require('../utils/fraudDetection');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/invoices');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `invoice-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDFs, and documents allowed.'));
    }
  }
});

// Create new invoice
router.post('/create', auth, upload.array('documents', 5), async (req, res) => {
  try {
    const {
      invoiceNumber,
      buyerEmail,
      amount,
      issueDate,
      dueDate,
      description,
      items,
      requestedAmount,
      discountRate
    } = req.body;

    // Validate required fields
    if (!invoiceNumber || !buyerEmail || !amount || !issueDate || !dueDate || !description) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if seller is KYC verified
    const seller = await User.findById(req.user.id);
    if (seller.kyc.status !== 'verified') {
      return res.status(403).json({
        success: false,
        message: 'KYC verification required to create invoices'
      });
    }

    // Find buyer by email
    const buyer = await User.findOne({ email: buyerEmail, role: 'buyer' });
    if (!buyer) {
      return res.status(404).json({
        success: false,
        message: 'Buyer not found or not registered as buyer'
      });
    }

    // Check for duplicate invoice
    const existingInvoice = await Invoice.findOne({ invoiceNumber });
    if (existingInvoice) {
      return res.status(409).json({
        success: false,
        message: 'Invoice number already exists'
      });
    }

    // Process uploaded documents
    const documents = req.files ? req.files.map(file => ({
      type: 'invoice',
      filename: file.filename,
      originalName: file.originalname,
      url: `/uploads/invoices/${file.filename}`,
      size: file.size,
      uploadedBy: req.user.id
    })) : [];

    // Parse items if provided
    let parsedItems = [];
    if (items) {
      try {
        parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid items format'
        });
      }
    }

    // Create invoice
    const invoice = new Invoice({
      invoiceNumber,
      sellerId: req.user.id,
      buyerId: buyer._id,
      details: {
        amount: parseFloat(amount),
        issueDate: new Date(issueDate),
        dueDate: new Date(dueDate),
        description,
        items: parsedItems
      },
      financing: {
        requestedAmount: parseFloat(requestedAmount || amount),
        discountRate: parseFloat(discountRate || 10)
      },
      documents,
      status: 'pending_buyer_confirmation',
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        source: 'web'
      }
    });

    // Run fraud detection
    const fraudResult = await fraudDetection.checkInvoice(invoice, seller);
    invoice.verification.fraudCheck = fraudResult;

    await invoice.save();

    // Update seller statistics
    await seller.updateStats(parseFloat(amount));

    // Populate invoice for response
    await invoice.populate(['sellerId', 'buyerId']);

    // Send real-time notifications
    realtimeService.broadcastInvoiceUpdate(invoice, 'invoice-created');
    realtimeService.notifyUser(buyer._id, {
      type: 'invoice_confirmation_request',
      title: 'New Invoice Confirmation Required',
      message: `Invoice ${invoiceNumber} from ${seller.profile.company} requires your confirmation`,
      invoiceId: invoice._id
    });

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: invoice
    });

  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create invoice',
      error: error.message
    });
  }
});

// Get invoices with real-time filtering
router.get('/', auth, async (req, res) => {
  try {
    const {
      status,
      role,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search
    } = req.query;

    const user = await User.findById(req.user.id);
    const query = {};

    // Filter by user role
    if (user.role === 'seller') {
      query.sellerId = req.user.id;
    } else if (user.role === 'buyer') {
      query.buyerId = req.user.id;
    } else if (user.role === 'investor') {
      if (role === 'invested') {
        query.investorId = req.user.id;
      } else {
        query.status = { $in: ['confirmed', 'listed'] };
      }
    }

    // Additional filters
    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { invoiceNumber: { $regex: search, $options: 'i' } },
        { 'details.description': { $regex: search, $options: 'i' } }
      ];
    }

    const result = await Invoice.find(query)
      .populate([
        { path: 'sellerId', select: 'profile.company profile.firstName profile.lastName email' },
        { path: 'buyerId', select: 'profile.company profile.firstName profile.lastName email' },
        { path: 'investorId', select: 'profile.company profile.firstName profile.lastName email' }
      ])
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalCount = await Invoice.countDocuments(query);

    res.json({
      success: true,
      data: result,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalItems: totalCount,
        hasNext: (parseInt(page) * parseInt(limit)) < totalCount,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoices',
      error: error.message
    });
  }
});

// Get single invoice with full details
router.get('/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('sellerId', 'profile email statistics')
      .populate('buyerId', 'profile email statistics')
      .populate('investorId', 'profile email statistics')
      .populate('communications.from', 'profile.firstName profile.lastName')
      .populate('communications.to', 'profile.firstName profile.lastName');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Check access permissions
    const user = await User.findById(req.user.id);
    const hasAccess = 
      invoice.sellerId._id.toString() === req.user.id ||
      invoice.buyerId?._id.toString() === req.user.id ||
      invoice.investorId?._id.toString() === req.user.id ||
      (user.role === 'investor' && ['confirmed', 'listed'].includes(invoice.status));

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: invoice
    });

  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoice',
      error: error.message
    });
  }
});

// Buyer confirms invoice
router.post('/:id/confirm', auth, async (req, res) => {
  try {
    const { confirmed, notes } = req.body;
    
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Check if user is the buyer (compare with raw buyerId)
    const buyerIdStr = invoice.buyerId.toString();
    const userIdStr = req.user.id.toString();
    
    if (buyerIdStr !== userIdStr) {
      return res.status(403).json({
        success: false,
        message: 'Only the buyer can confirm this invoice'
      });
    }

    // Check if already confirmed
    if (invoice.verification.buyerConfirmed) {
      return res.status(400).json({
        success: false,
        message: 'Invoice already confirmed'
      });
    }

    // Populate for notifications
    await invoice.populate(['sellerId', 'buyerId']);

    if (confirmed) {
      await invoice.updateStatus('confirmed', req.user.id, notes);
      
      // Calculate risk score
      await invoice.calculateRiskScore();
      
      // Auto-list if risk score is acceptable
      if (invoice.riskAssessment.score >= 40) {
        await invoice.updateStatus('listed', req.user.id, 'Auto-listed after confirmation');
        realtimeService.broadcastNewInvoice(invoice);
      }

      // Notify seller
      realtimeService.notifyUser(invoice.sellerId._id, {
        type: 'invoice_confirmed',
        title: 'Invoice Confirmed',
        message: `Invoice ${invoice.invoiceNumber} has been confirmed by ${invoice.buyerId.profile.company}`,
        invoiceId: invoice._id
      });

    } else {
      await invoice.updateStatus('cancelled', req.user.id, notes || 'Rejected by buyer');
      
      // Notify seller
      realtimeService.notifyUser(invoice.sellerId._id, {
        type: 'invoice_rejected',
        title: 'Invoice Rejected',
        message: `Invoice ${invoice.invoiceNumber} has been rejected by ${invoice.buyerId.profile.company}`,
        invoiceId: invoice._id
      });
    }

    // Add communication record
    if (notes) {
      await invoice.addCommunication(req.user.id, invoice.sellerId._id, notes, 'update');
    }

    // Broadcast real-time update
    realtimeService.broadcastInvoiceUpdate(invoice, 'invoice-status-updated');

    res.json({
      success: true,
      message: confirmed ? 'Invoice confirmed successfully' : 'Invoice rejected',
      data: invoice
    });

  } catch (error) {
    console.error('Confirm invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm invoice',
      error: error.message
    });
  }
});

// Investor funds invoice
router.post('/:id/fund', auth, async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    
    const invoice = await Invoice.findById(req.params.id)
      .populate('sellerId')
      .populate('buyerId');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Check if invoice is available for funding
    if (!['confirmed', 'listed'].includes(invoice.status)) {
      return res.status(400).json({
        success: false,
        message: 'Invoice not available for funding'
      });
    }

    // Check if already funded
    if (invoice.investorId) {
      return res.status(400).json({
        success: false,
        message: 'Invoice already funded'
      });
    }

    const investor = await User.findById(req.user.id);
    if (investor.role !== 'investor') {
      return res.status(403).json({
        success: false,
        message: 'Only investors can fund invoices'
      });
    }

    // Validate funding amount
    const fundingAmount = parseFloat(amount);
    if (fundingAmount < invoice.financing.requestedAmount * 0.5) {
      return res.status(400).json({
        success: false,
        message: 'Funding amount too low'
      });
    }

    // Create funding transaction
    const transaction = new Transaction({
      invoiceId: invoice._id,
      sellerId: invoice.sellerId._id,
      investorId: req.user.id,
      type: 'funding',
      amount: fundingAmount,
      payment: {
        method: paymentMethod || 'bank_transfer'
      },
      audit: {
        initiatedBy: req.user.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    // Generate transaction ID before saving
    if (!transaction.transactionId) {
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substr(2, 5);
      transaction.transactionId = `TXN${timestamp}${random}`.toUpperCase();
    }

    await transaction.save();

    // Update invoice
    invoice.investorId = req.user.id;
    invoice.financing.fundedAmount = fundingAmount;
    invoice.financing.expectedReturn = invoice.details.amount;
    await invoice.updateStatus('funded', req.user.id);

    // Update investor statistics
    await investor.updateStats(fundingAmount, false);

    // Notify all parties
    realtimeService.notifyUser(invoice.sellerId._id, {
      type: 'invoice_funded',
      title: 'Invoice Funded',
      message: `Invoice ${invoice.invoiceNumber} has been funded for ₹${fundingAmount}`,
      invoiceId: invoice._id
    });

    realtimeService.notifyUser(invoice.buyerId._id, {
      type: 'invoice_funded',
      title: 'Invoice Funded',
      message: `Invoice ${invoice.invoiceNumber} has been funded. Payment due on ${invoice.details.dueDate.toDateString()}`,
      invoiceId: invoice._id
    });

    // Broadcast real-time updates
    realtimeService.broadcastInvoiceUpdate(invoice, 'invoice-funded');
    realtimeService.broadcastTransaction(transaction);

    res.json({
      success: true,
      message: 'Invoice funded successfully',
      data: {
        invoice,
        transaction: transaction.getSummary()
      }
    });

  } catch (error) {
    console.error('Fund invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fund invoice',
      error: error.message
    });
  }
});

// Get marketplace listings
router.get('/marketplace/listings', auth, async (req, res) => {
  try {
    const {
      minAmount,
      maxAmount,
      maxRisk,
      maxDays,
      page = 1,
      limit = 20,
      sortBy = 'createdAt'
    } = req.query;

    const query = {
      status: { $in: ['confirmed', 'listed'] },
      investorId: { $exists: false }
    };

    // Apply filters
    if (minAmount) {
      query['financing.requestedAmount'] = { $gte: parseFloat(minAmount) };
    }
    if (maxAmount) {
      query['financing.requestedAmount'] = { 
        ...query['financing.requestedAmount'],
        $lte: parseFloat(maxAmount) 
      };
    }
    if (maxRisk) {
      query['riskAssessment.score'] = { $gte: parseFloat(maxRisk) };
    }

    const invoices = await Invoice.find(query)
      .populate('sellerId', 'profile statistics')
      .populate('buyerId', 'profile statistics')
      .sort({ [sortBy]: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Invoice.countDocuments(query);

    const listings = invoices.map(invoice => invoice.getMarketplaceListing());

    res.json({
      success: true,
      data: listings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total
      }
    });

  } catch (error) {
    console.error('Get marketplace error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch marketplace listings',
      error: error.message
    });
  }
});

// Add communication to invoice
router.post('/:id/communicate', auth, async (req, res) => {
  try {
    const { message, recipientId, type = 'comment' } = req.body;
    
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Check access
    const hasAccess = [
      invoice.sellerId?.toString(),
      invoice.buyerId?.toString(),
      invoice.investorId?.toString()
    ].includes(req.user.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await invoice.addCommunication(req.user.id, recipientId, message, type);

    // Send real-time notification
    realtimeService.notifyUser(recipientId, {
      type: 'new_message',
      title: 'New Message',
      message: `New message on invoice ${invoice.invoiceNumber}`,
      invoiceId: invoice._id
    });

    res.json({
      success: true,
      message: 'Communication added successfully'
    });

  } catch (error) {
    console.error('Add communication error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add communication',
      error: error.message
    });
  }
});

module.exports = router;