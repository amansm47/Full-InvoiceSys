const axios = require('axios');

async function testSingleRegistration() {
  try {
    console.log('🧪 Testing single user registration...\n');
    
    const userData = {
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      confirmPassword: 'password123',
      role: 'seller',
      firstName: 'Test',
      lastName: 'User',
      phone: '9876543210',
      company: 'Test Company'
    };

    const response = await axios.post('http://localhost:5001/api/auth/register', userData);
    
    console.log('✅ Registration successful!');
    console.log('📧 Email:', response.data.data.user.email);
    console.log('👤 Role:', response.data.data.user.role);
    console.log('🏢 Company:', response.data.data.user.company);
    console.log('🔑 Token received:', response.data.data.token ? 'Yes' : 'No');
    console.log('📋 KYC Status:', response.data.data.user.kycStatus);
    
    return true;
  } catch (error) {
    console.log('❌ Registration failed:', error.response?.data?.message || error.message);
    return false;
  }
}

testSingleRegistration();