import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/RealtimeAuthContext';
import RealtimeLogin from './pages/RealtimeLogin';
import RealtimeRegister from './pages/RealtimeRegister';
import Dashboard from './pages/Dashboard';
import SellerDashboard from './pages/SellerDashboard';
import InvestorDashboard from './pages/InvestorDashboard';
import CreateInvoice from './pages/CreateInvoice';
import Marketplace from './pages/Marketplace';
import Portfolio from './pages/Portfolio';
import { useAuth } from './context/RealtimeAuthContext';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// App Routes Component
const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={!isAuthenticated ? <RealtimeLogin /> : <Navigate to="/dashboard" replace />} 
      />
      <Route 
        path="/register" 
        element={!isAuthenticated ? <RealtimeRegister /> : <Navigate to="/dashboard" replace />} 
      />

      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            {user?.role === 'seller' ? <SellerDashboard /> : 
             user?.role === 'investor' ? <InvestorDashboard /> : 
             <Dashboard />}
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/seller-dashboard" 
        element={
          <ProtectedRoute requiredRole="seller">
            <SellerDashboard />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/investor-dashboard" 
        element={
          <ProtectedRoute requiredRole="investor">
            <InvestorDashboard />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/create-invoice" 
        element={
          <ProtectedRoute requiredRole="seller">
            <CreateInvoice />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/marketplace" 
        element={
          <ProtectedRoute requiredRole="investor">
            <Marketplace />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/portfolio" 
        element={
          <ProtectedRoute requiredRole="investor">
            <Portfolio />
          </ProtectedRoute>
        } 
      />

      {/* Default Route */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } 
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main App Component
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;