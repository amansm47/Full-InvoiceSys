const express = require('express');
const User = require('../models/User');
const Invoice = require('../models/Invoice');
const Transaction = require('../models/Transaction');
const { auth } = require('../middleware/auth');
const realtimeService = require('../services/realtime');

const router = express.Router();

// Get user dashboard with real-time data
router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let dashboardData = {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        company: user.profile.company,
        kycStatus: user.kyc.status,
        memberSince: user.createdAt,
        lastLogin: user.lastLogin
      },
      statistics: user.statistics,
      notifications: [],
      recentActivity: []
    };

    // Role-specific dashboard data
    if (user.role === 'seller') {
      const sellerStats = await getSellerDashboard(user._id);
      dashboardData = { ...dashboardData, ...sellerStats };
    } else if (user.role === 'buyer') {
      const buyerStats = await getBuyerDashboard(user._id);
      dashboardData = { ...dashboardData, ...buyerStats };
    } else if (user.role === 'investor') {
      const investorStats = await getInvestorDashboard(user._id);
      dashboardData = { ...dashboardData, ...investorStats };
    }

    // Send real-time dashboard update
    realtimeService.updateDashboard(user._id, dashboardData);

    console.log('Dashboard response:', { success: true, data: dashboardData });

    res.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
});

// Get seller-specific dashboard data
async function getSellerDashboard(sellerId) {
  const [invoices, transactions, stats] = await Promise.all([
    Invoice.find({ sellerId })
      .populate('buyerId', 'profile.company')
      .populate('investorId', 'profile.company')
      .sort({ createdAt: -1 })
      .limit(10),
    
    Transaction.find({ sellerId })
      .sort({ createdAt: -1 })
      .limit(10),
    
    Invoice.aggregate([
      { $match: { sellerId: sellerId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$details.amount' }
        }
      }
    ])
  ]);

  const statusCounts = stats.reduce((acc, stat) => {
    acc[stat._id] = { count: stat.count, amount: stat.totalAmount };
    return acc;
  }, {});

  const totalInvoices = invoices.length;
  const totalAmount = stats.reduce((sum, stat) => sum + stat.totalAmount, 0);
  const fundedInvoices = statusCounts.funded?.count || 0;
  const pendingAmount = statusCounts.pending_buyer_confirmation?.amount || 0;

  return {
    invoices: {
      total: totalInvoices,
      pending: statusCounts.pending_buyer_confirmation?.count || 0,
      confirmed: statusCounts.confirmed?.count || 0,
      funded: fundedInvoices,
      repaid: statusCounts.repaid?.count || 0
    },
    amounts: {
      total: totalAmount,
      pending: pendingAmount,
      funded: statusCounts.funded?.amount || 0,
      received: statusCounts.repaid?.amount || 0
    },
    recentInvoices: invoices.slice(0, 5),
    recentTransactions: transactions.slice(0, 5),
    performance: {
      successRate: totalInvoices > 0 ? (fundedInvoices / totalInvoices * 100).toFixed(1) : 0,
      avgFundingTime: '2.5 days', // Calculate from actual data
      avgAmount: totalInvoices > 0 ? (totalAmount / totalInvoices).toFixed(0) : 0
    }
  };
}

// Get buyer-specific dashboard data
async function getBuyerDashboard(buyerId) {
  const [invoices, transactions, stats] = await Promise.all([
    Invoice.find({ buyerId })
      .populate('sellerId', 'profile.company')
      .populate('investorId', 'profile.company')
      .sort({ createdAt: -1 })
      .limit(10),
    
    Transaction.find({ buyerId })
      .sort({ createdAt: -1 })
      .limit(10),
    
    Invoice.aggregate([
      { $match: { buyerId: buyerId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$details.amount' }
        }
      }
    ])
  ]);

  const statusCounts = stats.reduce((acc, stat) => {
    acc[stat._id] = { count: stat.count, amount: stat.totalAmount };
    return acc;
  }, {});

  const pendingConfirmation = invoices.filter(inv => inv.status === 'pending_buyer_confirmation');
  const upcomingPayments = invoices.filter(inv => 
    inv.status === 'funded' && new Date(inv.details.dueDate) > new Date()
  );

  return {
    invoices: {
      total: invoices.length,
      pendingConfirmation: pendingConfirmation.length,
      confirmed: statusCounts.confirmed?.count || 0,
      funded: statusCounts.funded?.count || 0,
      paid: statusCounts.repaid?.count || 0
    },
    amounts: {
      total: stats.reduce((sum, stat) => sum + stat.totalAmount, 0),
      pendingConfirmation: pendingConfirmation.reduce((sum, inv) => sum + inv.details.amount, 0),
      upcomingPayments: upcomingPayments.reduce((sum, inv) => sum + inv.details.amount, 0)
    },
    pendingConfirmations: pendingConfirmation.slice(0, 5),
    upcomingPayments: upcomingPayments.slice(0, 5),
    recentTransactions: transactions.slice(0, 5)
  };
}

// Get investor-specific dashboard data
async function getInvestorDashboard(investorId) {
  const [investments, transactions, marketplaceCount, stats] = await Promise.all([
    Invoice.find({ investorId })
      .populate('sellerId', 'profile.company statistics')
      .populate('buyerId', 'profile.company statistics')
      .sort({ createdAt: -1 })
      .limit(10),
    
    Transaction.find({ investorId })
      .sort({ createdAt: -1 })
      .limit(10),
    
    Invoice.countDocuments({ 
      status: { $in: ['confirmed', 'listed'] },
      investorId: { $exists: false }
    }),
    
    Invoice.aggregate([
      { $match: { investorId: investorId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalInvested: { $sum: '$financing.fundedAmount' },
          totalReturns: { $sum: '$financing.actualReturn' }
        }
      }
    ])
  ]);

  const totalInvested = stats.reduce((sum, stat) => sum + (stat.totalInvested || 0), 0);
  const totalReturns = stats.reduce((sum, stat) => sum + (stat.totalReturns || 0), 0);
  const activeInvestments = investments.filter(inv => inv.status === 'funded').length;
  const completedInvestments = investments.filter(inv => inv.status === 'repaid').length;

  return {
    portfolio: {
      totalInvestments: investments.length,
      activeInvestments,
      completedInvestments,
      totalInvested,
      totalReturns,
      currentValue: totalInvested + totalReturns,
      roi: totalInvested > 0 ? ((totalReturns / totalInvested) * 100).toFixed(2) : 0
    },
    marketplace: {
      availableOpportunities: marketplaceCount
    },
    recentInvestments: investments.slice(0, 5),
    recentTransactions: transactions.slice(0, 5),
    performance: {
      successRate: investments.length > 0 ? (completedInvestments / investments.length * 100).toFixed(1) : 0,
      avgReturn: completedInvestments > 0 ? (totalReturns / completedInvestments).toFixed(0) : 0,
      avgInvestment: investments.length > 0 ? (totalInvested / investments.length).toFixed(0) : 0
    }
  };
}

// Get user portfolio (for investors)
router.get('/portfolio', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role !== 'investor') {
      return res.status(403).json({
        success: false,
        message: 'Portfolio is only available for investors'
      });
    }

    const { status, page = 1, limit = 10 } = req.query;

    const query = { investorId: req.user.id };
    if (status) {
      query.status = status;
    }

    const [investments, totalCount, summary] = await Promise.all([
      Invoice.find(query)
        .populate('sellerId', 'profile statistics')
        .populate('buyerId', 'profile statistics')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit)),
      
      Invoice.countDocuments(query),
      
      Invoice.aggregate([
        { $match: { investorId: user._id } },
        {
          $group: {
            _id: null,
            totalInvestments: { $sum: 1 },
            totalInvested: { $sum: '$financing.fundedAmount' },
            totalReturns: { $sum: '$financing.actualReturn' },
            avgRiskScore: { $avg: '$riskAssessment.score' }
          }
        }
      ])
    ]);

    const portfolioSummary = summary[0] || {
      totalInvestments: 0,
      totalInvested: 0,
      totalReturns: 0,
      avgRiskScore: 0
    };

    const portfolioData = {
      summary: {
        ...portfolioSummary,
        currentValue: portfolioSummary.totalInvested + portfolioSummary.totalReturns,
        roi: portfolioSummary.totalInvested > 0 ? 
          ((portfolioSummary.totalReturns / portfolioSummary.totalInvested) * 100).toFixed(2) : 0
      },
      investments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalItems: totalCount
      }
    };

    // Send real-time portfolio update
    realtimeService.updatePortfolio(user._id, portfolioData);

    res.json({
      success: true,
      data: portfolioData
    });

  } catch (error) {
    console.error('Portfolio error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch portfolio',
      error: error.message
    });
  }
});

// Get user transactions
router.get('/transactions', auth, async (req, res) => {
  try {
    const { type, status, page = 1, limit = 20 } = req.query;
    
    const user = await User.findById(req.user.id);
    const query = {};

    // Filter by user role
    if (user.role === 'seller') {
      query.sellerId = req.user.id;
    } else if (user.role === 'buyer') {
      query.buyerId = req.user.id;
    } else if (user.role === 'investor') {
      query.investorId = req.user.id;
    }

    // Additional filters
    if (type) query.type = type;
    if (status) query.status = status;

    const [transactions, totalCount] = await Promise.all([
      Transaction.find(query)
        .populate('invoiceId', 'invoiceNumber details.amount')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit)),
      
      Transaction.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalItems: totalCount
      }
    });

  } catch (error) {
    console.error('Transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
      error: error.message
    });
  }
});

// Get user statistics
router.get('/statistics', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { period = '30d' } = req.query;
    
    let dateFilter = new Date();
    switch (period) {
      case '7d':
        dateFilter.setDate(dateFilter.getDate() - 7);
        break;
      case '30d':
        dateFilter.setDate(dateFilter.getDate() - 30);
        break;
      case '90d':
        dateFilter.setDate(dateFilter.getDate() - 90);
        break;
      case '1y':
        dateFilter.setFullYear(dateFilter.getFullYear() - 1);
        break;
      default:
        dateFilter.setDate(dateFilter.getDate() - 30);
    }

    let statistics = {};

    if (user.role === 'seller') {
      statistics = await Invoice.aggregate([
        { 
          $match: { 
            sellerId: user._id,
            createdAt: { $gte: dateFilter }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            },
            count: { $sum: 1 },
            totalAmount: { $sum: '$details.amount' },
            fundedCount: {
              $sum: { $cond: [{ $eq: ['$status', 'funded'] }, 1, 0] }
            }
          }
        },
        { $sort: { _id: 1 } }
      ]);
    } else if (user.role === 'investor') {
      statistics = await Invoice.aggregate([
        { 
          $match: { 
            investorId: user._id,
            'workflow.fundedAt': { $gte: dateFilter }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$workflow.fundedAt" }
            },
            count: { $sum: 1 },
            totalInvested: { $sum: '$financing.fundedAmount' },
            totalReturns: { $sum: '$financing.actualReturn' }
          }
        },
        { $sort: { _id: 1 } }
      ]);
    }

    res.json({
      success: true,
      data: {
        period,
        statistics,
        userStats: user.statistics
      }
    });

  } catch (error) {
    console.error('Statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
});

// Update user preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const { notifications, investmentLimits } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (notifications) {
      user.preferences.notifications = {
        ...user.preferences.notifications,
        ...notifications
      };
    }

    if (investmentLimits && user.role === 'investor') {
      user.preferences.investmentLimits = {
        ...user.preferences.investmentLimits,
        ...investmentLimits
      };
    }

    await user.save();

    // Send real-time notification
    realtimeService.notifyUser(user._id, {
      type: 'preferences_updated',
      title: 'Preferences Updated',
      message: 'Your preferences have been updated successfully'
    });

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: user.preferences
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update preferences',
      error: error.message
    });
  }
});

// Get platform analytics (for admin users)
router.get('/analytics', auth, async (req, res) => {
  try {
    // This would typically be restricted to admin users
    const user = await User.findById(req.user.id);
    
    const [userStats, invoiceStats, transactionStats] = await Promise.all([
      User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 },
            verified: {
              $sum: { $cond: [{ $eq: ['$kyc.status', 'verified'] }, 1, 0] }
            }
          }
        }
      ]),
      
      Invoice.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$details.amount' }
          }
        }
      ]),
      
      Transaction.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' }
          }
        }
      ])
    ]);

    const analytics = {
      users: userStats,
      invoices: invoiceStats,
      transactions: transactionStats,
      timestamp: new Date().toISOString()
    };

    // Broadcast analytics update
    realtimeService.broadcastAnalytics(analytics);

    res.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
});

module.exports = router;