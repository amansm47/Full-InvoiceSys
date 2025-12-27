const mongoose = require('mongoose');
require('dotenv').config();

async function checkDatabase() {
  try {
    console.log('🔍 Checking database connection and data...\n');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/invoice-financing-realtime', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    console.log('📊 Database:', mongoose.connection.name);
    
    // Check collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Collections:', collections.map(c => c.name).join(', '));
    
    // Check users collection
    const User = require('./models/User');
    const userCount = await User.countDocuments();
    console.log('👥 Total users:', userCount);
    
    if (userCount > 0) {
      const users = await User.find().select('email role createdAt').limit(5);
      console.log('📋 Recent users:');
      users.forEach(user => {
        console.log(`   - ${user.email} (${user.role}) - ${user.createdAt.toLocaleDateString()}`);
      });
    }
    
    // Check invoices collection
    const Invoice = require('./models/Invoice');
    const invoiceCount = await Invoice.countDocuments();
    console.log('📄 Total invoices:', invoiceCount);
    
    // Check transactions collection
    const Transaction = require('./models/Transaction');
    const transactionCount = await Transaction.countDocuments();
    console.log('💰 Total transactions:', transactionCount);
    
    console.log('\n🎯 Database Status: HEALTHY');
    
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

checkDatabase();