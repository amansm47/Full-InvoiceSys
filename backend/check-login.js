const axios = require('axios');

async function testLogin() {
  try {
    const response = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'myseller@test.com',
      password: 'password123'
    });
    
    console.log('✅ Login Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('❌ Login Error:');
    console.log(JSON.stringify(error.response?.data || error.message, null, 2));
  }
}

testLogin();