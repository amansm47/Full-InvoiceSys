import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

export const useRealTimeData = () => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [realTimeData, setRealTimeData] = useState({
    newInvoices: [],
    portfolioUpdates: null,
    marketUpdates: null,
    notifications: []
  });
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    if (!user) return;

    const connectSocket = () => {
      const newSocket = io(process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5005', {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true
      });

      newSocket.on('connect', () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        reconnectAttempts.current = 0;
        
        const token = localStorage.getItem('token');
        if (token) {
          newSocket.emit('authenticate', token);
        }
      });

      newSocket.on('authenticated', (data) => {
        console.log('WebSocket authenticated:', data);
      });

      newSocket.on('disconnect', () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.log('WebSocket connection error:', error);
        setIsConnected(false);
        
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          setTimeout(() => {
            console.log('Reconnecting... Attempt', reconnectAttempts.current);
            connectSocket();
          }, 3000 * reconnectAttempts.current);
        }
      });

      newSocket.on('newInvoiceListed', (invoice) => {
        console.log('New invoice listed:', invoice);
        setRealTimeData(prev => ({
          ...prev,
          newInvoices: [invoice, ...prev.newInvoices.slice(0, 9)],
          notifications: [{
            id: Date.now(),
            type: 'new_invoice',
            message: `New invoice ${invoice.invoiceNumber} listed for Rs.${invoice.amount?.toLocaleString()}`,
            timestamp: new Date(),
            data: invoice
          }, ...prev.notifications.slice(0, 19)]
        }));
      });

      newSocket.on('invoiceFunded', (data) => {
        console.log('Invoice funded:', data);
        setRealTimeData(prev => ({
          ...prev,
          notifications: [{
            id: Date.now(),
            type: 'invoice_funded',
            message: `Your invoice has been funded for Rs.${data.amount?.toLocaleString()}`,
            timestamp: new Date(),
            data
          }, ...prev.notifications.slice(0, 19)]
        }));
      });

      newSocket.on('invoiceRepaid', (data) => {
        console.log('Invoice repaid:', data);
        setRealTimeData(prev => ({
          ...prev,
          notifications: [{
            id: Date.now(),
            type: 'invoice_repaid',
            message: `Invoice repaid! Profit: Rs.${data.profit?.toLocaleString()}`,
            timestamp: new Date(),
            data
          }, ...prev.notifications.slice(0, 19)]
        }));
      });

      newSocket.on('invoiceUpdated', (invoice) => {
        console.log('Invoice updated:', invoice);
        setRealTimeData(prev => ({
          ...prev,
          notifications: [{
            id: Date.now(),
            type: 'invoice_updated',
            message: `Invoice ${invoice.invoiceNumber} status: ${invoice.status}`,
            timestamp: new Date(),
            data: invoice
          }, ...prev.notifications.slice(0, 19)]
        }));
      });

      newSocket.on('marketUpdate', (marketData) => {
        console.log('Market update:', marketData);
        setRealTimeData(prev => ({
          ...prev,
          marketUpdates: marketData
        }));
      });

      newSocket.on('portfolioUpdate', (portfolioData) => {
        console.log('Portfolio update:', portfolioData);
        setRealTimeData(prev => ({
          ...prev,
          portfolioUpdates: portfolioData
        }));
      });

      setSocket(newSocket);
    };

    connectSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user]);

  const clearNotifications = () => {
    setRealTimeData(prev => ({ ...prev, notifications: [] }));
  };

  const removeNotification = (id) => {
    setRealTimeData(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id)
    }));
  };

  return {
    socket,
    isConnected,
    realTimeData,
    clearNotifications,
    removeNotification
  };
};