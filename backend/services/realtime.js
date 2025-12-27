class RealtimeService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map();
  }

  initialize(io) {
    this.io = io;
    console.log('🔄 Real-time service initialized');
  }

  // Broadcast invoice updates
  broadcastInvoiceUpdate(invoice, eventType = 'invoice-updated') {
    if (!this.io) return;

    const data = {
      type: eventType,
      invoice,
      timestamp: new Date().toISOString()
    };

    // Notify seller
    this.io.to(`user-${invoice.sellerId}`).emit('invoice-update', data);
    
    // Notify buyer if confirmed
    if (invoice.buyerId) {
      this.io.to(`user-${invoice.buyerId}`).emit('invoice-update', data);
    }

    // Notify investor if funded
    if (invoice.investorId) {
      this.io.to(`user-${invoice.investorId}`).emit('invoice-update', data);
    }

    // Broadcast to marketplace for all investors
    this.io.emit('marketplace-update', {
      type: 'invoice-status-changed',
      invoiceId: invoice._id,
      status: invoice.status,
      timestamp: new Date().toISOString()
    });
  }

  // Broadcast new invoice to marketplace
  broadcastNewInvoice(invoice) {
    if (!this.io) return;

    this.io.emit('marketplace-update', {
      type: 'new-invoice',
      invoice,
      timestamp: new Date().toISOString()
    });
  }

  // Notify specific user
  notifyUser(userId, notification) {
    if (!this.io) return;

    this.io.to(`user-${userId}`).emit('notification', {
      ...notification,
      timestamp: new Date().toISOString()
    });
  }

  // Broadcast system announcement
  broadcastAnnouncement(message, type = 'info') {
    if (!this.io) return;

    this.io.emit('system-announcement', {
      type,
      message,
      timestamp: new Date().toISOString()
    });
  }

  // Send real-time dashboard updates
  updateDashboard(userId, dashboardData) {
    if (!this.io) return;

    this.io.to(`user-${userId}`).emit('dashboard-update', {
      ...dashboardData,
      timestamp: new Date().toISOString()
    });
  }

  // Broadcast transaction updates
  broadcastTransaction(transaction) {
    if (!this.io) return;

    const data = {
      type: 'transaction-update',
      transaction,
      timestamp: new Date().toISOString()
    };

    // Notify all parties involved
    if (transaction.sellerId) {
      this.io.to(`user-${transaction.sellerId}`).emit('transaction-update', data);
    }
    if (transaction.buyerId) {
      this.io.to(`user-${transaction.buyerId}`).emit('transaction-update', data);
    }
    if (transaction.investorId) {
      this.io.to(`user-${transaction.investorId}`).emit('transaction-update', data);
    }
  }

  // Send portfolio updates
  updatePortfolio(userId, portfolioData) {
    if (!this.io) return;

    this.io.to(`user-${userId}`).emit('portfolio-update', {
      ...portfolioData,
      timestamp: new Date().toISOString()
    });
  }

  // Get connected users count
  getConnectedUsersCount() {
    return this.io ? this.io.sockets.sockets.size : 0;
  }

  // Send real-time analytics
  broadcastAnalytics(analytics) {
    if (!this.io) return;

    this.io.emit('analytics-update', {
      ...analytics,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = new RealtimeService();