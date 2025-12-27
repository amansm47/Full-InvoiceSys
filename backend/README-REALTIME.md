# Real-time Invoice Financing Backend

A complete real-time backend implementation for the invoice financing platform with WebSocket support, comprehensive fraud detection, and live data synchronization.

## 🚀 Features

### Real-time Capabilities
- **WebSocket Integration**: Live updates for all invoice status changes
- **Real-time Notifications**: Instant notifications for all user actions
- **Live Dashboard Updates**: Real-time dashboard data synchronization
- **Marketplace Updates**: Live marketplace listings and changes
- **Transaction Monitoring**: Real-time transaction status updates

### Security & Fraud Detection
- **Advanced Fraud Detection**: Multi-layer fraud detection system
- **Duplicate Invoice Prevention**: Hash-based duplicate detection
- **Risk Assessment**: Real-time risk scoring for invoices
- **Rate Limiting**: Comprehensive rate limiting for all endpoints
- **JWT Authentication**: Secure token-based authentication

### Data Management
- **MongoDB Integration**: Optimized database schemas with indexing
- **Transaction Management**: Complete transaction lifecycle tracking
- **Audit Trails**: Comprehensive audit logging for all actions
- **Data Validation**: Robust input validation and sanitization

## 📁 Project Structure

```
backend/
├── models/                 # Database models
│   ├── User.js            # Enhanced user model with KYC
│   ├── Invoice.js         # Comprehensive invoice model
│   └── Transaction.js     # Transaction tracking model
├── routes/                # API routes
│   ├── auth.js           # Authentication endpoints
│   ├── invoices-realtime.js # Real-time invoice management
│   └── users.js          # User management and dashboard
├── services/              # Business logic services
│   └── realtime.js       # Real-time WebSocket service
├── utils/                 # Utility functions
│   └── fraudDetection.js # Fraud detection algorithms
├── middleware/            # Express middleware
│   └── auth.js           # JWT authentication middleware
├── uploads/               # File upload directory
├── realtime-server.js    # Main server file
├── seed-realtime-data.js # Database seeding script
└── start-realtime.bat    # Windows startup script
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Quick Start

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Run the setup script (Windows)**
   ```bash
   start-realtime.bat
   ```
   Choose option 1 for first-time setup.

3. **Manual setup (Linux/Mac)**
   ```bash
   # Install dependencies
   npm install
   
   # Seed database with demo data
   npm run seed
   
   # Start development server
   npm run dev
   ```

### Environment Configuration

Copy `.env.example` to `.env` and configure:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/invoice-financing-realtime
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
```

## 🔐 Demo Credentials

After seeding, use these credentials to test:

- **Seller**: `seller@demo.com` / `password123`
- **Buyer**: `buyer@demo.com` / `password123`
- **Investor**: `investor@demo.com` / `password123`

## 📡 API Endpoints

### Authentication
```
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
GET  /api/auth/profile      # Get user profile
PUT  /api/auth/profile      # Update profile
POST /api/auth/kyc          # Update KYC status
```

### Invoices
```
POST /api/invoices/create              # Create new invoice
GET  /api/invoices                     # Get user invoices
GET  /api/invoices/:id                 # Get invoice details
POST /api/invoices/:id/confirm         # Buyer confirms invoice
POST /api/invoices/:id/fund            # Investor funds invoice
GET  /api/invoices/marketplace/listings # Get marketplace
POST /api/invoices/:id/communicate     # Add communication
```

### Users & Dashboard
```
GET /api/users/dashboard     # Real-time dashboard data
GET /api/users/portfolio     # Investment portfolio
GET /api/users/transactions  # User transactions
GET /api/users/statistics    # User statistics
PUT /api/users/preferences   # Update preferences
```

## 🔄 Real-time Events

### WebSocket Events

**Client → Server**
```javascript
socket.emit('join-room', userId);
```

**Server → Client**
```javascript
// Invoice updates
socket.on('invoice-update', (data) => {
  // Handle invoice status changes
});

// Marketplace updates
socket.on('marketplace-update', (data) => {
  // Handle new listings or changes
});

// Notifications
socket.on('notification', (data) => {
  // Handle user notifications
});

// Dashboard updates
socket.on('dashboard-update', (data) => {
  // Handle real-time dashboard data
});

// Transaction updates
socket.on('transaction-update', (data) => {
  // Handle transaction status changes
});
```

## 🛡️ Security Features

### Fraud Detection
- **Duplicate Detection**: Prevents duplicate invoice submissions
- **Amount Anomalies**: Detects unusual invoice amounts
- **Rapid Creation**: Monitors for suspicious creation patterns
- **Seller History**: Analyzes seller performance history
- **Pattern Analysis**: Checks for invoice pattern anomalies

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Rate Limiting**: Prevents abuse and brute force attacks
- **Account Locking**: Temporary lockout after failed attempts
- **Role-based Access**: Proper access control for different user roles

## 📊 Database Schema

### User Model
```javascript
{
  email: String,
  password: String (hashed),
  role: ['seller', 'buyer', 'investor'],
  profile: {
    firstName, lastName, phone, company,
    gstNumber, panNumber, address
  },
  kyc: {
    status: ['pending', 'submitted', 'verified', 'rejected'],
    documents: [{ type, url, uploadedAt }],
    verifiedAt: Date
  },
  statistics: {
    totalInvoices, totalAmount,
    successfulTransactions, rating
  }
}
```

### Invoice Model
```javascript
{
  invoiceNumber: String,
  sellerId, buyerId, investorId: ObjectId,
  details: {
    amount, issueDate, dueDate, description,
    items: [{ description, quantity, rate, amount }]
  },
  status: ['draft', 'pending_buyer_confirmation', 
           'confirmed', 'listed', 'funded', 'repaid'],
  financing: {
    requestedAmount, discountRate,
    fundedAmount, expectedReturn
  },
  verification: {
    buyerConfirmed, fraudCheck, duplicateCheck
  },
  riskAssessment: {
    score, category, factors
  }
}
```

## 🚀 Performance Optimizations

### Database Indexing
- Compound indexes on frequently queried fields
- Text indexes for search functionality
- TTL indexes for temporary data

### Caching Strategy
- In-memory caching for frequently accessed data
- Redis integration ready for production scaling

### Real-time Optimization
- Efficient WebSocket room management
- Selective data broadcasting to reduce bandwidth
- Connection pooling for database operations

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm test -- --grep "Authentication"
npm test -- --grep "Invoice"
npm test -- --grep "Real-time"
```

## 📈 Monitoring & Analytics

### Health Check
```
GET /api/health
```
Returns server status, uptime, and memory usage.

### Real-time Analytics
- Connected users count
- Active transactions monitoring
- System performance metrics

## 🔧 Development Commands

```bash
# Development with auto-reload
npm run dev

# Seed database with demo data
npm run seed

# Clear all database data
npm run clear

# Full setup (install + seed + start)
npm run setup

# Production start
npm start
```

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb://your-production-db
JWT_SECRET=your-production-secret
FRONTEND_URL=https://your-frontend-domain.com
```

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5001
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Check the logs in the console
- Verify MongoDB connection
- Ensure all environment variables are set
- Check the health endpoint: `http://localhost:5001/api/health`

## 🔮 Future Enhancements

- [ ] Redis integration for caching
- [ ] Elasticsearch for advanced search
- [ ] Microservices architecture
- [ ] Advanced analytics dashboard
- [ ] Mobile push notifications
- [ ] Blockchain integration enhancement
- [ ] Machine learning for risk assessment