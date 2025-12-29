const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  isConnected = true;
};

app.use('/api/auth', require('../routes/auth'));

app.get('/health', (req, res) => res.json({ success: true }));
app.get('/', (req, res) => res.json({ message: 'API Running' }));

module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
