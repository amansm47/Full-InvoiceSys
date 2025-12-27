const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

async function testLogin() {
  try {
    console.log('🔐 Testing login...');
    
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'myseller@test.com',
      password: 'password123'
    });
    
    console.log('✅ Login successful');
    console.log('Token:', response.data.data.token);
    console.log('User:', response.data.data.user);
    
    // Test protected route
    const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${response.data.data.token}` }
    });
    
    console.log('✅ Profile access successful');
    console.log('Profile:', profileResponse.data.data.email);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testLogin();