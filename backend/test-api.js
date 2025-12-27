const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

async function testAPI() {
  console.log('🧪 Testing API endpoints...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health:', health.data.status);

    // Test registration
    console.log('\n2. Testing registration...');
    const registerData = {
      email: 'test@seller.com',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'seller',
      firstName: 'Test',
      lastName: 'Seller',
      phone: '9876543210',
      company: 'Test Company'
    };

    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, registerData);
    console.log('✅ Registration successful');
    const token = registerResponse.data.data.token;

    // Test login
    console.log('\n3. Testing login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@seller.com',
      password: 'password123'
    });
    console.log('✅ Login successful');

    // Test profile
    console.log('\n4. Testing profile...');
    const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profile fetch successful');

    console.log('\n🎉 All API tests passed!');

  } catch (error) {
    console.error('❌ API Test failed:', error.response?.data || error.message);
  }
}

testAPI();