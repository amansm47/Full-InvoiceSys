require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  tlsAllowInvalidCertificates: true,
})
.then(async () => {
  console.log('✅ Connected to MongoDB Atlas\n');
  
  const db = mongoose.connection.db;
  
  // Get all users
  const users = await db.collection('users').find({}).toArray();
  
  console.log(`📊 Total Users: ${users.length}\n`);
  
  if (users.length > 0) {
    console.log('👥 Users in database:');
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Name: ${user.profile?.firstName || 'N/A'} ${user.profile?.lastName || ''}`);
      console.log(`   Created: ${user.createdAt}`);
    });
  } else {
    console.log('⚠️  No users found in database');
    console.log('Try creating a new account through your app');
  }
  
  process.exit(0);
})
.catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
