const axios = require('axios');
const mongoose = require('mongoose');

const BASE_URL = 'http://localhost:5003/api';

async function detailedDebug() {
  try {
    // Connect to MongoDB to check directly
    await mongoose.connect('mongodb://localhost:27017/blc-enhanced');
    const Invoice = require('./models/Invoice');
    
    // Login as buyer
    const buyerLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'buyer@example.com',
      password: 'password123'
    });
    
    const buyerToken = buyerLogin.data.data.token;
    const buyerId = buyerLogin.data.data.user.id;
    console.log('🔍 Buyer ID from JWT:', buyerId);
    console.log('🔍 Buyer ID type:', typeof buyerId);

    // Get the latest invoice from database
    const latestInvoice = await Invoice.findOne().sort({ createdAt: -1 });
    console.log('🔍 Latest invoice buyerId (raw):', latestInvoice.buyerId);
    console.log('🔍 Latest invoice buyerId type:', typeof latestInvoice.buyerId);
    console.log('🔍 Latest invoice buyerId toString():', latestInvoice.buyerId.toString());
    
    console.log('🔍 Comparison result:', latestInvoice.buyerId.toString() === buyerId);
    
    // Try the API call
    try {
      const confirmResponse = await axios.post(`${BASE_URL}/invoices/${latestInvoice._id}/confirm`, 
        { confirmed: true, notes: 'Test confirmation' },
        { headers: { Authorization: `Bearer ${buyerToken}` } }
      );
      console.log('✅ Confirmation successful:', confirmResponse.data.message);
    } catch (error) {
      console.log('❌ Confirmation failed:', error.response?.data?.message);
    }
    
    mongoose.disconnect();

  } catch (error) {
    console.log('❌ Debug failed:', error.message);
  }
}

detailedDebug();