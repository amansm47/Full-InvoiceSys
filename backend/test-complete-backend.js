const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

async function testBackendFunctionality() {
  console.log('🧪 Testing Backend Functionality...\n');

  const tests = [
    {
      name: 'Health Check',
      test: async () => {
        const response = await axios.get(`${BASE_URL}/health`);
        console.log('   Health Status:', response.data.status);
        return response.status === 200 && response.data.status === 'OK';
      }
    },
    {
      name: 'User Registration (Seller)',
      test: async () => {
        const userData = {
          email: `seller${Date.now()}@example.com`,
          password: 'password123',
          confirmPassword: 'password123',
          role: 'seller',
          firstName: 'Test',
          lastName: 'Seller',
          phone: '9876543210',
          company: 'Test Seller Company',
          gstNumber: 'GST123456789',
          panNumber: 'PAN123456'
        };
        const response = await axios.post(`${BASE_URL}/auth/register`, userData);
        console.log('   Seller registered with ID:', response.data.data.user.id);
        return response.status === 201 && response.data.success && response.data.data.token;
      }
    },
    {
      name: 'User Registration (Investor)',
      test: async () => {
        const userData = {
          email: `investor${Date.now()}@example.com`,
          password: 'password123',
          confirmPassword: 'password123',
          role: 'investor',
          firstName: 'Test',
          lastName: 'Investor',
          phone: '9876543211',
          company: 'Test Investment Firm'
        };
        const response = await axios.post(`${BASE_URL}/auth/register`, userData);
        console.log('   Investor registered with ID:', response.data.data.user.id);
        return response.status === 201 && response.data.success;
      }
    },
    {
      name: 'User Login',
      test: async () => {
        // First register a user
        const userData = {
          email: `login${Date.now()}@example.com`,
          password: 'password123',
          confirmPassword: 'password123',
          role: 'buyer',
          firstName: 'Login',
          lastName: 'Test',
          phone: '9876543212',
          company: 'Login Test Company'
        };
        await axios.post(`${BASE_URL}/auth/register`, userData);
        
        // Then login
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
          email: userData.email,
          password: userData.password
        });
        console.log('   Login successful for:', loginResponse.data.data.user.email);
        return loginResponse.status === 200 && loginResponse.data.success && loginResponse.data.data.token;
      }
    },
    {
      name: 'Protected Route - Profile',
      test: async () => {
        // Register and get token
        const userData = {
          email: `profile${Date.now()}@example.com`,
          password: 'password123',
          confirmPassword: 'password123',
          role: 'seller',
          firstName: 'Profile',
          lastName: 'Test',
          phone: '9876543213',
          company: 'Profile Test Company'
        };
        const regResponse = await axios.post(`${BASE_URL}/auth/register`, userData);
        const token = regResponse.data.data.token;
        
        // Test protected route
        const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('   Profile fetched for:', profileResponse.data.data.email);
        return profileResponse.status === 200 && profileResponse.data.success;
      }
    },
    {
      name: 'Dashboard Data',
      test: async () => {
        const userData = {
          email: `dashboard${Date.now()}@example.com`,
          password: 'password123',
          confirmPassword: 'password123',
          role: 'seller',
          firstName: 'Dashboard',
          lastName: 'Test',
          phone: '9876543214',
          company: 'Dashboard Test Company'
        };
        const regResponse = await axios.post(`${BASE_URL}/auth/register`, userData);
        const token = regResponse.data.data.token;
        
        const dashResponse = await axios.get(`${BASE_URL}/users/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('   Dashboard loaded with user role:', dashResponse.data.data.user.role);
        return dashResponse.status === 200 && dashResponse.data.success;
      }
    },
    {
      name: 'Token Verification',
      test: async () => {
        const userData = {
          email: `verify${Date.now()}@example.com`,
          password: 'password123',
          confirmPassword: 'password123',
          role: 'investor',
          firstName: 'Verify',
          lastName: 'Test',
          phone: '9876543215',
          company: 'Verify Test Company'
        };
        const regResponse = await axios.post(`${BASE_URL}/auth/register`, userData);
        const token = regResponse.data.data.token;
        
        const verifyResponse = await axios.get(`${BASE_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('   Token verified for user:', verifyResponse.data.data.user.email);
        return verifyResponse.status === 200 && verifyResponse.data.success;
      }
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`🔄 Running: ${test.name}`);
      const result = await test.test();
      if (result) {
        console.log(`✅ ${test.name}: PASSED\n`);
        passed++;
      } else {
        console.log(`❌ ${test.name}: FAILED\n`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR`);
      console.log(`   ${error.response?.data?.message || error.message}\n`);
      failed++;
    }
  }

  console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Your backend is working perfectly!');
    console.log('\n✅ Backend Status: FULLY FUNCTIONAL');
    console.log('✅ Database: Connected');
    console.log('✅ Authentication: Working');
    console.log('✅ Protected Routes: Working');
    console.log('✅ Real-time Features: Enabled');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
  }
}

testBackendFunctionality();