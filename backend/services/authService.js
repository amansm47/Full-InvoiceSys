const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const OTP = require('../models/OTP');

class AuthService {
  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
    this.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret';
    this.ACCESS_TOKEN_EXPIRY = '15m';
    this.REFRESH_TOKEN_EXPIRY = '7d';
  }

  // Generate access token
  generateAccessToken(userId, role) {
    return jwt.sign(
      { id: userId, role },
      this.JWT_SECRET,
      { expiresIn: this.ACCESS_TOKEN_EXPIRY }
    );
  }

  // Generate refresh token
  async generateRefreshToken(userId, deviceInfo = {}) {
    const token = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const refreshToken = new RefreshToken({
      token,
      userId,
      expiresAt,
      deviceInfo
    });

    await refreshToken.save();
    return token;
  }

  // Generate OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Create OTP record
  async createOTP(userId, email, type, ipAddress, userAgent) {
    // Invalidate existing OTPs of same type
    await OTP.updateMany(
      { userId, type, isUsed: false },
      { isUsed: true }
    );

    const otp = this.generateOTP();
    const otpRecord = new OTP({
      userId,
      email,
      otp,
      type,
      ipAddress,
      userAgent
    });

    await otpRecord.save();
    return otp;
  }

  // Verify OTP
  async verifyOTP(email, otp, type) {
    const otpRecord = await OTP.findOne({
      email,
      otp,
      type,
      isUsed: false
    });

    if (!otpRecord) {
      return { success: false, message: 'Invalid OTP' };
    }

    if (!otpRecord.isValid()) {
      return { success: false, message: 'OTP expired or invalid' };
    }

    // Mark as used
    otpRecord.isUsed = true;
    await otpRecord.save();

    return { success: true, userId: otpRecord.userId };
  }

  // Verify access token
  verifyAccessToken(token) {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  // Verify refresh token
  async verifyRefreshToken(token) {
    const refreshToken = await RefreshToken.findOne({
      token,
      isActive: true
    }).populate('userId');

    if (!refreshToken || refreshToken.isExpired()) {
      throw new Error('Invalid or expired refresh token');
    }

    // Update last used
    refreshToken.lastUsed = new Date();
    await refreshToken.save();

    return refreshToken;
  }

  // Refresh access token
  async refreshAccessToken(refreshToken) {
    const tokenRecord = await this.verifyRefreshToken(refreshToken);
    const user = tokenRecord.userId;

    if (!user || !user.isActive) {
      throw new Error('User not found or inactive');
    }

    return this.generateAccessToken(user._id, user.role);
  }

  // Revoke refresh token
  async revokeRefreshToken(token) {
    await RefreshToken.updateOne(
      { token },
      { isActive: false }
    );
  }

  // Revoke all user tokens
  async revokeAllUserTokens(userId) {
    await RefreshToken.updateMany(
      { userId },
      { isActive: false }
    );
  }

  // Generate secure password hash
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  }

  // Verify password
  async verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  // Generate secure session ID
  generateSessionId() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Validate password strength
  validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    
    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters long`);
    }
    if (!hasUpperCase) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!hasLowerCase) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!hasNumbers) {
      errors.push('Password must contain at least one number');
    }
    if (!hasSpecialChar) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
      strength: this.calculatePasswordStrength(password)
    };
  }

  // Calculate password strength
  calculatePasswordStrength(password) {
    let score = 0;
    
    // Length
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Character types
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Patterns
    if (!/(.)\1{2,}/.test(password)) score += 1; // No repeated characters
    if (!/012|123|234|345|456|567|678|789|890/.test(password)) score += 1; // No sequences
    
    if (score <= 3) return 'weak';
    if (score <= 5) return 'medium';
    return 'strong';
  }

  // Check for suspicious activity
  async checkSuspiciousActivity(userId, ipAddress, userAgent) {
    const recentLogins = await RefreshToken.find({
      userId,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    const uniqueIPs = new Set(recentLogins.map(login => login.deviceInfo?.ipAddress));
    const uniqueDevices = new Set(recentLogins.map(login => login.deviceInfo?.userAgent));

    return {
      multipleIPs: uniqueIPs.size > 3,
      multipleDevices: uniqueDevices.size > 2,
      rapidLogins: recentLogins.length > 10,
      newDevice: !recentLogins.some(login => 
        login.deviceInfo?.userAgent === userAgent && 
        login.deviceInfo?.ipAddress === ipAddress
      )
    };
  }

  // Clean expired tokens
  async cleanExpiredTokens() {
    await RefreshToken.deleteMany({
      $or: [
        { expiresAt: { $lt: new Date() } },
        { isActive: false }
      ]
    });

    await OTP.deleteMany({
      $or: [
        { expiresAt: { $lt: new Date() } },
        { isUsed: true }
      ]
    });
  }
}

module.exports = new AuthService();