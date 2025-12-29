const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  tlsAllowInvalidCertificates: true
}).then(() => console.log('✅ Connected')).catch(err => process.exit(1));

const User = require('./models/User');

async function createUsers() {
  const users = [
    {
      email: 'seller@test.com',
      password: '123456',
      role: 'seller',
      profile: { firstName: 'Seller', lastName: 'User', phone: '1234567890', company: 'Seller Co' }
    },
    {
      email: 'investor@test.com',
      password: '123456',
      role: 'investor',
      profile: { firstName: 'Investor', lastName: 'User', phone: '1234567891', company: 'Investor Co' }
    }
  ];

  for (const userData of users) {
    const existing = await User.findOne({ email: userData.email });
    if (existing) {
      console.log(`⚠️  ${userData.email} exists`);
      continue;
    }
    const user = new User(userData);
    await user.save();
    console.log(`✅ Created: ${userData.email} / 123456 (${userData.role})`);
  }
  
  process.exit(0);
}

createUsers();
