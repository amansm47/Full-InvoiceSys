const express = require('express');
const authService = require('../services/authService');
const User = require('../models/User');
const OTP = require('../models/OTP');
const RefreshToken = require('../models/RefreshToken');
const {
  auth,
  requireRole,
  requireKYC,
  authRateLimit,
  loginRateLimit,
  otpRateLimit,
  passwordResetRateLimit,
  deviceFingerprint
} = require('../middleware/enhancedAuth');

const router = express.Router();

// Validate email format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Register new user
router.post('/register', authRateLimit, deviceFingerprint, async (req, res) => {
  try {
    const {
      email,
      password,
      confirmPassword,
      role,
      firstName,
      lastName,
      phone,
      company,
      gstNumber,
      panNumber
    } = req.body;

    // Validation
    if (!email || !password || !role || !firstName || !lastName || !phone || !company) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided',
        code: 'MISSING_FIELDS'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
        code: 'INVALID_EMAIL'
      });
    }

    // Enhanced password validation
    const passwordValidation = authService.validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Password does not meet security requirements',
        code: 'WEAK_PASSWORD',
        errors: passwordValidation.errors
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
        code: 'PASSWORD_MISMATCH'
      });
    }

    if (!['seller', 'buyer', 'investor'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified',
        code: 'INVALID_ROLE'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
        code: 'USER_EXISTS'
      });
    }

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password,
      role,
      profile: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        company: company.trim(),
        gstNumber: gstNumber?.trim(),
        panNumber: panNumber?.trim()
      }
    });

    await user.save();

    // Generate tokens
    const accessToken = authService.generateAccessToken(user._id, user.role);
    const refreshToken = await authService.generateRefreshToken(user._id, req.deviceInfo);

    // Generate email verification OTP
    const emailOTP = await authService.createOTP(
      user._id,
      user.email,
      'email_verification',
      req.deviceInfo.ipAddress,
      req.deviceInfo.userAgent
    );

    console.log(`✅ New user registered: ${email} (${role}) - Email OTP: ${emailOTP}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please verify your email.',
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          fullName: user.fullName,
          company: user.profile.company,
          kycStatus: user.kyc.status,
          emailVerified: false
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: '15m'
        }
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
        code: 'USER_EXISTS'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed',
      code: 'REGISTRATION_ERROR',
      error: error.message
    });
  }
});

// Login user
router.post('/login', loginRateLimit, deviceFingerprint, async (req, res) => {
  try {
    const { email, password, rememberMe = false } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
        code: 'MISSING_CREDENTIALS'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
        code: 'INVALID_EMAIL'
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Check if account is locked
    if (user.isLocked()) {
      return res.status(423).json({
        success: false,
        message: 'Account temporarily locked due to too many failed login attempts',
        code: 'ACCOUNT_LOCKED'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact support.',
        code: 'ACCOUNT_DEACTIVATED'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      await user.incLoginAttempts();
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Check for suspicious activity
    const suspiciousActivity = await authService.checkSuspiciousActivity(
      user._id,
      req.deviceInfo.ipAddress,
      req.deviceInfo.userAgent
    );

    // If suspicious activity detected, require OTP
    if (suspiciousActivity.newDevice || suspiciousActivity.multipleIPs) {
      const loginOTP = await authService.createOTP(
        user._id,
        user.email,
        'login',
        req.deviceInfo.ipAddress,
        req.deviceInfo.userAgent
      );

      console.log(`🔐 Suspicious login detected for ${email} - OTP: ${loginOTP}`);

      return res.status(200).json({
        success: true,
        message: 'OTP sent for verification due to suspicious activity',
        code: 'OTP_REQUIRED',
        data: {
          requiresOTP: true,
          email: user.email,
          suspiciousActivity
        }
      });
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const accessToken = authService.generateAccessToken(user._id, user.role);
    const refreshToken = await authService.generateRefreshToken(user._id, req.deviceInfo);

    console.log(`✅ User logged in: ${email} (${user.role})`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          fullName: user.fullName,
          company: user.profile.company,
          kycStatus: user.kyc.status,
          lastLogin: user.lastLogin
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: '15m'
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      code: 'LOGIN_ERROR',
      error: error.message
    });
  }
});

// Verify OTP for login
router.post('/verify-otp', otpRateLimit, async (req, res) => {
  try {
    const { email, otp, type = 'login' } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required',
        code: 'MISSING_FIELDS'
      });
    }

    // Verify OTP
    const otpVerification = await authService.verifyOTP(email, otp, type);
    if (!otpVerification.success) {
      return res.status(400).json({
        success: false,
        message: otpVerification.message,
        code: 'INVALID_OTP'
      });
    }

    // Get user
    const user = await User.findById(otpVerification.userId);
    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const accessToken = authService.generateAccessToken(user._id, user.role);
    const refreshToken = await authService.generateRefreshToken(user._id, req.deviceInfo);

    console.log(`✅ OTP verified for ${email} (${type})`);

    res.json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          fullName: user.fullName,
          company: user.profile.company,
          kycStatus: user.kyc.status,
          lastLogin: user.lastLogin
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: '15m'
        }
      }
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'OTP verification failed',
      code: 'OTP_VERIFICATION_ERROR',
      error: error.message
    });
  }
});

// Refresh access token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required',
        code: 'MISSING_REFRESH_TOKEN'
      });
    }

    // Generate new access token
    const accessToken = await authService.refreshAccessToken(refreshToken);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken,
        expiresIn: '15m'
      }
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token',
      code: 'INVALID_REFRESH_TOKEN'
    });
  }
});

// Forgot password
router.post('/forgot-password', passwordResetRateLimit, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Valid email is required',
        code: 'INVALID_EMAIL'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if user exists
      return res.json({
        success: true,
        message: 'If an account with this email exists, a password reset OTP has been sent'
      });
    }

    // Generate password reset OTP
    const resetOTP = await authService.createOTP(
      user._id,
      user.email,
      'password_reset',
      req.deviceInfo?.ipAddress,
      req.deviceInfo?.userAgent
    );

    console.log(`🔑 Password reset OTP for ${email}: ${resetOTP}`);

    res.json({
      success: true,
      message: 'Password reset OTP has been sent to your email'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request',
      code: 'PASSWORD_RESET_ERROR'
    });
  }
});

// Reset password
router.post('/reset-password', passwordResetRateLimit, async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
        code: 'MISSING_FIELDS'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
        code: 'PASSWORD_MISMATCH'
      });
    }

    // Validate new password
    const passwordValidation = authService.validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Password does not meet security requirements',
        code: 'WEAK_PASSWORD',
        errors: passwordValidation.errors
      });
    }

    // Verify OTP
    const otpVerification = await authService.verifyOTP(email, otp, 'password_reset');
    if (!otpVerification.success) {
      return res.status(400).json({
        success: false,
        message: otpVerification.message,
        code: 'INVALID_OTP'
      });
    }

    // Update password
    const user = await User.findById(otpVerification.userId);
    user.password = newPassword;
    await user.save();

    // Revoke all existing tokens for security
    await authService.revokeAllUserTokens(user._id);

    console.log(`🔑 Password reset successful for ${email}`);

    res.json({
      success: true,
      message: 'Password reset successful. Please login with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Password reset failed',
      code: 'PASSWORD_RESET_ERROR'
    });
  }
});

// Logout
router.post('/logout', auth, async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await authService.revokeRefreshToken(refreshToken);
    }

    console.log(`👋 User logged out: ${req.user.email}`);

    res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      code: 'LOGOUT_ERROR'
    });
  }
});

// Logout from all devices
router.post('/logout-all', auth, async (req, res) => {
  try {
    await authService.revokeAllUserTokens(req.user.id);

    console.log(`👋 User logged out from all devices: ${req.user.email}`);

    res.json({
      success: true,
      message: 'Logged out from all devices successfully'
    });

  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      code: 'LOGOUT_ERROR'
    });
  }
});

// Get current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      code: 'PROFILE_ERROR'
    });
  }
});

// Verify token
router.get('/verify', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    res.json({
      success: true,
      message: 'Token is valid',
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          fullName: user.fullName,
          company: user.profile.company,
          kycStatus: user.kyc.status
        }
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Token verification failed',
      code: 'TOKEN_VERIFICATION_ERROR'
    });
  }
});

// Get active sessions
router.get('/sessions', auth, async (req, res) => {
  try {
    const sessions = await RefreshToken.find({
      userId: req.user.id,
      isActive: true
    }).select('deviceInfo lastUsed createdAt');

    res.json({
      success: true,
      data: sessions
    });

  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sessions',
      code: 'SESSIONS_ERROR'
    });
  }
});

module.exports = router;