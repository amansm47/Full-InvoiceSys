const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

async function testInvoiceCreation() {
  try {
    // Login as seller first
    console.log('🔐 Logging in as seller...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'myseller@test.com',
      password: 'password123'
    });
    
    const sellerToken = loginResponse.data.data.token;
    console.log('✅ Seller logged in');

    // Create invoice with all required fields
    console.log('\n📄 Creating invoice...');
    const invoiceData = {
      invoiceNumber: `INV-${Date.now()}`,
      buyerEmail: 'mybuyer@test.com',
      amount: 50000,
      issueDate: '2024-12-27',
      dueDate: '2025-01-27',
      description: 'Supply of goods and services',
      requestedAmount: 45000,
      discountRate: 10
    };

    const invoiceResponse = await axios.post(`${BASE_URL}/invoices/create`, invoiceData, {
      headers: { Authorization: `Bearer ${sellerToken}` }
    });

    console.log('✅ Invoice created successfully');
    console.log('Invoice ID:', invoiceResponse.data.data._id);
    console.log('Status:', invoiceResponse.data.data.status);

    // Get invoices
    console.log('\n📋 Getting invoices...');
    const invoicesResponse = await axios.get(`${BASE_URL}/invoices`, {
      headers: { Authorization: `Bearer ${sellerToken}` }
    });

    console.log('✅ Invoices fetched');
    console.log('Total invoices:', invoicesResponse.data.data.length);

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testInvoiceCreation();