const axios = require('axios');

const BASE_URL = 'http://localhost:5003/api';

async function testInvoiceFlow() {
  try {
    // Login as seller
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.data.token;
    console.log('✅ Logged in as seller');

    // Test invoice creation
    const invoiceData = {
      invoiceNumber: 'INV-' + Date.now(),
      buyerEmail: 'buyer@example.com', // Required field
      amount: 50000,
      issueDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Test invoice for services',
      requestedAmount: 45000,
      discountRate: 10
    };

    const createResponse = await axios.post(`${BASE_URL}/invoices/create`, invoiceData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Invoice created:', createResponse.data.data.invoiceNumber);
    console.log('📊 Status:', createResponse.data.data.status);
    
  } catch (error) {
    console.log('❌ Error:', error.response?.data?.message || error.message);
  }
}

testInvoiceFlow();