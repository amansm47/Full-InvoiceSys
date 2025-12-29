const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  tlsAllowInvalidCertificates: true
}).then(() => console.log('✅ Connected')).catch(err => process.exit(1));

const User = require('./models/User');

async function createUser() {
  const email = 'test@test.com';
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('User exists');
    process.exit(0);
  }

  const user = new User({
    email,
    password: '123456',
    role: 'investor',
    profile: {
      firstName: 'Test',
      lastName: 'User',
      phone: '1234567890',
      company: 'Test Co'
    }
  });

  await user.save();
  console.log('✅ Created: test@test.com / 123456');
  process.exit(0);
}

createUser();
