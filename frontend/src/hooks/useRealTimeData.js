import { useState, useEffect, useRef } from 'react';
import { useQueryClient } from 'react-query';
import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5005';

export const useRealTimeData = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [newInvoices, setNewInvoices] = useState([]);
  const queryClient = useQueryClient();
  const socketRef = useRef(null);

  useEffect(() => {
    // Skip WebSocket in production (Vercel doesn't support it)
    if (SOCKET_URL.includes('vercel.app')) {
      console.log('⚠️ WebSocket disabled on Vercel');
      setIsConnected(false);
      return;
    }
    
    // Initialize Socket.IO connection
    const token = localStorage.getItem('token');
    
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('✅ WebSocket connected');
      setIsConnected(true);
      
      // Authenticate with JWT token
      if (token) {
        socket.emit('authenticate', token);
      }
    });

    socket.on('authenticated', (data) => {
      console.log('🔐 Authenticated:', data);
    });

    socket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
      setIsConnected(false);
    });

    socket.on('auth_error', (error) => {
      console.error('🚫 Auth error:', error);
    });

    // Listen for new invoices
    socket.on('newInvoiceListed', (invoice) => {
      console.log('🆕 New invoice listed:', invoice);
      
      setNewInvoices(prev => [invoice, ...prev].slice(0, 10));
      
      setNotifications(prev => [{
        id: invoice.id,
        type: 'new_invoice',
        title: 'New Investment Opportunity',
        message: `Invoice ${invoice.invoiceNumber} for ₹${invoice.amount?.toLocaleString()} is now available`,
        timestamp: new Date(),
        data: invoice
      }, ...prev].slice(0, 20));
      
      // Refetch marketplace data
      queryClient.invalidateQueries('marketplace-invoices');
    });

    // Listen for invoice funded events
    socket.on('invoiceFunded', (data) => {
      console.log('💰 Invoice funded:', data);
      
      setNotifications(prev => [{
        id: data.invoiceId,
        type: 'invoice_funded',
        title: 'Invoice Funded!',
        message: `Your invoice ${data.invoiceNumber} was funded for ₹${data.amount?.toLocaleString()}`,
        timestamp: new Date(),
        data
      }, ...prev].slice(0, 20));
      
      // Refetch seller data
      queryClient.invalidateQueries('seller-invoices');
      queryClient.invalidateQueries('dashboard');
    });

    // Listen for investment success
    socket.on('investmentSuccess', (data) => {
      console.log('✅ Investment successful:', data);
      
      setNotifications(prev => [{
        id: data.invoiceId,
        type: 'investment_success',
        title: 'Investment Successful!',
        message: `You invested ₹${data.amount?.toLocaleString()} in ${data.invoiceNumber}. Expected profit: ₹${data.profit?.toLocaleString()}`,
        timestamp: new Date(),
        data
      }, ...prev].slice(0, 20));
      
      // Refetch investor data
      queryClient.invalidateQueries('portfolio');
      queryClient.invalidateQueries('dashboard');
      queryClient.invalidateQueries('marketplace-invoices');
    });

    // Listen for invoice updates
    socket.on('invoiceUpdated', (data) => {
      console.log('🔄 Invoice updated:', data);
      
      // Refetch all relevant queries
      queryClient.invalidateQueries('marketplace-invoices');
      queryClient.invalidateQueries('seller-invoices');
      queryClient.invalidateQueries('portfolio');
    });

    // Listen for portfolio updates
    socket.on('portfolioUpdate', (data) => {
      console.log('💼 Portfolio updated:', data);
      queryClient.invalidateQueries('portfolio');
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [queryClient]);

  const clearNotifications = () => {
    setNotifications([]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return {
    isConnected,
    realTimeData: { 
      notifications,
      newInvoices
    },
    clearNotifications,
    removeNotification
  };
};
