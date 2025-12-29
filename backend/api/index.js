const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

let cached = null;

async function connectDB() {
  if (cached) return cached;
  const conn = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  cached = conn;
  return conn;
}

app.use('/api/auth', require('../routes/auth'));
app.get('/health', (req, res) => res.json({ success: true }));
app.get('/', (req, res) => res.json({ message: 'API Running' }));

module.exports = async (req, res) => {
  // Set CORS headers FIRST
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  
  // Handle OPTIONS immediately
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  await connectDB();
  app(req, res);
};
