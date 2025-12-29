require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 Checking MongoDB Connection...\n');
console.log('MONGODB_URI from .env:', process.env.MONGODB_URI);
console.log('\n');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  tlsAllowInvalidCertificates: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  console.log('📊 Database Name:', mongoose.connection.name);
  console.log('🌐 Host:', mongoose.connection.host);
  console.log('\n');
  
  // List all collections
  mongoose.connection.db.listCollections().toArray((err, collections) => {
    if (err) {
      console.error('Error listing collections:', err);
    } else {
      console.log('📁 Collections in database:');
      collections.forEach(col => console.log('  -', col.name));
    }
    
    // Count users
    mongoose.connection.db.collection('users').countDocuments((err, count) => {
      if (err) {
        console.error('Error counting users:', err);
      } else {
        console.log('\n👥 Total users in database:', count);
      }
      process.exit(0);
    });
  });
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});
