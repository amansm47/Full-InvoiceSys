const axios = require('axios');

const BASE_URL = 'http://localhost:5003/api';

async function setupTestUsers() {
  const users = {
    seller: {
      email: 'seller@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'seller',
      firstName: 'John',
      lastName: 'Seller',
      phone: '9876543210',
      company: 'Seller Company'
    },
    buyer: {
      email: 'buyer@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'buyer',
      firstName: 'Jane',
      lastName: 'Buyer',
      phone: '9876543211',
      company: 'Buyer Company'
    },
    investor: {
      email: 'investor@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'investor',
      firstName: 'Bob',
      lastName: 'Investor',
      phone: '9876543212',
      company: 'Investment Firm'
    }
  };

  const tokens = {};

  for (const [role, userData] of Object.entries(users)) {
    try {
      // Try to register
      await axios.post(`${BASE_URL}/auth/register`, userData);
      console.log(`✅ ${role} registered`);
    } catch (error) {
      if (error.response?.status === 409) {
        console.log(`⚠️ ${role} already exists`);
      } else {
        console.log(`❌ ${role} registration failed:`, error.response?.data?.message);
        continue;
      }
    }

    // Login to get token
    try {
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: userData.email,
        password: userData.password
      });
      tokens[role] = loginResponse.data.data.token;
      console.log(`✅ ${role} logged in`);

      // Update KYC to verified for testing
      await axios.post(`${BASE_URL}/auth/kyc`, 
        { status: 'verified' },
        { headers: { Authorization: `Bearer ${tokens[role]}` } }
      );
      console.log(`✅ ${role} KYC verified`);

    } catch (error) {
      console.log(`❌ ${role} login failed:`, error.response?.data?.message);
    }
  }

  return tokens;
}

async function testCompleteFlow() {
  console.log('🚀 Setting up test users...\n');
  const tokens = await setupTestUsers();

  if (!tokens.seller || !tokens.buyer || !tokens.investor) {
    console.log('❌ Failed to setup all users');
    return;
  }

  console.log('\n📄 Testing invoice creation...');
  
  // Create invoice
  const invoiceData = {
    invoiceNumber: 'INV-' + Date.now(),
    buyerEmail: 'buyer@example.com',
    amount: 50000,
    issueDate: new Date().toISOString(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Test invoice for services',
    requestedAmount: 45000,
    discountRate: 10
  };

  try {
    const createResponse = await axios.post(`${BASE_URL}/invoices/create`, invoiceData, {
      headers: { Authorization: `Bearer ${tokens.seller}` }
    });
    
    const invoiceId = createResponse.data.data._id;
    console.log('✅ Invoice created:', createResponse.data.data.invoiceNumber);
    console.log('📊 Status:', createResponse.data.data.status);

    console.log('\n✅ Testing buyer confirmation...');
    
    // Buyer confirms invoice
    const confirmResponse = await axios.post(`${BASE_URL}/invoices/${invoiceId}/confirm`, 
      { confirmed: true, notes: 'Invoice looks good' },
      { headers: { Authorization: `Bearer ${tokens.buyer}` } }
    );
    
    console.log('✅ Invoice confirmed, new status:', confirmResponse.data.data.status);

    console.log('\n💰 Testing marketplace listing...');
    
    // Get marketplace listings
    const marketplaceResponse = await axios.get(`${BASE_URL}/invoices/marketplace/listings`, {
      headers: { Authorization: `Bearer ${tokens.investor}` }
    });
    
    console.log('✅ Marketplace listings:', marketplaceResponse.data.data.length);

    console.log('\n💸 Testing invoice funding...');
    
    // Investor funds invoice
    const fundResponse = await axios.post(`${BASE_URL}/invoices/${invoiceId}/fund`,
      { amount: 45000, paymentMethod: 'bank_transfer' },
      { headers: { Authorization: `Bearer ${tokens.investor}` } }
    );
    
    console.log('✅ Invoice funded:', fundResponse.data.message);
    console.log('📊 Final status:', fundResponse.data.data.invoice.status);

    console.log('\n🎉 Complete invoice flow test successful!');

  } catch (error) {
    console.log('❌ Flow test failed:', error.response?.data?.message || error.message);
  }
}

testCompleteFlow();