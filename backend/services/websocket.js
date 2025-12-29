const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

class WebSocketService {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });
    
    this.clients = new Map();
    
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      
      socket.on('authenticate', (token) => {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
          socket.userId = decoded.userId;
          socket.role = decoded.role;
          this.clients.set(decoded.userId, socket);
          socket.emit('authenticated', { userId: decoded.userId, role: decoded.role });
        } catch (error) {
          socket.emit('auth_error', 'Invalid token');
        }
      });
      
      socket.on('disconnect', () => {
        if (socket.userId) {
          this.clients.delete(socket.userId);
        }
        console.log('Client disconnected:', socket.id);
      });
    });
  }
  
  // Notify all investors about new invoice
  notifyInvestors(invoice) {
    console.log('📢 Broadcasting new invoice to all clients:', invoice.invoiceNumber);
    this.io.emit('newInvoiceListed', {
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      amount: invoice.amount,
      seller: invoice.seller,
      buyer: invoice.buyer,
      dueDate: invoice.dueDate,
      status: invoice.status,
      timestamp: invoice.timestamp || new Date()
    });
  }
  
  // Notify specific user about invoice update
  notifyUser(userId, event, data) {
    const userIdStr = userId.toString();
    const socket = this.clients.get(userIdStr);
    if (socket) {
      console.log(`🔔 Notifying user ${userIdStr} about ${event}`);
      socket.emit(event, data);
    } else {
      console.log(`⚠️ User ${userIdStr} not connected`);
    }
  }
  
  // Notify seller when invoice is funded
  notifySellerFunded(sellerId, invoiceData) {
    console.log('💰 Notifying seller about funding:', sellerId);
    this.notifyUser(sellerId, 'invoiceFunded', {
      invoiceId: invoiceData.invoiceId || invoiceData._id,
      invoiceNumber: invoiceData.invoiceNumber,
      amount: invoiceData.amount,
      investor: invoiceData.investor,
      newBalance: invoiceData.newBalance,
      timestamp: invoiceData.timestamp || new Date()
    });
  }
  
  // Notify investor when invoice is repaid
  notifyInvestorRepaid(investorId, invoiceData) {
    this.notifyUser(investorId, 'invoiceRepaid', {
      invoiceId: invoiceData._id,
      amount: invoiceData.amount,
      profit: invoiceData.amount - invoiceData.discountedAmount
    });
  }
  
  // Broadcast invoice status updates
  broadcastInvoiceUpdate(invoice) {
    console.log('📡 Broadcasting invoice update:', invoice.invoiceNumber);
    this.io.emit('invoiceUpdated', {
      id: invoice._id,
      status: invoice.status,
      invoiceNumber: invoice.invoiceNumber,
      timestamp: new Date()
    });
  }
  
  // Send real-time market data
  broadcastMarketUpdate(marketData) {
    this.io.emit('marketUpdate', marketData);
  }
  
  // Send portfolio updates to specific investor
  sendPortfolioUpdate(investorId, portfolioData) {
    this.notifyUser(investorId, 'portfolioUpdate', portfolioData);
  }
}

module.exports = WebSocketService;