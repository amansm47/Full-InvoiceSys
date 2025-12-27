# Invoice Financing Platform - Production Architecture

## 1. High-Level Architecture

### Microservices Structure
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Load Balancer │
│   React/Next.js │────│   Kong/Nginx    │────│   AWS ALB       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
┌───────▼────────┐    ┌────────▼────────┐    ┌────────▼────────┐
│ User Service   │    │ Invoice Service │    │ Payment Service │
│ Auth/KYC/Risk  │    │ Upload/Verify   │    │ UPI/Bank/Wallet │
└────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
┌───────▼────────┐    ┌────────▼────────┐    ┌────────▼────────┐
│ Notification   │    │ Funding Service │    │ Settlement      │
│ SMS/Email/Push │    │ Investor Pool   │    │ Auto Payout     │
└────────────────┘    └─────────────────┘    └─────────────────┘
```

### Database Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │     Redis       │    │   MongoDB       │
│ Transactional   │    │   Cache/Queue   │    │   Documents     │
│ Users/Invoices  │    │   Sessions      │    │   Logs/Analytics│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 2. Complete Workflow

### Invoice Financing Flow
```
SME Upload → Validation → Investor Funding → Settlement → Repayment
    │            │             │              │           │
    ▼            ▼             ▼              ▼           ▼
[OCR/GST]   [Risk Score]  [Escrow Lock]  [Fund Release] [ROI Dist]
```

### Step-by-Step Process
1. **SME uploads invoice** → OCR extraction + GST verification
2. **Platform validates** → Risk scoring + fraud detection  
3. **Investors fund** → Escrow mechanism locks funds
4. **SME receives money** → Instant settlement (minus fees)
5. **Customer pays later** → Auto-detection via bank APIs
6. **Profit distribution** → Automated ROI calculation + payout

## 3. Database Schema

### Core Tables
```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR UNIQUE,
    role ENUM('sme', 'investor', 'admin'),
    kyc_status ENUM('pending', 'verified', 'rejected'),
    risk_score INTEGER DEFAULT 50,
    wallet_balance DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP
);

-- Invoices table  
CREATE TABLE invoices (
    id UUID PRIMARY KEY,
    invoice_number VARCHAR UNIQUE,
    sme_id UUID REFERENCES users(id),
    customer_id UUID REFERENCES users(id),
    amount DECIMAL(15,2),
    discount_rate DECIMAL(5,2),
    due_date DATE,
    status ENUM('uploaded', 'verified', 'funded', 'repaid', 'defaulted'),
    risk_score INTEGER,
    gst_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP
);

-- Funding pool
CREATE TABLE funding_pool (
    id UUID PRIMARY KEY,
    invoice_id UUID REFERENCES invoices(id),
    investor_id UUID REFERENCES users(id),
    amount DECIMAL(15,2),
    expected_return DECIMAL(15,2),
    funded_at TIMESTAMP
);

-- Transactions ledger
CREATE TABLE transactions (
    id UUID PRIMARY KEY,
    from_user_id UUID REFERENCES users(id),
    to_user_id UUID REFERENCES users(id),
    invoice_id UUID REFERENCES invoices(id),
    amount DECIMAL(15,2),
    type ENUM('funding', 'repayment', 'fee', 'roi_payout'),
    status ENUM('pending', 'completed', 'failed'),
    created_at TIMESTAMP
);
```

## 4. API Endpoints

### Invoice Management
```javascript
// Upload invoice
POST /api/v1/invoices/upload
Headers: { Authorization: "Bearer <sme_token>" }
Body: {
  invoiceNumber: "INV-2024-001",
  amount: 100000,
  dueDate: "2024-02-15",
  customerGST: "29ABCDE1234F1Z5",
  invoiceFile: "<base64_pdf>"
}
Response: { invoiceId: "uuid", status: "uploaded" }

// Get marketplace
GET /api/v1/invoices/marketplace
Headers: { Authorization: "Bearer <investor_token>" }
Response: [{
  id: "uuid",
  amount: 100000,
  discountedAmount: 90000,
  riskScore: 65,
  expectedROI: 12.5,
  daysToMaturity: 45
}]

// Fund invoice
POST /api/v1/invoices/:id/fund
Headers: { Authorization: "Bearer <investor_token>" }
Body: { amount: 90000 }
Response: { transactionId: "uuid", status: "funded" }
```

### Payment & Settlement
```javascript
// Bank callback webhook
POST /api/v1/webhooks/payment
Headers: { "X-Bank-Signature": "<hmac>" }
Body: {
  transactionId: "bank_txn_123",
  invoiceNumber: "INV-2024-001", 
  amount: 100000,
  status: "success",
  paidAt: "2024-02-10T10:30:00Z"
}

// Auto payout ROI
POST /api/v1/payouts/distribute/:invoiceId
Internal: Triggered by payment webhook
Logic: Calculate ROI + distribute to investors
```

## 5. Risk & Fraud Prevention

### Multi-Layer Verification
```javascript
// Fraud detection pipeline
const fraudDetection = {
  ocrValidation: (pdf) => extractAndValidate(pdf),
  gstVerification: (gstNumber) => verifyWithGSTIN(gstNumber),
  bankVerification: (accountNumber) => verifyWithPenny(accountNumber),
  riskScoring: (sme, customer, invoice) => calculateRiskScore(),
  duplicateCheck: (invoiceHash) => checkDuplicates()
};

// Risk scoring algorithm
function calculateRiskScore(sme, customer, invoice) {
  let score = 50; // Base score
  
  // SME factors
  score += sme.pastRepayments * 10;
  score -= sme.defaultCount * 20;
  
  // Customer factors  
  score += customer.creditRating * 5;
  score -= customer.latePayments * 15;
  
  // Invoice factors
  if (invoice.amount > 500000) score -= 10;
  if (invoice.daysToMaturity > 90) score -= 15;
  
  return Math.max(0, Math.min(100, score));
}
```

## 6. Smart Contract (Web3 Version)

```solidity
pragma solidity ^0.8.0;

contract InvoiceFinancing {
    struct Invoice {
        address sme;
        address customer; 
        uint256 amount;
        uint256 discountedAmount;
        uint256 dueDate;
        bool isPaid;
        bool isDefaulted;
    }
    
    mapping(uint256 => Invoice) public invoices;
    mapping(uint256 => mapping(address => uint256)) public investments;
    
    function fundInvoice(uint256 invoiceId) external payable {
        require(msg.value > 0, "Invalid amount");
        investments[invoiceId][msg.sender] += msg.value;
        // Lock funds in escrow
    }
    
    function repayInvoice(uint256 invoiceId) external payable {
        Invoice storage invoice = invoices[invoiceId];
        require(msg.sender == invoice.customer, "Only customer can repay");
        require(msg.value >= invoice.amount, "Insufficient amount");
        
        invoice.isPaid = true;
        // Distribute returns to investors
        distributeReturns(invoiceId);
    }
    
    function distributeReturns(uint256 invoiceId) internal {
        // Auto-calculate and distribute ROI to all investors
    }
}
```

## 7. Deployment Architecture (AWS)

```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  frontend:
    image: invoice-frontend:latest
    ports: ["3000:3000"]
    
  api-gateway:
    image: kong:latest
    ports: ["8000:8000"]
    
  user-service:
    image: user-service:latest
    environment:
      - DATABASE_URL=postgresql://...
      - REDIS_URL=redis://...
      
  invoice-service:
    image: invoice-service:latest
    
  payment-service:
    image: payment-service:latest
    
  notification-service:
    image: notification-service:latest
```

This architecture provides a complete, production-ready invoice financing platform with all necessary components for security, scalability, and compliance.