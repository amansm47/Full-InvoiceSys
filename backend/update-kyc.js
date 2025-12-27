const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

async function updateKYC() {
  try {
    // Login as seller
    console.log('🔐 Logging in as seller...');
    const sellerLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'myseller@test.com',
      password: 'password123'
    });
    const sellerToken = sellerLogin.data.data.token;

    // Update seller KYC
    console.log('📋 Updating seller KYC...');
    await axios.post(`${BASE_URL}/auth/kyc`, {
      status: 'verified'
    }, {
      headers: { Authorization: `Bearer ${sellerToken}` }
    });
    console.log('✅ Seller KYC verified');

    // Login as buyer
    console.log('\n🔐 Logging in as buyer...');
    const buyerLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'mybuyer@test.com',
      password: 'password123'
    });
    const buyerToken = buyerLogin.data.data.token;

    // Update buyer KYC
    console.log('📋 Updating buyer KYC...');
    await axios.post(`${BASE_URL}/auth/kyc`, {
      status: 'verified'
    }, {
      headers: { Authorization: `Bearer ${buyerToken}` }
    });
    console.log('✅ Buyer KYC verified');

    // Login as investor
    console.log('\n🔐 Logging in as investor...');
    const investorLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'myinvestor@test.com',
      password: 'password123'
    });
    const investorToken = investorLogin.data.data.token;

    // Update investor KYC
    console.log('📋 Updating investor KYC...');
    await axios.post(`${BASE_URL}/auth/kyc`, {
      status: 'verified'
    }, {
      headers: { Authorization: `Bearer ${investorToken}` }
    });
    console.log('✅ Investor KYC verified');

    console.log('\n🎉 All users KYC verified!');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

updateKYC();