const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  
  // Related entities
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
    required: true
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  investorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Transaction Details
  type: {
    type: String,
    enum: ['funding', 'repayment', 'fee', 'refund', 'penalty'],
    required: true
  },
  
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  
  currency: {
    type: String,
    default: 'INR'
  },

  // Status Management
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },

  // Payment Details
  payment: {
    method: {
      type: String,
      enum: ['bank_transfer', 'upi', 'wallet', 'blockchain', 'check'],
      required: true
    },
    gateway: String,
    gatewayTransactionId: String,
    gatewayResponse: mongoose.Schema.Types.Mixed,
    
    // Bank details
    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      bankName: String,
      accountHolderName: String
    },
    
    // UPI details
    upiDetails: {
      vpa: String,
      transactionRef: String
    }
  },

  // Blockchain Integration
  blockchain: {
    network: { type: String, default: 'ethereum' },
    contractAddress: String,
    transactionHash: String,
    blockNumber: Number,
    gasPrice: String,
    gasUsed: Number,
    gasLimit: Number,
    confirmations: { type: Number, default: 0 },
    events: [{
      event: String,
      args: mongoose.Schema.Types.Mixed,
      transactionHash: String,
      blockNumber: Number
    }]
  },

  // Fee Breakdown
  fees: {
    platform: { type: Number, default: 0 },
    processing: { type: Number, default: 0 },
    gas: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },

  // Timing
  timing: {
    initiatedAt: { type: Date, default: Date.now },
    processedAt: Date,
    completedAt: Date,
    failedAt: Date,
    expectedCompletionAt: Date
  },

  // Error Handling
  error: {
    code: String,
    message: String,
    details: mongoose.Schema.Types.Mixed,
    retryCount: { type: Number, default: 0 },
    lastRetryAt: Date
  },

  // Notifications
  notifications: {
    sent: { type: Boolean, default: false },
    sentAt: Date,
    channels: [{ type: String, enum: ['email', 'sms', 'push', 'webhook'] }],
    recipients: [String]
  },

  // Audit Trail
  audit: {
    initiatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ipAddress: String,
    userAgent: String,
    source: { type: String, enum: ['web', 'mobile', 'api', 'system'], default: 'web' }
  },

  // Reconciliation
  reconciliation: {
    status: { type: String, enum: ['pending', 'matched', 'unmatched'], default: 'pending' },
    matchedAt: Date,
    bankStatementRef: String,
    discrepancy: {
      amount: Number,
      reason: String,
      resolvedAt: Date
    }
  },

  // Metadata
  metadata: {
    description: String,
    reference: String,
    tags: [String],
    priority: { type: String, enum: ['low', 'normal', 'high'], default: 'normal' },
    category: String
  }
}, {
  timestamps: true
});

// Indexes for performance
transactionSchema.index({ transactionId: 1 });
transactionSchema.index({ invoiceId: 1, type: 1 });
transactionSchema.index({ sellerId: 1, status: 1 });
transactionSchema.index({ buyerId: 1, status: 1 });
transactionSchema.index({ investorId: 1, status: 1 });
transactionSchema.index({ status: 1, createdAt: -1 });
transactionSchema.index({ 'blockchain.transactionHash': 1 });
transactionSchema.index({ 'payment.gatewayTransactionId': 1 });

// Generate unique transaction ID
transactionSchema.pre('save', function(next) {
  if (!this.transactionId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.transactionId = `TXN${timestamp}${random}`.toUpperCase();
  }
  
  // Calculate total fees
  this.fees.total = (this.fees.platform || 0) + (this.fees.processing || 0) + (this.fees.gas || 0);
  
  next();
});

// Method to update status with timing
transactionSchema.methods.updateStatus = function(newStatus, details = {}) {
  const oldStatus = this.status;
  this.status = newStatus;
  
  const now = new Date();
  
  switch (newStatus) {
    case 'processing':
      this.timing.processedAt = now;
      break;
    case 'completed':
      this.timing.completedAt = now;
      break;
    case 'failed':
      this.timing.failedAt = now;
      if (details.error) {
        this.error = {
          ...this.error,
          ...details.error,
          retryCount: (this.error.retryCount || 0) + 1,
          lastRetryAt: now
        };
      }
      break;
  }
  
  return this.save();
};

// Method to add blockchain transaction
transactionSchema.methods.addBlockchainTransaction = function(txHash, contractAddress, gasUsed) {
  this.blockchain.transactionHash = txHash;
  this.blockchain.contractAddress = contractAddress;
  this.blockchain.gasUsed = gasUsed;
  
  return this.save();
};

// Method to confirm blockchain transaction
transactionSchema.methods.confirmBlockchainTransaction = function(blockNumber, confirmations) {
  this.blockchain.blockNumber = blockNumber;
  this.blockchain.confirmations = confirmations;
  
  if (confirmations >= 12) { // Consider confirmed after 12 blocks
    this.updateStatus('completed');
  }
  
  return this.save();
};

// Method to calculate net amount (after fees)
transactionSchema.methods.getNetAmount = function() {
  return this.amount - this.fees.total;
};

// Method to retry failed transaction
transactionSchema.methods.retry = function() {
  if (this.status !== 'failed') {
    throw new Error('Can only retry failed transactions');
  }
  
  this.status = 'pending';
  this.error.retryCount = (this.error.retryCount || 0) + 1;
  this.error.lastRetryAt = new Date();
  
  return this.save();
};

// Method to get transaction summary
transactionSchema.methods.getSummary = function() {
  return {
    transactionId: this.transactionId,
    type: this.type,
    amount: this.amount,
    netAmount: this.getNetAmount(),
    status: this.status,
    method: this.payment.method,
    initiatedAt: this.timing.initiatedAt,
    completedAt: this.timing.completedAt,
    blockchain: {
      hash: this.blockchain.transactionHash,
      confirmations: this.blockchain.confirmations
    }
  };
};

// Static method to get transaction statistics
transactionSchema.statics.getStatistics = async function(userId, role) {
  const matchStage = {};
  
  if (role === 'seller') matchStage.sellerId = userId;
  else if (role === 'buyer') matchStage.buyerId = userId;
  else if (role === 'investor') matchStage.investorId = userId;
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        avgAmount: { $avg: '$amount' }
      }
    }
  ]);
};

module.exports = mongoose.model('Transaction', transactionSchema);