const axios = require('axios');

const BASE_URL = 'http://localhost:5003/api';

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  confirmPassword: 'password123',
  role: 'seller',
  firstName: 'Test',
  lastName: 'User',
  phone: '9876543210',
  company: 'Test Company'
};

async function testAuth() {
  try {
    console.log('🧪 Testing Authentication Endpoints...\n');

    // Test 1: Register
    console.log('1️⃣ Testing Registration...');
    try {
      const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
      console.log('✅ Registration successful:', registerResponse.data.message);
      console.log('📝 User ID:', registerResponse.data.data.user.id);
      console.log('🔑 Token received:', registerResponse.data.data.token ? 'Yes' : 'No');
    } catch (error) {
      if (error.response?.status === 409) {
        console.log('⚠️ User already exists, proceeding to login test...');
      } else {
        console.log('❌ Registration failed:', error.response?.data?.message || error.message);
        return;
      }
    }

    console.log('\n2️⃣ Testing Login...');
    try {
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      console.log('✅ Login successful:', loginResponse.data.message);
      console.log('👤 User:', loginResponse.data.data.user.email);
      console.log('🏢 Company:', loginResponse.data.data.user.company);
      console.log('🔑 Token:', loginResponse.data.data.token.substring(0, 20) + '...');

      const token = loginResponse.data.data.token;

      // Test 3: Profile access
      console.log('\n3️⃣ Testing Profile Access...');
      const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Profile access successful');
      console.log('👤 Full Name:', profileResponse.data.data.fullName);
      console.log('📧 Email:', profileResponse.data.data.email);
      console.log('🏷️ Role:', profileResponse.data.data.role);

      // Test 4: Token verification
      console.log('\n4️⃣ Testing Token Verification...');
      const verifyResponse = await axios.get(`${BASE_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Token verification successful');
      console.log('✅ All authentication tests passed!');

    } catch (error) {
      console.log('❌ Login failed:', error.response?.data?.message || error.message);
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

// Test server health first
async function testHealth() {
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Server is healthy:', response.data.status);
    return true;
  } catch (error) {
    console.log('❌ Server health check failed:', error.message);
    console.log('Make sure your server is running on port 5003');
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Authentication Tests\n');
  
  const isHealthy = await testHealth();
  if (isHealthy) {
    await testAuth();
  }
}

runTests();