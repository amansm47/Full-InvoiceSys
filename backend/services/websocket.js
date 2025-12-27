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
    this.io.emit('newInvoiceListed', {
      id: invoice._id,
      invoiceNumber: invoice.invoiceNumber,
      amount: invoice.amount,
      discountedAmount: invoice.discountedAmount,
      seller: invoice.seller?.name,
      buyer: invoice.buyer?.name,
      riskScore: invoice.riskScore,
      dueDate: invoice.dueDate
    });
  }
  
  // Notify specific user about invoice update
  notifyUser(userId, event, data) {
    const socket = this.clients.get(userId);
    if (socket) {
      socket.emit(event, data);
    }
  }
  
  // Notify seller when invoice is funded
  notifySellerFunded(sellerId, invoiceData) {
    this.notifyUser(sellerId, 'invoiceFunded', {
      invoiceId: invoiceData._id,
      amount: invoiceData.discountedAmount,
      investor: invoiceData.investor?.name
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
    this.io.emit('invoiceUpdated', {
      id: invoice._id,
      status: invoice.status,
      invoiceNumber: invoice.invoiceNumber
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