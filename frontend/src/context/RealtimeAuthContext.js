import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api-realtime';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const response = await apiService.getProfile();
          if (response.success) {
            setUser(response.data);
            // Connect to real-time socket
            const socketConnection = apiService.connectSocket(response.data._id);
            setSocket(socketConnection);
          } else {
            // Invalid token
            logout();
          }
        } catch (error) {
          console.error('Auth initialization failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    apiService.setToken(authToken);
    
    // Connect to real-time socket
    const socketConnection = apiService.connectSocket(userData.id);
    setSocket(socketConnection);
    
    // Setup real-time listeners
    setupSocketListeners(socketConnection);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setSocket(null);
    apiService.clearToken();
  };

  const setupSocketListeners = (socketConnection) => {
    if (!socketConnection) return;

    // Listen for real-time notifications
    socketConnection.on('notification', (notification) => {
      console.log('Real-time notification:', notification);
      // You can add toast notifications here
    });

    // Listen for invoice updates
    socketConnection.on('invoice-update', (data) => {
      console.log('Invoice update:', data);
      // Trigger UI updates
    });

    // Listen for marketplace updates
    socketConnection.on('marketplace-update', (data) => {
      console.log('Marketplace update:', data);
      // Update marketplace data
    });

    // Listen for dashboard updates
    socketConnection.on('dashboard-update', (data) => {
      console.log('Dashboard update:', data);
      // Update dashboard data
    });

    // Listen for transaction updates
    socketConnection.on('transaction-update', (data) => {
      console.log('Transaction update:', data);
      // Update transaction data
    });
  };

  const value = {
    user,
    token,
    socket,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isVerified: user?.kycStatus === 'verified'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};