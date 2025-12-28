const express = require('express');
const path = require('path');
const app = express();

// API routes
app.use('/api', require('./routes/api'));

// Serve React build files
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Catch all handler for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));