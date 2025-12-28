const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Google OAuth + JWT Authentication
const auth = {
  // Initialize Google OAuth Strategy
  initializeGoogleAuth: () => {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const User = require('../models/User');
        
        // Check if user exists
        let user = await User.findOne({ googleId: profile.id });
        
        if (user) {
          return done(null, user);
        }
        
        // Create new user
        user = new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          profile: {
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            company: '',
            phone: ''
          },
          role: 'seller' // Default role
        });
        
        await user.save();
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }));
    
    passport.serializeUser((user, done) => {
      done(null, user._id);
    });
    
    passport.deserializeUser(async (id, done) => {
      try {
        const User = require('../models/User');
        const user = await User.findById(id);
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    });
  },
  
  // Generate JWT token
  generateToken: (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { 
      expiresIn: process.env.JWT_EXPIRES_IN || '7d' 
    });
  },
  
  // Verify JWT token
  verifyToken: (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
  },
  
  // Hash password
  hashPassword: async (password) => {
    const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    return await bcrypt.hash(password, rounds);
  },
  
  // Compare password
  comparePassword: async (password, hash) => {
    return await bcrypt.compare(password, hash);
  }
};

module.exports = auth;