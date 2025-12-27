const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

async function testBackendHealth() {
  console.log('🧪 Testing Backend Health...\n');

  const tests = [
    {
      name: 'Server Connection',
      test: async () => {
        const response = await axios.get('http://localhost:5001');
        return response.status === 200 || response.status === 404; // Either is fine
      }
    },
    {
      name: 'User Registration',
      test: async () => {
        const userData = {
          name: 'Test User',
          email: `test${Date.now()}@example.com`,
          password: 'password123',
          role: 'seller',
          company: 'Test Company',
          phone: '1234567890'
        };
        const response = await axios.post(`${BASE_URL}/auth/register`, userData);
        return response.status === 201 && response.data.token;
      }
    },
    {
      name: 'User Login',
      test: async () => {
        // First register a user
        const userData = {
          name: 'Login Test',
          email: `login${Date.now()}@example.com`,
          password: 'password123',
          role: 'investor',
          company: 'Login Company'
        };
        await axios.post(`${BASE_URL}/auth/register`, userData);
        
        // Then login
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
          email: userData.email,
          password: userData.password
        });
        return loginResponse.status === 200 && loginResponse.data.token;
      }
    },
    {
      name: 'Protected Route Access',
      test: async () => {
        // Register and get token
        const userData = {
          name: 'Protected Test',
          email: `protected${Date.now()}@example.com`,
          password: 'password123',
          role: 'seller'
        };
        const regResponse = await axios.post(`${BASE_URL}/auth/register`, userData);
        const token = regResponse.data.token;
        
        // Test protected route
        const profileResponse = await axios.get(`${BASE_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        return profileResponse.status === 200;
      }
    },
    {
      name: 'Dashboard Data',
      test: async () => {
        const userData = {
          name: 'Dashboard Test',
          email: `dashboard${Date.now()}@example.com`,
          password: 'password123',
          role: 'seller'
        };
        const regResponse = await axios.post(`${BASE_URL}/auth/register`, userData);
        const token = regResponse.data.token;
        
        const dashResponse = await axios.get(`${BASE_URL}/users/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        return dashResponse.status === 200 && dashResponse.data.stats;
      }
    },
    {
      name: 'Marketplace Access',
      test: async () => {
        const userData = {
          name: 'Marketplace Test',
          email: `market${Date.now()}@example.com`,
          password: 'password123',
          role: 'investor'
        };
        const regResponse = await axios.post(`${BASE_URL}/auth/register`, userData);
        const token = regResponse.data.token;
        
        const marketResponse = await axios.get(`${BASE_URL}/invoices/marketplace`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        return marketResponse.status === 200;
      }
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await test.test();
      if (result) {
        console.log(`✅ ${test.name}: PASSED`);
        passed++;
      } else {
        console.log(`❌ ${test.name}: FAILED`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR - ${error.response?.data?.message || error.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 All tests passed! Your backend is working properly.');
  } else {
    console.log('⚠️  Some tests failed. Check the errors above.');
  }
}

testBackendHealth();