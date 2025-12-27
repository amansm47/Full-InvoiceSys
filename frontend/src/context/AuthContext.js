import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        try {
          // Set user immediately from localStorage
          setUser(JSON.parse(userData));
          // Optional: validate token in background (don't clear on failure)
          authAPI.verifyToken(token).catch(() => {
            console.log('Token validation failed, but keeping user logged in');
          });
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          setUser(null);
        }
      }
      setLoading(false);
    };
    
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      console.log('Login response:', response);
      
      if (response.token && response.user) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userData', JSON.stringify(response.user));
        setUser(response.user);
        return response;
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('Login failed:', error);
      // Clear any existing auth data
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      setUser(null);
      
      // If backend is down, show specific error
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        throw new Error('Backend server is not running. Please start the backend first.');
      }
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      localStorage.setItem('token', response.token);
      localStorage.setItem('userData', JSON.stringify(response.user));
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setUser(null);
  };

  const updateKYC = async (kycData) => {
    const response = await authAPI.updateKYC(kycData);
    setUser(response.user);
    return response;
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateKYC,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}