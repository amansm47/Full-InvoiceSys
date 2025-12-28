const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['seller', 'buyer', 'investor'],
    required: true
  },
  profile: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    company: { type: String, required: true },
    gstNumber: { type: String },
    panNumber: { type: String },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'India' }
    }
  },
  kyc: {
    status: {
      type: String,
      enum: ['pending', 'submitted', 'verified', 'rejected'],
      default: 'pending'
    },
    documents: [{
      type: { type: String, enum: ['pan', 'gst', 'bank', 'address'] },
      url: String,
      uploadedAt: { type: Date, default: Date.now }
    }],
    verifiedAt: Date,
    rejectionReason: String
  },
  wallet: {
    address: String,
    balance: { type: Number, default: 0 },
    encryptedPrivateKey: String
  },
  statistics: {
    totalInvoices: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    successfulTransactions: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 }
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    investmentLimits: {
      minAmount: { type: Number, default: 1000 },
      maxAmount: { type: Number, default: 100000 },
      riskTolerance: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
    }
  },
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'kyc.status': 1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Hash password before saving (only for non-Firebase users)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Check if account is locked
userSchema.methods.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Increment login attempts
userSchema.methods.incLoginAttempts = function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Update statistics
userSchema.methods.updateStats = function(invoiceAmount, isSuccessful = false) {
  this.statistics.totalInvoices += 1;
  this.statistics.totalAmount += invoiceAmount;
  if (isSuccessful) {
    this.statistics.successfulTransactions += 1;
  }
  return this.save();
};

// Get public profile
userSchema.methods.getPublicProfile = function() {
  return {
    _id: this._id,
    email: this.email,
    role: this.role,
    fullName: this.fullName,
    company: this.profile.company,
    kycStatus: this.kyc.status,
    rating: this.statistics.rating,
    ratingCount: this.statistics.ratingCount,
    totalTransactions: this.statistics.successfulTransactions,
    memberSince: this.createdAt
  };
};

module.exports = mongoose.model('User', userSchema);