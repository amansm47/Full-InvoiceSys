const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

async function createUsers() {
  console.log('👥 Creating new users...\n');

  try {
    // Create Seller
    console.log('1. Creating Seller...');
    const sellerData = {
      email: 'myseller@test.com',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'seller',
      firstName: 'My',
      lastName: 'Seller',
      phone: '9876543210',
      company: 'My Seller Company',
      gstNumber: '27AABCU9603R1ZX',
      panNumber: 'AABCU9603R'
    };

    const sellerResponse = await axios.post(`${BASE_URL}/auth/register`, sellerData);
    console.log('✅ Seller created:', sellerResponse.data.data.user.email);
    console.log('🔑 Seller Token:', sellerResponse.data.data.token);

    // Create Investor
    console.log('\n2. Creating Investor...');
    const investorData = {
      email: 'myinvestor@test.com',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'investor',
      firstName: 'My',
      lastName: 'Investor',
      phone: '9876543211',
      company: 'My Investment Firm',
      panNumber: 'AABCI9603R'
    };

    const investorResponse = await axios.post(`${BASE_URL}/auth/register`, investorData);
    console.log('✅ Investor created:', investorResponse.data.data.user.email);
    console.log('🔑 Investor Token:', investorResponse.data.data.token);

    // Create Buyer
    console.log('\n3. Creating Buyer...');
    const buyerData = {
      email: 'mybuyer@test.com',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'buyer',
      firstName: 'My',
      lastName: 'Buyer',
      phone: '9876543212',
      company: 'My Buyer Company',
      gstNumber: '07AABCG9603R1ZZ',
      panNumber: 'AABCG9603R'
    };

    const buyerResponse = await axios.post(`${BASE_URL}/auth/register`, buyerData);
    console.log('✅ Buyer created:', buyerResponse.data.data.user.email);
    console.log('🔑 Buyer Token:', buyerResponse.data.data.token);

    console.log('\n🎉 All users created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Seller: myseller@test.com / password123');
    console.log('Investor: myinvestor@test.com / password123');
    console.log('Buyer: mybuyer@test.com / password123');

  } catch (error) {
    if (error.response?.data?.message?.includes('already exists')) {
      console.log('ℹ️ Users already exist. Login credentials:');
      console.log('Seller: myseller@test.com / password123');
      console.log('Investor: myinvestor@test.com / password123');
      console.log('Buyer: mybuyer@test.com / password123');
    } else {
      console.error('❌ Error:', error.response?.data || error.message);
    }
  }
}

createUsers();