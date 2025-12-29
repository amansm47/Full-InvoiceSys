// Test script to verify real-time functionality
const io = require('socket.io-client');

const SOCKET_URL = 'http://localhost:5005';

console.log('🔌 Connecting to WebSocket server...');

const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  reconnection: true
});

socket.on('connect', () => {
  console.log('✅ Connected to WebSocket server');
  console.log('Socket ID:', socket.id);
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected from WebSocket server');
});

socket.on('newInvoiceListed', (data) => {
  console.log('📢 New Invoice Listed:', data);
});

socket.on('invoiceUpdated', (data) => {
  console.log('🔄 Invoice Updated:', data);
});

socket.on('invoiceFunded', (data) => {
  console.log('💰 Invoice Funded:', data);
});

socket.on('investmentSuccess', (data) => {
  console.log('✅ Investment Success:', data);
});

console.log('👂 Listening for real-time events...');
console.log('Press Ctrl+C to exit');

// Keep the script running
process.on('SIGINT', () => {
  console.log('\n👋 Closing connection...');
  socket.disconnect();
  process.exit(0);
});
