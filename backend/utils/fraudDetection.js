const Invoice = require('../models/Invoice');
const User = require('../models/User');

class FraudDetection {
  
  // Main fraud check function
  async checkInvoice(invoice, seller) {
    const checks = await Promise.all([
      this.checkDuplicateInvoice(invoice),
      this.checkAmountAnomalies(invoice, seller),
      this.checkRapidCreation(seller._id),
      this.checkSellerHistory(seller),
      this.checkInvoicePattern(invoice)
    ]);

    const flags = checks.filter(check => check.flag).map(check => check.reason);
    const riskScore = this.calculateRiskScore(checks);

    return {
      status: flags.length > 0 ? 'failed' : 'passed',
      checkedAt: new Date(),
      flags,
      riskScore,
      details: checks
    };
  }

  // Check for duplicate invoices
  async checkDuplicateInvoice(invoice) {
    try {
      // Check by invoice number
      const duplicateByNumber = await Invoice.findOne({
        invoiceNumber: invoice.invoiceNumber,
        _id: { $ne: invoice._id }
      });

      if (duplicateByNumber) {
        return {
          check: 'duplicate_invoice_number',
          flag: true,
          reason: 'Duplicate invoice number detected',
          severity: 'high',
          details: { duplicateId: duplicateByNumber._id }
        };
      }

      // Check by content similarity (amount, dates, seller, buyer)
      const similarInvoices = await Invoice.find({
        sellerId: invoice.sellerId,
        buyerId: invoice.buyerId,
        'details.amount': invoice.details.amount,
        'details.issueDate': invoice.details.issueDate,
        _id: { $ne: invoice._id }
      });

      if (similarInvoices.length > 0) {
        return {
          check: 'similar_invoice_content',
          flag: true,
          reason: 'Similar invoice content detected',
          severity: 'medium',
          details: { similarInvoices: similarInvoices.map(inv => inv._id) }
        };
      }

      return {
        check: 'duplicate_invoice',
        flag: false,
        reason: 'No duplicates found',
        severity: 'none'
      };

    } catch (error) {
      console.error('Duplicate check error:', error);
      return {
        check: 'duplicate_invoice',
        flag: false,
        reason: 'Check failed',
        severity: 'none',
        error: error.message
      };
    }
  }

  // Check for amount anomalies
  async checkAmountAnomalies(invoice, seller) {
    try {
      const amount = invoice.details.amount;
      
      // Get seller's historical invoice amounts
      const historicalInvoices = await Invoice.find({
        sellerId: seller._id,
        status: { $in: ['confirmed', 'funded', 'repaid'] }
      }).select('details.amount');

      if (historicalInvoices.length === 0) {
        return {
          check: 'amount_anomaly',
          flag: false,
          reason: 'No historical data for comparison',
          severity: 'none'
        };
      }

      const amounts = historicalInvoices.map(inv => inv.details.amount);
      const avgAmount = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length;
      const maxAmount = Math.max(...amounts);
      const minAmount = Math.min(...amounts);

      // Check for unusually high amount (more than 5x average or 2x max)
      if (amount > avgAmount * 5 || amount > maxAmount * 2) {
        return {
          check: 'amount_anomaly',
          flag: true,
          reason: 'Unusually high invoice amount',
          severity: 'high',
          details: { 
            currentAmount: amount,
            avgAmount: avgAmount.toFixed(2),
            maxAmount,
            ratio: (amount / avgAmount).toFixed(2)
          }
        };
      }

      // Check for unusually low amount (less than 10% of average)
      if (amount < avgAmount * 0.1 && amount < minAmount * 0.5) {
        return {
          check: 'amount_anomaly',
          flag: true,
          reason: 'Unusually low invoice amount',
          severity: 'medium',
          details: { 
            currentAmount: amount,
            avgAmount: avgAmount.toFixed(2),
            minAmount,
            ratio: (amount / avgAmount).toFixed(2)
          }
        };
      }

      return {
        check: 'amount_anomaly',
        flag: false,
        reason: 'Amount within normal range',
        severity: 'none',
        details: { 
          currentAmount: amount,
          avgAmount: avgAmount.toFixed(2)
        }
      };

    } catch (error) {
      console.error('Amount anomaly check error:', error);
      return {
        check: 'amount_anomaly',
        flag: false,
        reason: 'Check failed',
        severity: 'none',
        error: error.message
      };
    }
  }

  // Check for rapid invoice creation
  async checkRapidCreation(sellerId) {
    try {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const [recentInvoices, dailyInvoices] = await Promise.all([
        Invoice.countDocuments({
          sellerId,
          createdAt: { $gte: oneHourAgo }
        }),
        Invoice.countDocuments({
          sellerId,
          createdAt: { $gte: oneDayAgo }
        })
      ]);

      // Flag if more than 5 invoices in 1 hour
      if (recentInvoices > 5) {
        return {
          check: 'rapid_creation',
          flag: true,
          reason: 'Too many invoices created in short time',
          severity: 'high',
          details: { 
            invoicesInHour: recentInvoices,
            invoicesInDay: dailyInvoices
          }
        };
      }

      // Flag if more than 20 invoices in 1 day
      if (dailyInvoices > 20) {
        return {
          check: 'rapid_creation',
          flag: true,
          reason: 'Unusually high daily invoice creation',
          severity: 'medium',
          details: { 
            invoicesInDay: dailyInvoices
          }
        };
      }

      return {
        check: 'rapid_creation',
        flag: false,
        reason: 'Normal creation rate',
        severity: 'none',
        details: { 
          invoicesInHour: recentInvoices,
          invoicesInDay: dailyInvoices
        }
      };

    } catch (error) {
      console.error('Rapid creation check error:', error);
      return {
        check: 'rapid_creation',
        flag: false,
        reason: 'Check failed',
        severity: 'none',
        error: error.message
      };
    }
  }

  // Check seller's historical performance
  async checkSellerHistory(seller) {
    try {
      const totalInvoices = seller.statistics.totalInvoices;
      const successfulTransactions = seller.statistics.successfulTransactions;
      
      if (totalInvoices === 0) {
        return {
          check: 'seller_history',
          flag: false,
          reason: 'New seller - no history',
          severity: 'none'
        };
      }

      const successRate = (successfulTransactions / totalInvoices) * 100;

      // Flag if success rate is below 50% and has more than 5 invoices
      if (successRate < 50 && totalInvoices > 5) {
        return {
          check: 'seller_history',
          flag: true,
          reason: 'Poor historical performance',
          severity: 'high',
          details: { 
            successRate: successRate.toFixed(2),
            totalInvoices,
            successfulTransactions
          }
        };
      }

      // Flag if success rate is below 70% and has more than 10 invoices
      if (successRate < 70 && totalInvoices > 10) {
        return {
          check: 'seller_history',
          flag: true,
          reason: 'Below average performance',
          severity: 'medium',
          details: { 
            successRate: successRate.toFixed(2),
            totalInvoices,
            successfulTransactions
          }
        };
      }

      return {
        check: 'seller_history',
        flag: false,
        reason: 'Good historical performance',
        severity: 'none',
        details: { 
          successRate: successRate.toFixed(2),
          totalInvoices,
          successfulTransactions
        }
      };

    } catch (error) {
      console.error('Seller history check error:', error);
      return {
        check: 'seller_history',
        flag: false,
        reason: 'Check failed',
        severity: 'none',
        error: error.message
      };
    }
  }

  // Check invoice pattern anomalies
  async checkInvoicePattern(invoice) {
    try {
      const flags = [];
      
      // Check due date (should be reasonable - between 1 day and 1 year)
      const issueDate = new Date(invoice.details.issueDate);
      const dueDate = new Date(invoice.details.dueDate);
      const daysDiff = Math.ceil((dueDate - issueDate) / (1000 * 60 * 60 * 24));

      if (daysDiff < 1) {
        flags.push('Due date is before or same as issue date');
      } else if (daysDiff > 365) {
        flags.push('Due date is more than 1 year from issue date');
      } else if (daysDiff < 7) {
        flags.push('Very short payment term (less than 7 days)');
      }

      // Check if issue date is in the future
      const now = new Date();
      if (issueDate > now) {
        flags.push('Issue date is in the future');
      }

      // Check if issue date is too old (more than 1 year ago)
      const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      if (issueDate < oneYearAgo) {
        flags.push('Issue date is more than 1 year old');
      }

      // Check amount patterns
      const amount = invoice.details.amount;
      
      // Check for round numbers (might indicate fake invoices)
      if (amount % 10000 === 0 && amount >= 100000) {
        flags.push('Amount is a very round number');
      }

      // Check for unusual decimal patterns
      const decimalPart = amount % 1;
      if (decimalPart !== 0 && decimalPart.toString().length > 4) {
        flags.push('Unusual decimal precision in amount');
      }

      const severity = flags.length > 2 ? 'high' : flags.length > 0 ? 'medium' : 'none';

      return {
        check: 'invoice_pattern',
        flag: flags.length > 0,
        reason: flags.length > 0 ? 'Pattern anomalies detected' : 'Normal invoice pattern',
        severity,
        details: { 
          flags,
          daysDiff,
          amount
        }
      };

    } catch (error) {
      console.error('Invoice pattern check error:', error);
      return {
        check: 'invoice_pattern',
        flag: false,
        reason: 'Check failed',
        severity: 'none',
        error: error.message
      };
    }
  }

  // Calculate overall risk score based on all checks
  calculateRiskScore(checks) {
    let score = 100; // Start with perfect score

    checks.forEach(check => {
      if (check.flag) {
        switch (check.severity) {
          case 'high':
            score -= 30;
            break;
          case 'medium':
            score -= 15;
            break;
          case 'low':
            score -= 5;
            break;
        }
      }
    });

    return Math.max(0, score); // Ensure score doesn't go below 0
  }

  // Check buyer authenticity (to be called when buyer confirms)
  async checkBuyerAuthenticity(invoice, buyer) {
    try {
      const checks = [];

      // Check if buyer has confirmed invoices before
      const previousConfirmations = await Invoice.countDocuments({
        buyerId: buyer._id,
        'verification.buyerConfirmed': true
      });

      if (previousConfirmations === 0) {
        checks.push({
          check: 'buyer_experience',
          flag: true,
          reason: 'First-time buyer confirmation',
          severity: 'medium'
        });
      }

      // Check confirmation time (too quick might be suspicious)
      const createdAt = new Date(invoice.createdAt);
      const now = new Date();
      const minutesDiff = (now - createdAt) / (1000 * 60);

      if (minutesDiff < 5) {
        checks.push({
          check: 'confirmation_speed',
          flag: true,
          reason: 'Very quick confirmation (less than 5 minutes)',
          severity: 'medium'
        });
      }

      return {
        status: checks.some(c => c.flag) ? 'warning' : 'passed',
        checks,
        checkedAt: new Date()
      };

    } catch (error) {
      console.error('Buyer authenticity check error:', error);
      return {
        status: 'error',
        error: error.message,
        checkedAt: new Date()
      };
    }
  }

  // Real-time risk monitoring
  async monitorRealTimeRisk(userId, action, data) {
    try {
      const alerts = [];
      const now = new Date();

      switch (action) {
        case 'login':
          // Check for multiple rapid logins
          const recentLogins = await this.getRecentUserActivity(userId, 'login', 60); // Last hour
          if (recentLogins > 10) {
            alerts.push({
              type: 'suspicious_login_pattern',
              severity: 'high',
              message: 'Multiple rapid logins detected'
            });
          }
          break;

        case 'invoice_creation':
          // Already handled in main fraud check
          break;

        case 'funding_attempt':
          // Check for rapid funding attempts
          const recentFunding = await this.getRecentUserActivity(userId, 'funding', 60);
          if (recentFunding > 5) {
            alerts.push({
              type: 'rapid_funding_attempts',
              severity: 'medium',
              message: 'Multiple funding attempts in short time'
            });
          }
          break;
      }

      return {
        alerts,
        timestamp: now,
        riskLevel: alerts.some(a => a.severity === 'high') ? 'high' : 
                  alerts.some(a => a.severity === 'medium') ? 'medium' : 'low'
      };

    } catch (error) {
      console.error('Real-time risk monitoring error:', error);
      return {
        alerts: [],
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  // Helper function to get recent user activity
  async getRecentUserActivity(userId, activityType, minutes) {
    // This would typically query an activity log table
    // For now, we'll simulate based on existing data
    
    const since = new Date(Date.now() - minutes * 60 * 1000);
    
    switch (activityType) {
      case 'login':
        // Would query login logs
        return 0;
      
      case 'invoice_creation':
        return await Invoice.countDocuments({
          sellerId: userId,
          createdAt: { $gte: since }
        });
      
      case 'funding':
        return await Invoice.countDocuments({
          investorId: userId,
          'workflow.fundedAt': { $gte: since }
        });
      
      default:
        return 0;
    }
  }
}

module.exports = new FraudDetection();