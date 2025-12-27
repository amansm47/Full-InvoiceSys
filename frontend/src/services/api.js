import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && 
        !error.config.url.includes('/auth/') && 
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register') &&
        !window.location.pathname.includes('/')) {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }).then(res => res.data),
  
  register: (userData) => 
    api.post('/auth/register', userData).then(res => res.data),
  
  updateKYC: (kycData) => 
    api.post('/auth/kyc', kycData).then(res => res.data),
  
  verifyToken: (token) => 
    api.get('/users/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.data)
};

export const invoiceAPI = {
  createInvoice: (invoiceData) => 
    api.post('/invoices/create', invoiceData).then(res => res.data),

  uploadInvoice: (formData) => 
    api.post('/invoices/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data),

  getSellerInvoices: () => 
    api.get('/invoices/seller').then(res => res.data),
  
  getInvoiceById: (id) => 
    api.get(`/invoices/${id}`).then(res => res.data),
  
  updateInvoice: (id, data) => 
    api.put(`/invoices/${id}`, data).then(res => res.data),
  
  deleteInvoice: (id) => 
    api.delete(`/invoices/${id}`).then(res => res.data),
  
  confirmInvoice: (invoiceId, confirmation) => 
    api.post(`/invoices/${invoiceId}/confirm`, confirmation).then(res => res.data),
  
  getMarketplace: (filters = {}) => 
    api.get('/invoices/marketplace', { params: filters }).then(res => res.data),
  
  fundInvoice: ({ invoiceId, amount }) => 
    api.post(`/invoices/${invoiceId}/fund`, { discountedAmount: amount }).then(res => res.data),
  
  getInvestorInvoices: () => 
    api.get('/invoices/investor').then(res => res.data),
  
  repayInvoice: (invoiceId, repaymentData) => 
    api.post(`/invoices/${invoiceId}/repay`, repaymentData).then(res => res.data),

  getPublicInvoices: () => 
    api.get('/invoices/public').then(res => res.data)
};

export const userAPI = {
  getDashboard: () => 
    api.get('/users/dashboard').then(res => res.data),
  
  getProfile: () => 
    api.get('/users/profile').then(res => res.data),
  
  updateProfile: (profileData) => 
    api.put('/users/profile', profileData).then(res => res.data),
  
  getPortfolio: () => 
    api.get('/users/portfolio').then(res => res.data),
  
  getAnalytics: (period = '6m') => 
    api.get('/users/analytics', { params: { period } }).then(res => res.data),
  
  getNotifications: () => 
    api.get('/users/notifications').then(res => res.data),
  
  updateSettings: (settings) => 
    api.put('/users/settings', settings).then(res => res.data)
};

export const marketplaceAPI = {
  getInvestors: () => 
    api.get('/marketplace/investors').then(res => res.data),
  
  connectWithInvestor: (investorId) => 
    api.post(`/marketplace/connect/${investorId}`).then(res => res.data),
  
  getInvestorProfile: (id) => 
    api.get(`/marketplace/investors/${id}`).then(res => res.data)
};

export default api;