const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Invoice = require('./models/Invoice');
const Transaction = require('./models/Transaction');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/invoice-financing-realtime', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Invoice.deleteMany({});
    await Transaction.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create demo users
    const users = await createUsers();
    console.log('👥 Created demo users');

    // Create demo invoices
    const invoices = await createInvoices(users);
    console.log('📄 Created demo invoices');

    // Create demo transactions
    await createTransactions(invoices, users);
    console.log('💰 Created demo transactions');

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`Users: ${users.length}`);
    console.log(`Invoices: ${invoices.length}`);
    
    console.log('\n🔐 Demo Login Credentials:');
    console.log('Seller: seller@demo.com / password123');
    console.log('Buyer: buyer@demo.com / password123');
    console.log('Investor: investor@demo.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

const createUsers = async () => {
  const users = [
    // Sellers
    {
      email: 'seller@demo.com',
      password: 'password123',
      role: 'seller',
      profile: {
        firstName: 'Rohan',
        lastName: 'Sharma',
        phone: '+91-9876543210',
        company: 'Rohan\'s Bakery',
        gstNumber: '27AABCU9603R1ZX',
        panNumber: 'AABCU9603R'
      },
      kyc: { status: 'verified', verifiedAt: new Date() },
      statistics: {
        totalInvoices: 15,
        totalAmount: 450000,
        successfulTransactions: 12,
        rating: 4.5,
        ratingCount: 8
      }
    },
    {
      email: 'seller2@demo.com',
      password: 'password123',
      role: 'seller',
      profile: {
        firstName: 'Priya',
        lastName: 'Patel',
        phone: '+91-9876543211',
        company: 'Patel Textiles',
        gstNumber: '24AABCP9603R1ZY',
        panNumber: 'AABCP9603R'
      },
      kyc: { status: 'verified', verifiedAt: new Date() },
      statistics: {
        totalInvoices: 8,
        totalAmount: 320000,
        successfulTransactions: 7,
        rating: 4.2,
        ratingCount: 5
      }
    },
    
    // Buyers
    {
      email: 'buyer@demo.com',
      password: 'password123',
      role: 'buyer',
      profile: {
        firstName: 'Amit',
        lastName: 'Kumar',
        phone: '+91-9876543212',
        company: 'Grand Hotel Chain',
        gstNumber: '07AABCG9603R1ZZ',
        panNumber: 'AABCG9603R'
      },
      kyc: { status: 'verified', verifiedAt: new Date() },
      statistics: {
        totalInvoices: 25,
        totalAmount: 850000,
        successfulTransactions: 23,
        rating: 4.8,
        ratingCount: 15
      }
    },
    {
      email: 'buyer2@demo.com',
      password: 'password123',
      role: 'buyer',
      profile: {
        firstName: 'Sunita',
        lastName: 'Singh',
        phone: '+91-9876543213',
        company: 'Singh Retail Stores',
        gstNumber: '09AABCS9603R1ZA',
        panNumber: 'AABCS9603R'
      },
      kyc: { status: 'verified', verifiedAt: new Date() },
      statistics: {
        totalInvoices: 12,
        totalAmount: 380000,
        successfulTransactions: 11,
        rating: 4.6,
        ratingCount: 8
      }
    },
    
    // Investors
    {
      email: 'investor@demo.com',
      password: 'password123',
      role: 'investor',
      profile: {
        firstName: 'Rajesh',
        lastName: 'Gupta',
        phone: '+91-9876543214',
        company: 'Gupta Investments',
        panNumber: 'AABCR9603R'
      },
      kyc: { status: 'verified', verifiedAt: new Date() },
      statistics: {
        totalInvoices: 35,
        totalAmount: 1250000,
        successfulTransactions: 32,
        rating: 4.9,
        ratingCount: 20
      },
      preferences: {
        investmentLimits: {
          minAmount: 5000,
          maxAmount: 100000,
          riskTolerance: 'medium'
        }
      }
    },
    {
      email: 'investor2@demo.com',
      password: 'password123',
      role: 'investor',
      profile: {
        firstName: 'Meera',
        lastName: 'Jain',
        phone: '+91-9876543215',
        company: 'Jain Capital',
        panNumber: 'AABCM9603R'
      },
      kyc: { status: 'verified', verifiedAt: new Date() },
      statistics: {
        totalInvoices: 18,
        totalAmount: 680000,
        successfulTransactions: 16,
        rating: 4.7,
        ratingCount: 12
      },
      preferences: {
        investmentLimits: {
          minAmount: 10000,
          maxAmount: 200000,
          riskTolerance: 'high'
        }
      }
    }
  ];

  const createdUsers = [];
  for (const userData of users) {
    const user = new User(userData);
    await user.save();
    createdUsers.push(user);
  }

  return createdUsers;
};

const createInvoices = async (users) => {
  const sellers = users.filter(u => u.role === 'seller');
  const buyers = users.filter(u => u.role === 'buyer');
  const investors = users.filter(u => u.role === 'investor');

  const invoiceTemplates = [
    {
      description: 'Fresh bread and pastries supply',
      items: [
        { description: 'White Bread Loaves', quantity: 50, rate: 25, amount: 1250 },
        { description: 'Croissants', quantity: 30, rate: 15, amount: 450 },
        { description: 'Muffins', quantity: 40, rate: 20, amount: 800 }
      ]
    },
    {
      description: 'Cotton fabric and textile materials',
      items: [
        { description: 'Cotton Fabric (meters)', quantity: 100, rate: 150, amount: 15000 },
        { description: 'Silk Fabric (meters)', quantity: 25, rate: 400, amount: 10000 }
      ]
    },
    {
      description: 'Office supplies and stationery',
      items: [
        { description: 'A4 Paper Reams', quantity: 20, rate: 250, amount: 5000 },
        { description: 'Pens (boxes)', quantity: 10, rate: 120, amount: 1200 }
      ]
    }
  ];

  const invoices = [];
  const statuses = ['confirmed', 'listed', 'funded', 'repaid'];

  for (let i = 0; i < 20; i++) {
    const seller = sellers[i % sellers.length];
    const buyer = buyers[i % buyers.length];
    const template = invoiceTemplates[i % invoiceTemplates.length];
    
    const issueDate = new Date();
    issueDate.setDate(issueDate.getDate() - Math.floor(Math.random() * 30));
    
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + 30 + Math.floor(Math.random() * 60));

    const totalAmount = template.items.reduce((sum, item) => sum + item.amount, 0);
    const gstAmount = totalAmount * 0.18;
    const finalAmount = totalAmount + gstAmount;

    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const investor = status === 'funded' || status === 'repaid' ? 
      investors[Math.floor(Math.random() * investors.length)] : null;

    const invoice = new Invoice({
      invoiceNumber: `INV-${Date.now()}-${i.toString().padStart(3, '0')}`,
      sellerId: seller._id,
      buyerId: buyer._id,
      investorId: investor?._id,
      details: {
        amount: finalAmount,
        issueDate,
        dueDate,
        description: template.description,
        items: template.items,
        taxes: {
          cgst: gstAmount / 2,
          sgst: gstAmount / 2,
          total: gstAmount
        }
      },
      status,
      financing: {
        requestedAmount: finalAmount * 0.9, // 90% of invoice amount
        discountRate: 8 + Math.random() * 7, // 8-15%
        fundedAmount: investor ? finalAmount * 0.9 : undefined,
        expectedReturn: investor ? finalAmount : undefined,
        actualReturn: status === 'repaid' ? finalAmount : undefined
      },
      verification: {
        buyerConfirmed: ['confirmed', 'listed', 'funded', 'repaid'].includes(status),
        buyerConfirmedAt: ['confirmed', 'listed', 'funded', 'repaid'].includes(status) ? 
          new Date(issueDate.getTime() + 24 * 60 * 60 * 1000) : undefined,
        fraudCheck: {
          status: 'passed',
          checkedAt: new Date()
        }
      },
      riskAssessment: {
        score: 60 + Math.random() * 30, // 60-90 score
        category: Math.random() > 0.7 ? 'low' : Math.random() > 0.3 ? 'medium' : 'high',
        assessedAt: new Date()
      },
      workflow: {
        createdAt: issueDate,
        buyerConfirmedAt: ['confirmed', 'listed', 'funded', 'repaid'].includes(status) ? 
          new Date(issueDate.getTime() + 24 * 60 * 60 * 1000) : undefined,
        listedAt: ['listed', 'funded', 'repaid'].includes(status) ? 
          new Date(issueDate.getTime() + 48 * 60 * 60 * 1000) : undefined,
        fundedAt: ['funded', 'repaid'].includes(status) ? 
          new Date(issueDate.getTime() + 72 * 60 * 60 * 1000) : undefined,
        repaidAt: status === 'repaid' ? dueDate : undefined
      }
    });

    await invoice.save();
    invoices.push(invoice);
  }

  return invoices;
};

const createTransactions = async (invoices, users) => {
  const transactions = [];

  for (const invoice of invoices) {
    if (['funded', 'repaid'].includes(invoice.status)) {
      // Create funding transaction
      const fundingTransaction = new Transaction({
        transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 5)}`.toUpperCase(),
        invoiceId: invoice._id,
        sellerId: invoice.sellerId,
        investorId: invoice.investorId,
        type: 'funding',
        amount: invoice.financing.fundedAmount,
        status: 'completed',
        payment: {
          method: 'bank_transfer',
          gatewayTransactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 5)}`
        },
        fees: {
          platform: invoice.financing.fundedAmount * 0.02, // 2% platform fee
          processing: 100 // Fixed processing fee
        },
        timing: {
          initiatedAt: invoice.workflow.fundedAt,
          completedAt: invoice.workflow.fundedAt
        },
        audit: {
          initiatedBy: invoice.investorId,
          source: 'web'
        }
      });

      await fundingTransaction.save();
      transactions.push(fundingTransaction);

      // Create repayment transaction if invoice is repaid
      if (invoice.status === 'repaid') {
        const repaymentTransaction = new Transaction({
          transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 5)}`.toUpperCase(),
          invoiceId: invoice._id,
          buyerId: invoice.buyerId,
          investorId: invoice.investorId,
          type: 'repayment',
          amount: invoice.details.amount,
          status: 'completed',
          payment: {
            method: 'bank_transfer',
            gatewayTransactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 5)}`
          },
          fees: {
            processing: 50
          },
          timing: {
            initiatedAt: invoice.workflow.repaidAt,
            completedAt: invoice.workflow.repaidAt
          },
          audit: {
            initiatedBy: invoice.buyerId,
            source: 'web'
          }
        });

        await repaymentTransaction.save();
        transactions.push(repaymentTransaction);
      }
    }
  }

  return transactions;
};

// Run the seeding
seedData();