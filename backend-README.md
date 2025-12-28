# Invoice Financing Platform - Backend API

Node.js backend API for the Invoice Financing Platform with blockchain integration.

## 🚀 Features

- **Authentication**: JWT-based auth with refresh tokens
- **Invoice Management**: Complete invoice lifecycle
- **Blockchain Integration**: Ethereum smart contracts
- **Real-time Updates**: WebSocket support
- **Security**: Fraud detection, rate limiting
- **File Upload**: Invoice document handling
- **Database**: MongoDB with Mongoose

## 🛠️ Tech Stack

- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- Multer (File uploads)
- Socket.io (Real-time)
- Web3.js (Blockchain)
- Bcrypt (Password hashing)

## 📁 Project Structure

```
backend/
├── config/           # Configuration files
├── middleware/       # Express middleware
├── models/          # MongoDB schemas
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utility functions
├── uploads/         # File storage
└── server.js        # Entry point
```

## 🔧 Installation

```bash
# Clone repository
git clone <backend-repo-url>
cd invoice-financing-backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configurations

# Start development server
npm run dev
```

## 🌐 Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/invoice_financing

# JWT
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Blockchain
WEB3_PROVIDER_URL=http://localhost:8545
CONTRACT_ADDRESS=0x...
PRIVATE_KEY=0x...

# CORS
FRONTEND_URL=http://localhost:3000
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout
- `PUT /api/auth/kyc` - Update KYC

### Invoices
- `GET /api/invoices` - Get user invoices
- `POST /api/invoices` - Create invoice
- `GET /api/invoices/:id` - Get invoice details
- `PUT /api/invoices/:id/confirm` - Buyer confirmation
- `PUT /api/invoices/:id/fund` - Fund invoice
- `PUT /api/invoices/:id/repay` - Repay invoice

### Marketplace
- `GET /api/invoices/marketplace` - Get marketplace listings
- `GET /api/invoices/marketplace/search` - Search invoices

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/dashboard` - Dashboard data
- `GET /api/users/portfolio` - Investment portfolio

## 🔐 Authentication Flow

1. User registers/logs in
2. Server returns JWT access token + refresh token
3. Client includes access token in Authorization header
4. Server validates token on protected routes
5. Client refreshes token when expired

## 🏗️ Database Schema

### User Model
- Personal information
- KYC status and documents
- Role (seller/buyer/investor)
- Wallet information

### Invoice Model
- Invoice details and amounts
- Status workflow tracking
- Document attachments
- Risk assessment
- Blockchain transaction data

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting on API endpoints
- Input validation and sanitization
- File upload restrictions
- CORS configuration
- Fraud detection algorithms

## 🧪 Testing

```bash
# Run tests
npm test

# Test specific endpoints
npm run test:auth
npm run test:invoices
```

## 📦 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker
```bash
docker build -t invoice-backend .
docker run -p 5000:5000 invoice-backend
```

## 🔗 Frontend Integration

This backend is designed to work with the Invoice Financing Frontend:
- Repository: `<frontend-repo-url>`
- CORS configured for frontend domain
- WebSocket support for real-time updates

## 📄 License

MIT License