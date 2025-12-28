const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

async function testBackendHealth() {
  console.log('🧪 Testing Backend Health...\n');

  const tests = [
    {
      name: 'Health Check',
      test: async () => {
        const response = await axios.get('http://localhost:5001/health');
        return response.status === 200;
      }
    },
    {
      name: 'User Registration',
      test: async () => {
        const userData = {
          email: `test${Date.now()}@example.com`,
          password: 'password123',
          role: 'seller',
          profile: {
            firstName: 'Test',
            lastName: 'User',
            company: 'Test Company',
            phone: '1234567890'
          }
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
          email: `login${Date.now()}@example.com`,
          password: 'password123',
          role: 'investor',
          profile: {
            firstName: 'Login',
            lastName: 'Test',
            company: 'Login Company',
            phone: '1234567890'
          }
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
          email: `protected${Date.now()}@example.com`,
          password: 'password123',
          role: 'seller',
          profile: {
            firstName: 'Protected',
            lastName: 'Test',
            company: 'Protected Company',
            phone: '1234567890'
          }
        };
        const regResponse = await axios.post(`${BASE_URL}/auth/register`, userData);
        const token = regResponse.data.token;
        
        // Test protected route
        const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        return profileResponse.status === 200;
      }
    },
    {
      name: 'Dashboard Data',
      test: async () => {
        const userData = {
          email: `dashboard${Date.now()}@example.com`,
          password: 'password123',
          role: 'seller',
          profile: {
            firstName: 'Dashboard',
            lastName: 'Test',
            company: 'Dashboard Company',
            phone: '1234567890'
          }
        };
        const regResponse = await axios.post(`${BASE_URL}/auth/register`, userData);
        const token = regResponse.data.token;

        const dashResponse = await axios.get(`${BASE_URL}/users/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        return dashResponse.status === 200 && dashResponse.data.success;
      }
    },
    {
      name: 'Marketplace Access',
      test: async () => {
        const userData = {
          email: `market${Date.now()}@example.com`,
          password: 'password123',
          role: 'investor',
          profile: {
            firstName: 'Marketplace',
            lastName: 'Test',
            company: 'Marketplace Company',
            phone: '1234567890'
          }
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