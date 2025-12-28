const axios = require('axios');

const BASE_URL = 'http://localhost:5005';

async function testAuthentication() {
  console.log('🧪 Testing Authentication System...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data.message);
    console.log('');

    // Test 2: User Registration
    console.log('2️⃣ Testing User Registration...');
    const registerData = {
      email: 'test@example.com',
      password: 'password123',
      role: 'seller',
      profile: {
        firstName: 'Test',
        lastName: 'User',
        phone: '1234567890',
        company: 'Test Company'
      }
    };

    try {
      const registerResponse = await axios.post(`${BASE_URL}/auth/register`, registerData);
      console.log('✅ Registration Success:', registerResponse.data.message);
      console.log('📝 Token received:', registerResponse.data.token ? 'Yes' : 'No');
      console.log('👤 User created:', registerResponse.data.user.email);
      console.log('');
    } catch (regError) {
      if (regError.response?.data?.error === 'User already exists') {
        console.log('ℹ️ User already exists, proceeding to login test...');
      } else {
        console.log('❌ Registration Error:', regError.response?.data?.error || regError.message);
      }
      console.log('');
    }

    // Test 3: User Login
    console.log('3️⃣ Testing User Login...');
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    try {
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, loginData);
      console.log('✅ Login Success:', loginResponse.data.message);
      console.log('📝 Token received:', loginResponse.data.token ? 'Yes' : 'No');
      console.log('👤 User logged in:', loginResponse.data.user.email);
      
      const token = loginResponse.data.token;
      console.log('');

      // Test 4: Protected Route (Profile)
      console.log('4️⃣ Testing Protected Route (Profile)...');
      const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Profile Access Success');
      console.log('👤 Profile Data:', profileResponse.data.email, '-', profileResponse.data.role);
      console.log('');

    } catch (loginError) {
      console.log('❌ Login Error:', loginError.response?.data?.error || loginError.message);
      console.log('');
    }

    // Test 5: Google OAuth URL
    console.log('5️⃣ Testing Google OAuth URL...');
    console.log('🔗 Google OAuth URL: http://localhost:5005/auth/google');
    console.log('ℹ️ Visit this URL in browser to test Google login');
    console.log('');

    console.log('🎉 Authentication System Test Complete!');

  } catch (error) {
    console.log('❌ Test Error:', error.message);
  }
}

// Run the test
testAuthentication();