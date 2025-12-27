const axios = require('axios');

const BASE_URL = 'http://localhost:5003/api';

async function testFunding() {
  try {
    // Login as investor
    const investorLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'investor@example.com',
      password: 'password123'
    });
    
    const investorToken = investorLogin.data.data.token;
    console.log('✅ Investor logged in');

    // Get marketplace listings
    const marketplaceResponse = await axios.get(`${BASE_URL}/invoices/marketplace/listings`, {
      headers: { Authorization: `Bearer ${investorToken}` }
    });
    
    console.log('📊 Available listings:', marketplaceResponse.data.data.length);
    
    if (marketplaceResponse.data.data.length > 0) {
      const listing = marketplaceResponse.data.data[0];
      console.log('📋 Funding invoice:', listing.invoiceNumber);
      console.log('💰 Requested amount:', listing.requestedAmount);
      
      // Try to fund
      try {
        const fundResponse = await axios.post(`${BASE_URL}/invoices/${listing._id}/fund`,
          { amount: listing.requestedAmount, paymentMethod: 'bank_transfer' },
          { headers: { Authorization: `Bearer ${investorToken}` } }
        );
        
        console.log('✅ Funding successful:', fundResponse.data.message);
        console.log('📊 Transaction ID:', fundResponse.data.data.transaction.transactionId);
        
      } catch (error) {
        console.log('❌ Funding failed:', error.response?.data?.message);
        console.log('🔍 Error details:', error.response?.data);
        console.log('🔍 Full error:', error.message);
      }
    } else {
      console.log('⚠️ No listings available for funding');
    }

  } catch (error) {
    console.log('❌ Test failed:', error.response?.data?.message || error.message);
  }
}

testFunding();