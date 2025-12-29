# Real-Time Invoice Financing Platform

## 🚀 Real-Time Features Implemented

### Backend (Socket.IO Server)

#### WebSocket Events

**Emitted by Server:**
- `newInvoiceListed` - When seller creates a new invoice
- `invoiceFunded` - When investor funds an invoice (to seller)
- `investmentSuccess` - When investment is successful (to investor)
- `invoiceUpdated` - When invoice status changes
- `portfolioUpdate` - When portfolio data changes

**Received by Server:**
- `authenticate` - Client sends JWT token for authentication
- `disconnect` - Client disconnects

### Frontend (React + Socket.IO Client)

#### Real-Time Hook: `useRealTimeData()`

Provides:
- `isConnected` - WebSocket connection status
- `realTimeData.notifications` - Array of real-time notifications
- `realTimeData.newInvoices` - Array of newly listed invoices
- `clearNotifications()` - Clear all notifications
- `removeNotification(id)` - Remove specific notification

### Demo Wallet System

Each user gets a demo wallet with ₹10,00,000 (10 lakh rupees) for testing.

#### Wallet Features:
- **Balance Tracking** - Real-time balance updates
- **Transaction History** - All credits and debits
- **Automatic Transfers** - Money moves instantly between wallets

#### Wallet Endpoints:
- `GET /api/wallet` - Get wallet balance
- `GET /api/wallet/transactions` - Get transaction history

### Invoice Funding Flow

1. **Seller Creates Invoice**
   - Invoice saved to database
   - Status set to 'listed'
   - WebSocket broadcasts `newInvoiceListed` to all investors
   - Investors see notification instantly

2. **Investor Funds Invoice**
   - Check investor wallet balance
   - Deduct amount from investor wallet
   - Add amount to seller wallet
   - Update invoice status to 'funded'
   - Create investment record
   - Emit `invoiceFunded` to seller
   - Emit `investmentSuccess` to investor
   - Broadcast `invoiceUpdated` to all users

3. **Real-Time Updates**
   - Dashboard stats refresh automatically
   - Marketplace updates when invoices are funded
   - Notifications appear instantly
   - Wallet balances update in real-time

## 🔧 Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
npm run dev
```

The WebSocket server starts automatically with the Express server on port 5005.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend connects to WebSocket server automatically.

### 3. Test Real-Time Events

```bash
cd backend
node test-realtime.js
```

This script listens for all WebSocket events.

## 📊 Testing the Flow

### Test Scenario 1: New Invoice Creation

1. Login as **Seller**
2. Create a new invoice
3. Open another browser/tab as **Investor**
4. Investor should see notification immediately
5. Invoice appears in marketplace instantly

### Test Scenario 2: Invoice Funding

1. Login as **Investor**
2. Browse marketplace
3. Click "Invest Now" on an invoice
4. Enter investment amount
5. Click "Invest Now"
6. Check:
   - Investor wallet balance decreases
   - Seller wallet balance increases (if seller is logged in)
   - Invoice disappears from marketplace
   - Notifications appear for both users

### Test Scenario 3: Multiple Users

1. Open 3 browser windows:
   - Window 1: Seller
   - Window 2: Investor 1
   - Window 3: Investor 2
2. Seller creates invoice
3. Both investors see notification instantly
4. Investor 1 funds the invoice
5. Investor 2 sees invoice disappear from marketplace
6. Seller sees funding notification

## 🎯 Key Features

✅ Real-time invoice notifications
✅ Instant marketplace updates
✅ Demo wallet system (₹10 lakh per user)
✅ Automatic fund transfers
✅ Transaction history
✅ WebSocket connection status indicator
✅ Notification system with badges
✅ Auto-refresh dashboard data
✅ Multi-user support
✅ Reconnection handling

## 🔐 Security

- JWT authentication for WebSocket connections
- User-specific notifications
- Wallet balance validation
- Transaction logging
- Secure fund transfers

## 📱 Frontend Components

### Real-Time Notifications Component
- Shows live notifications
- Badge with count
- Click to view details
- Auto-dismiss option

### Connection Status Indicator
- 🟢 Live Data - Connected
- 🔴 Offline - Disconnected

### New Invoice Alerts
- Appears when new invoice is listed
- Shows invoice details
- Quick invest button
- Auto-updates marketplace

## 🐛 Troubleshooting

### WebSocket Not Connecting

1. Check backend is running on port 5005
2. Check CORS settings in backend
3. Check browser console for errors
4. Verify JWT token is valid

### Notifications Not Appearing

1. Check WebSocket connection status
2. Verify user is authenticated
3. Check browser console for Socket.IO events
4. Run test-realtime.js to verify server events

### Wallet Balance Not Updating

1. Check wallet was created (auto-created on first dashboard load)
2. Verify transaction was successful
3. Check backend logs for errors
4. Refresh page to force data reload

## 📝 Environment Variables

### Backend (.env)
```
PORT=5005
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5005
```

## 🚀 Production Deployment

1. Update FRONTEND_URL in backend .env
2. Update REACT_APP_API_URL in frontend .env
3. Enable HTTPS for WebSocket (wss://)
4. Configure proper CORS settings
5. Use production MongoDB
6. Enable secure cookies

## 📈 Future Enhancements

- [ ] Push notifications
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Real-time chat between users
- [ ] Live auction for invoices
- [ ] Real-time analytics dashboard
- [ ] Mobile app support
- [ ] Blockchain integration for transactions
