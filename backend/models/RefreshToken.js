const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  deviceInfo: {
    userAgent: String,
    ipAddress: String,
    deviceId: String
  },
  lastUsed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for automatic cleanup
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
refreshTokenSchema.index({ userId: 1 });
refreshTokenSchema.index({ token: 1 });

// Method to check if token is expired
refreshTokenSchema.methods.isExpired = function() {
  return Date.now() >= this.expiresAt.getTime();
};

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);