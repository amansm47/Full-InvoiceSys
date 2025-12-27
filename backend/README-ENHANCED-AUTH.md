# Enhanced Authentication System for BLC Platform

A comprehensive authentication system with advanced security features including JWT tokens, refresh tokens, OTP verification, and fraud detection.

## 🔐 Security Features

### Multi-Layer Authentication
- **JWT Access Tokens** (15-minute expiry)
- **Refresh Tokens** (7-day expiry with device tracking)
- **OTP Verification** for suspicious activities
- **Account Lockout** after failed attempts
- **Device Fingerprinting**

### Password Security
- **Strong Password Requirements**
  - Minimum 8 characters
  - Uppercase and lowercase letters
  - Numbers and special characters
  - No common patterns or sequences
- **Password Strength Scoring**
- **Secure Hashing** with bcrypt (12 rounds)

### Fraud Detection
- **Suspicious Activity Detection**
  - Multiple IP addresses
  - New device detection
  - Rapid login attempts
  - Geographic anomalies
- **Rate Limiting** on all endpoints
- **Account Lockout** mechanisms

### Security Headers
- **Helmet.js** for security headers
- **CORS** configuration
- **CSP** (Content Security Policy)
- **HSTS** (HTTP Strict Transport Security)

## 📁 File Structure

```
backend/
├── models/
│   ├── User.js              # Enhanced user model
│   ├── RefreshToken.js      # Refresh token management
│   └── OTP.js              # OTP verification
├── services/
│   └── authService.js      # Core authentication logic
├── middleware/
│   └── enhancedAuth.js     # Authentication middleware
├── routes/
│   └── enhancedAuth.js     # Authentication endpoints
├── scripts/
│   └── cleanTokens.js      # Token cleanup utility
└── enhanced-auth-server.js # Enhanced server setup
```

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/logout-all` - Logout from all devices

### Password Management
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with OTP
- `POST /api/auth/change-password` - Change password (authenticated)

### Profile Management
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/verify` - Verify token validity
- `GET /api/auth/sessions` - Get active sessions

## 🔧 Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install express mongoose bcryptjs jsonwebtoken express-rate-limit helmet cors dotenv
```

### 2. Environment Configuration
Copy `.env.enhanced` to `.env` and update values:
```bash
cp .env.enhanced .env
```

### 3. Start Enhanced Server
```bash
# Development
npm run dev

# Production
npm start
```

### 4. Clean Expired Tokens (Optional)
```bash
node scripts/cleanTokens.js
```

## 🔑 Environment Variables

```env
# Core Configuration
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blc-enhanced

# JWT Secrets (CHANGE THESE!)
JWT_SECRET=your-super-secure-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## 📊 Token Management

### Access Tokens
- **Expiry**: 15 minutes
- **Purpose**: API authentication
- **Storage**: Memory/localStorage (frontend)

### Refresh Tokens
- **Expiry**: 7 days
- **Purpose**: Generate new access tokens
- **Storage**: Database with device info
- **Security**: Automatic cleanup of expired tokens

### OTP Tokens
- **Expiry**: 10 minutes
- **Purpose**: Two-factor authentication
- **Attempts**: Maximum 3 attempts
- **Types**: login, password_reset, email_verification

## 🛡️ Security Measures

### Rate Limiting
- **Authentication**: 5 attempts per 15 minutes
- **Login**: 5 attempts per 15 minutes
- **OTP**: 3 attempts per 5 minutes
- **Password Reset**: 3 attempts per hour
- **API**: 100 requests per 15 minutes

### Account Protection
- **Login Attempts**: Account locked after 5 failed attempts
- **Lock Duration**: 2 hours
- **Suspicious Activity**: OTP required for new devices/IPs
- **Session Management**: Track and revoke active sessions

### Data Protection
- **Password Hashing**: bcrypt with 12 rounds
- **Sensitive Data**: Excluded from API responses
- **Input Validation**: Comprehensive validation on all inputs
- **SQL Injection**: Protected by Mongoose ODM

## 🔄 Migration from Basic Auth

### 1. Update Dependencies
```bash
npm install express-rate-limit helmet compression morgan
```

### 2. Replace Auth Routes
```javascript
// Replace old auth routes
app.use('/api/auth', require('./routes/enhancedAuth'));
```

### 3. Update Middleware
```javascript
// Use enhanced middleware
const { auth, requireRole, requireKYC } = require('./middleware/enhancedAuth');
```

### 4. Frontend Updates
Update frontend to handle:
- Refresh token flow
- OTP verification
- Enhanced error codes
- Session management

## 📱 Frontend Integration

### Token Storage
```javascript
// Store tokens securely
localStorage.setItem('accessToken', data.tokens.accessToken);
localStorage.setItem('refreshToken', data.tokens.refreshToken);
```

### Automatic Token Refresh
```javascript
// Axios interceptor for token refresh
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED') {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await axios.post('/api/auth/refresh', { refreshToken });
      localStorage.setItem('accessToken', response.data.data.accessToken);
      return axios.request(error.config);
    }
    return Promise.reject(error);
  }
);
```

### OTP Handling
```javascript
// Handle OTP requirement
if (response.data.code === 'OTP_REQUIRED') {
  // Show OTP input form
  showOTPForm(response.data.data.email);
}
```

## 🧪 Testing

### Test Authentication Flow
```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123!","role":"seller","firstName":"Test","lastName":"User","phone":"1234567890","company":"Test Corp"}'

# Login user
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123!"}'

# Verify token
curl -X GET http://localhost:5000/api/auth/verify \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🔍 Monitoring & Logging

### Security Events
- Failed login attempts
- Account lockouts
- Suspicious activities
- Token refresh events
- Password changes

### Performance Metrics
- Response times
- Rate limit hits
- Database queries
- Memory usage

## 🚨 Security Best Practices

1. **Regular Token Cleanup**: Run cleanup script daily
2. **Monitor Failed Attempts**: Set up alerts for suspicious activity
3. **Update Dependencies**: Keep security packages updated
4. **Environment Secrets**: Never commit secrets to version control
5. **HTTPS Only**: Use HTTPS in production
6. **Database Security**: Secure MongoDB with authentication
7. **Backup Strategy**: Regular database backups
8. **Audit Logs**: Maintain comprehensive audit trails

## 📞 Support

For issues or questions:
1. Check the logs for error details
2. Verify environment configuration
3. Test with provided curl commands
4. Review security headers and CORS settings

## 🔄 Updates & Maintenance

### Weekly Tasks
- Review security logs
- Clean expired tokens
- Monitor performance metrics

### Monthly Tasks
- Update dependencies
- Review access patterns
- Audit user accounts
- Performance optimization

### Security Updates
- Immediate patching of security vulnerabilities
- Regular security assessments
- Penetration testing (recommended quarterly)