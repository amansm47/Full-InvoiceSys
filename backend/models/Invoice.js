const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  investorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Invoice Details
  details: {
    amount: { type: Number, required: true, min: 1000 },
    currency: { type: String, default: 'INR' },
    issueDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    description: { type: String, required: true },
    items: [{
      description: String,
      quantity: Number,
      rate: Number,
      amount: Number
    }],
    taxes: {
      cgst: { type: Number, default: 0 },
      sgst: { type: Number, default: 0 },
      igst: { type: Number, default: 0 },
      total: { type: Number, default: 0 }
    }
  },

  // Status Management
  status: {
    type: String,
    enum: ['draft', 'pending_buyer_confirmation', 'confirmed', 'listed', 'funded', 'repaid', 'defaulted', 'cancelled'],
    default: 'draft'
  },
  
  // Workflow Tracking
  workflow: {
    createdAt: { type: Date, default: Date.now },
    buyerConfirmedAt: Date,
    listedAt: Date,
    fundedAt: Date,
    repaidAt: Date,
    statusHistory: [{
      status: String,
      timestamp: { type: Date, default: Date.now },
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      notes: String
    }]
  },

  // Financial Terms
  financing: {
    requestedAmount: { type: Number, required: true },
    discountRate: { type: Number, min: 0, max: 50 }, // percentage
    fundedAmount: Number,
    expectedReturn: Number,
    actualReturn: Number,
    fees: {
      platform: { type: Number, default: 0 },
      processing: { type: Number, default: 0 }
    }
  },

  // Risk Assessment
  riskAssessment: {
    score: { type: Number, min: 0, max: 100 },
    factors: [{
      factor: String,
      weight: Number,
      score: Number
    }],
    category: { type: String, enum: ['low', 'medium', 'high'] },
    assessedAt: Date,
    assessedBy: String
  },

  // Documents
  documents: [{
    type: { type: String, enum: ['invoice', 'purchase_order', 'delivery_receipt', 'contract'] },
    filename: String,
    originalName: String,
    url: String,
    size: Number,
    uploadedAt: { type: Date, default: Date.now },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],

  // Verification
  verification: {
    buyerConfirmed: { type: Boolean, default: false },
    buyerConfirmedAt: Date,
    buyerNotes: String,
    fraudCheck: {
      status: { type: String, enum: ['pending', 'passed', 'failed'], default: 'pending' },
      checkedAt: Date,
      flags: [String]
    },
    duplicateCheck: {
      status: { type: String, enum: ['pending', 'passed', 'failed'], default: 'pending' },
      checkedAt: Date,
      similarInvoices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' }]
    }
  },

  // Blockchain Integration
  blockchain: {
    contractAddress: String,
    transactionHash: String,
    blockNumber: Number,
    gasUsed: Number,
    events: [{
      event: String,
      transactionHash: String,
      blockNumber: Number,
      timestamp: Date
    }]
  },

  // Communication
  communications: [{
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    timestamp: { type: Date, default: Date.now },
    type: { type: String, enum: ['comment', 'query', 'update'] }
  }],

  // Metadata
  metadata: {
    ipAddress: String,
    userAgent: String,
    source: { type: String, enum: ['web', 'mobile', 'api'], default: 'web' },
    tags: [String],
    priority: { type: String, enum: ['low', 'normal', 'high'], default: 'normal' }
  }
}, {
  timestamps: true
});

// Indexes for performance
invoiceSchema.index({ sellerId: 1, status: 1 });
invoiceSchema.index({ buyerId: 1, status: 1 });
invoiceSchema.index({ investorId: 1, status: 1 });
invoiceSchema.index({ status: 1, createdAt: -1 });
invoiceSchema.index({ 'details.dueDate': 1 });
invoiceSchema.index({ invoiceNumber: 1 });
invoiceSchema.index({ 'financing.requestedAmount': 1 });

// Virtual for days until due
invoiceSchema.virtual('daysUntilDue').get(function() {
  const now = new Date();
  const due = new Date(this.details.dueDate);
  const diffTime = due - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for funding progress
invoiceSchema.virtual('fundingProgress').get(function() {
  if (!this.financing.fundedAmount || !this.financing.requestedAmount) return 0;
  return (this.financing.fundedAmount / this.financing.requestedAmount) * 100;
});

// Pre-save middleware to update status history
invoiceSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.workflow.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      updatedBy: this._updatedBy || null
    });
  }
  next();
});

// Method to update status with tracking
invoiceSchema.methods.updateStatus = function(newStatus, updatedBy, notes) {
  this.status = newStatus;
  this._updatedBy = updatedBy;
  
  // Update specific workflow timestamps
  switch (newStatus) {
    case 'confirmed':
      this.workflow.buyerConfirmedAt = new Date();
      this.verification.buyerConfirmed = true;
      this.verification.buyerConfirmedAt = new Date();
      break;
    case 'listed':
      this.workflow.listedAt = new Date();
      break;
    case 'funded':
      this.workflow.fundedAt = new Date();
      break;
    case 'repaid':
      this.workflow.repaidAt = new Date();
      break;
  }
  
  if (notes) {
    this.workflow.statusHistory[this.workflow.statusHistory.length - 1].notes = notes;
  }
  
  return this.save();
};

// Method to add communication
invoiceSchema.methods.addCommunication = function(from, to, message, type = 'comment') {
  this.communications.push({
    from,
    to,
    message,
    type,
    timestamp: new Date()
  });
  return this.save();
};

// Method to calculate risk score
invoiceSchema.methods.calculateRiskScore = function() {
  let score = 50; // Base score
  
  // Amount factor
  if (this.details.amount > 100000) score -= 10;
  if (this.details.amount < 10000) score += 10;
  
  // Due date factor
  const daysUntilDue = this.daysUntilDue;
  if (daysUntilDue < 30) score -= 15;
  if (daysUntilDue > 90) score += 10;
  
  // Buyer verification
  if (this.verification.buyerConfirmed) score += 20;
  
  // Fraud check
  if (this.verification.fraudCheck.status === 'passed') score += 15;
  if (this.verification.fraudCheck.status === 'failed') score -= 30;
  
  this.riskAssessment.score = Math.max(0, Math.min(100, score));
  
  // Categorize risk
  if (this.riskAssessment.score >= 70) this.riskAssessment.category = 'low';
  else if (this.riskAssessment.score >= 40) this.riskAssessment.category = 'medium';
  else this.riskAssessment.category = 'high';
  
  this.riskAssessment.assessedAt = new Date();
  
  return this.save();
};

// Method to get marketplace listing data
invoiceSchema.methods.getMarketplaceListing = function() {
  return {
    _id: this._id,
    invoiceNumber: this.invoiceNumber,
    amount: this.details.amount,
    requestedAmount: this.financing.requestedAmount,
    discountRate: this.financing.discountRate,
    dueDate: this.details.dueDate,
    daysUntilDue: this.daysUntilDue,
    riskScore: this.riskAssessment.score,
    riskCategory: this.riskAssessment.category,
    seller: this.sellerId,
    buyer: this.buyerId,
    description: this.details.description,
    listedAt: this.workflow.listedAt,
    status: this.status
  };
};

module.exports = mongoose.model('Invoice', invoiceSchema);