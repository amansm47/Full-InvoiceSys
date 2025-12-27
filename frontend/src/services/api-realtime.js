import axios from 'axios';
import io from 'socket.io-client';

const API_BASE_URL = 'http://localhost:5001/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
    this.socket = null;
    this.setupAxios();
  }

  setupAxios() {
    axios.defaults.baseURL = API_BASE_URL;
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    
    if (this.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    }
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  connectSocket(userId) {
    if (!this.socket) {
      this.socket = io('http://localhost:5001');
      this.socket.emit('join-room', userId);
    }
    return this.socket;
  }

  // Auth endpoints
  async register(userData) {
    const response = await axios.post('/auth/register', userData);
    if (response.data.success) {
      this.setToken(response.data.data.token);
    }
    return response.data;
  }

  async login(email, password) {
    const response = await axios.post('/auth/login', { email, password });
    if (response.data.success) {
      this.setToken(response.data.data.token);
    }
    return response.data;
  }

  async logout() {
    try {
      await axios.post('/auth/logout');
    } finally {
      this.clearToken();
    }
  }

  async getProfile() {
    const response = await axios.get('/auth/profile');
    return response.data;
  }

  async updateProfile(profileData) {
    const response = await axios.put('/auth/profile', profileData);
    return response.data;
  }

  async updateKYC(kycData) {
    const response = await axios.post('/auth/kyc', kycData);
    return response.data;
  }

  // Invoice endpoints
  async createInvoice(invoiceData) {
    const response = await axios.post('/invoices/create', invoiceData);
    return response.data;
  }

  async getInvoices(params = {}) {
    const response = await axios.get('/invoices', { params });
    return response.data;
  }

  async getInvoice(id) {
    const response = await axios.get(`/invoices/${id}`);
    return response.data;
  }

  async confirmInvoice(id, confirmed, notes) {
    const response = await axios.post(`/invoices/${id}/confirm`, { confirmed, notes });
    return response.data;
  }

  async fundInvoice(id, amount, paymentMethod) {
    const response = await axios.post(`/invoices/${id}/fund`, { amount, paymentMethod });
    return response.data;
  }

  async getMarketplace(params = {}) {
    const response = await axios.get('/invoices/marketplace/listings', { params });
    return response.data;
  }

  // User endpoints
  async getDashboard() {
    const response = await axios.get('/users/dashboard');
    return response.data;
  }

  async getPortfolio(params = {}) {
    const response = await axios.get('/users/portfolio', { params });
    return response.data;
  }

  async getTransactions(params = {}) {
    const response = await axios.get('/users/transactions', { params });
    return response.data;
  }

  async getStatistics(period = '30d') {
    const response = await axios.get('/users/statistics', { params: { period } });
    return response.data;
  }
}

export default new ApiService();