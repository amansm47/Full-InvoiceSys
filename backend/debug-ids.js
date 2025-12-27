const axios = require('axios');

const BASE_URL = 'http://localhost:5003/api';

async function debugIds() {
  try {
    // Login as buyer
    const buyerLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'buyer@example.com',
      password: 'password123'
    });
    
    const buyerToken = buyerLogin.data.data.token;
    const buyerId = buyerLogin.data.data.user.id;
    console.log('🔍 Buyer ID from login:', buyerId);
    console.log('🔍 Buyer ID type:', typeof buyerId);

    // Get invoices for buyer
    const invoicesResponse = await axios.get(`${BASE_URL}/invoices`, {
      headers: { Authorization: `Bearer ${buyerToken}` }
    });
    
    if (invoicesResponse.data.data.length > 0) {
      const invoice = invoicesResponse.data.data[0];
      console.log('🔍 Invoice buyerId:', invoice.buyerId);
      console.log('🔍 Invoice buyerId._id:', invoice.buyerId._id);
      console.log('🔍 Invoice buyerId.id:', invoice.buyerId.id);
      
      // Test different comparisons
      console.log('🔍 buyerId === invoice.buyerId._id:', buyerId === invoice.buyerId._id);
      console.log('🔍 buyerId === invoice.buyerId.id:', buyerId === invoice.buyerId.id);
      console.log('🔍 buyerId === invoice.buyerId._id.toString():', buyerId === invoice.buyerId._id?.toString());
    }

  } catch (error) {
    console.log('❌ Debug failed:', error.response?.data?.message || error.message);
  }
}

debugIds();