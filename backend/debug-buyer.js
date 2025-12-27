const axios = require('axios');

const BASE_URL = 'http://localhost:5003/api';

async function debugBuyerConfirmation() {
  try {
    // Login as buyer
    const buyerLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'buyer@example.com',
      password: 'password123'
    });
    
    const buyerToken = buyerLogin.data.data.token;
    const buyerId = buyerLogin.data.data.user.id;
    console.log('✅ Buyer logged in, ID:', buyerId);

    // Get invoices for buyer
    const invoicesResponse = await axios.get(`${BASE_URL}/invoices`, {
      headers: { Authorization: `Bearer ${buyerToken}` }
    });
    
    console.log('📄 Invoices for buyer:', invoicesResponse.data.data.length);
    
    if (invoicesResponse.data.data.length > 0) {
      const invoice = invoicesResponse.data.data[0];
      console.log('📋 Invoice details:');
      console.log('  - ID:', invoice._id);
      console.log('  - Number:', invoice.invoiceNumber);
      console.log('  - Status:', invoice.status);
      console.log('  - Buyer ID:', invoice.buyerId);
      console.log('  - Seller ID:', invoice.sellerId);
      
      // Try to confirm
      try {
        const confirmResponse = await axios.post(`${BASE_URL}/invoices/${invoice._id}/confirm`, 
          { confirmed: true, notes: 'Test confirmation' },
          { headers: { Authorization: `Bearer ${buyerToken}` } }
        );
        console.log('✅ Confirmation successful:', confirmResponse.data.message);
      } catch (error) {
        console.log('❌ Confirmation failed:', error.response?.data?.message);
        console.log('🔍 Error details:', error.response?.data);
      }
    } else {
      console.log('⚠️ No invoices found for buyer');
    }

  } catch (error) {
    console.log('❌ Debug failed:', error.response?.data?.message || error.message);
  }
}

debugBuyerConfirmation();