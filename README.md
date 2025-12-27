# Invoice Financing Platform with Blockchain

A complete end-to-end invoice financing platform built with MERN stack and blockchain technology.

## 🏗️ Architecture

- **Frontend**: React.js with Material-UI
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Blockchain**: Ethereum Smart Contracts
- **Authentication**: JWT
- **File Upload**: Multer
- **OCR**: Tesseract.js

## 🚀 Features

### Core Workflow
1. **User Onboarding** - KYC verification for Sellers, Buyers, Investors
2. **Invoice Creation** - Sellers upload invoices with OCR extraction
3. **Buyer Verification** - Buyers confirm invoice authenticity
4. **Marketplace** - Investors browse and fund verified invoices
5. **Blockchain Escrow** - Smart contracts handle fund management
6. **Repayment** - Automated profit distribution

### Security Features
- Fraud detection algorithms
- Duplicate invoice prevention
- Risk scoring system
- Encrypted wallet storage
- Rate limiting

## 📁 Project Structure

```
BLC/
├── backend/           # Node.js API server
├── frontend/          # React.js application
├── blockchain/        # Smart contracts
└── shared/           # Shared utilities
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB
- Ganache (for local blockchain)
- Git

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd BLC

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Setup

```bash
# Backend environment
cd backend
cp .env.example .env
# Edit .env with your configurations

# Frontend environment
cd ../frontend
cp .env.example .env
# Edit .env with your configurations
```

### 3. Database Setup

```bash
# Start MongoDB
mongod

# The application will create collections automatically
```

### 4. Blockchain Setup

```bash
# Install Ganache CLI
npm install -g ganache-cli

# Start local blockchain
ganache-cli

# Deploy smart contracts (in blockchain directory)
# Update CONTRACT_ADDRESS in backend .env
```

### 5. Start Applications

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm start

# Terminal 3: Keep Ganache running
ganache-cli
```

## 🔐 User Roles & Workflows

### Seller (MSME)
1. Register → Complete KYC
2. Upload invoice with documents
3. Wait for buyer confirmation
4. Receive funds when investor funds invoice
5. Buyer pays investor directly

### Buyer (Corporate)
1. Register → Complete KYC
2. Receive invoice confirmation requests
3. Confirm legitimate invoices
4. Pay invoices on due date

### Investor
1. Register → Complete KYC
2. Browse marketplace
3. Fund invoices at discount
4. Receive full payment when buyer pays

## 📊 Example Transaction Flow

```
Rohan's Bakery (Seller) → ₹10,000 invoice → Hotel (Buyer)
                                ↓
                        Buyer confirms invoice
                                ↓
                        Listed on marketplace
                                ↓
                    Investor pays ₹9,000 (10% discount)
                                ↓
                        Rohan gets ₹9,000 immediately
                                ↓
                    Hotel pays ₹10,000 on due date
                                ↓
                    Investor earns ₹1,000 profit
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/kyc` - KYC update

### Invoices
- `POST /api/invoices/create` - Create invoice
- `POST /api/invoices/:id/confirm` - Buyer confirmation
- `GET /api/invoices/marketplace` - Get marketplace
- `POST /api/invoices/:id/fund` - Fund invoice
- `POST /api/invoices/:id/repay` - Repay invoice

### Users
- `GET /api/users/dashboard` - User dashboard
- `GET /api/users/portfolio` - Investment portfolio

## 🛡️ Security Features

### Fraud Prevention
- Duplicate invoice hash detection
- Amount anomaly detection
- Rapid creation monitoring
- Buyer authenticity verification
- Risk scoring algorithms

### Data Protection
- Encrypted private keys
- JWT authentication
- Rate limiting
- Input validation
- File upload restrictions

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📱 Mobile Responsiveness

The application is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices

## 🔄 Deployment

### Backend (Node.js)
- Deploy to Heroku, AWS, or DigitalOcean
- Set environment variables
- Configure MongoDB Atlas

### Frontend (React)
- Build: `npm run build`
- Deploy to Netlify, Vercel, or AWS S3

### Blockchain
- Deploy to Ethereum mainnet or testnets
- Update contract addresses in environment

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: support@invoicefinancing.com

## 🚀 Future Enhancements

- Mobile app (React Native)
- Advanced analytics dashboard
- Integration with accounting software
- Multi-currency support
- Insurance integration
- Credit scoring improvements