const axios = require('axios');

const BASE_URL = 'http://localhost:5005';

const demoUsers = [
  {
    email: 'seller@demo.com',
    password: 'demo123',
    role: 'seller',
    profile: {
      firstName: 'John',
      lastName: 'Seller',
      phone: '1234567890',
      company: 'ABC Manufacturing'
    }
  },
  {
    email: 'investor@demo.com',
    password: 'demo123',
    role: 'investor',
    profile: {
      firstName: 'Jane',
      lastName: 'Investor',
      phone: '0987654321',
      company: 'Investment Fund LLC'
    }
  },
  {
    email: 'buyer@demo.com',
    password: 'demo123',
    role: 'buyer',
    profile: {
      firstName: 'Mike',
      lastName: 'Buyer',
      phone: '5555555555',
      company: 'Corporate Buyer Inc'
    }
  }
];

async function createDemoUsers() {
  console.log('🚀 Creating Demo Users...\n');

  for (const user of demoUsers) {
    try {
      const response = await axios.post(`${BASE_URL}/auth/register`, user);
      console.log(`✅ Created ${user.role}: ${user.email}`);
    } catch (error) {
      if (error.response?.data?.error === 'User already exists') {
        console.log(`ℹ️ ${user.role} already exists: ${user.email}`);
      } else {
        console.log(`❌ Error creating ${user.role}:`, error.response?.data?.error);
      }
    }
  }

  console.log('\n🎉 Demo users ready! Use these credentials to login:');
  console.log('\n📋 LOGIN CREDENTIALS:');
  console.log('==================');
  demoUsers.forEach(user => {
    console.log(`${user.role.toUpperCase()}:`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Password: ${user.password}`);
    console.log('');
  });
}

createDemoUsers();