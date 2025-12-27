import React, { useState } from 'react';
import {
  Box, Container, Grid, Card, Typography, Button,
  Avatar, Chip, IconButton, LinearProgress, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField,
  Divider, Stack, Badge, Tooltip
} from '@mui/material';
import {
  Add, Receipt, TrendingUp, AttachMoney, CheckCircle,
  Upload, Notifications, Dashboard, FileUpload, Analytics, Settings,
  Menu, Home, Store, AccountBalance, Person, Help, ExitToApp
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import { useAuth } from '../context/AuthContext';
import { userAPI, invoiceAPI, marketplaceAPI } from '../services/api';
import { useQuery } from 'react-query';

function EnhancedSellerDashboard() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [hovered, setHovered] = useState(false);

  const links = [
    {
      label: 'Dashboard',
      href: '#',
      icon: <Dashboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
      id: 'dashboard'
    },
    {
      label: 'My Invoices',
      href: '#',
      icon: <Receipt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
      id: 'invoices'
    },
    {
      label: 'Analytics',
      href: '#',
      icon: <Analytics className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
      id: 'analytics'
    },
    {
      label: 'Marketplace',
      href: '#',
      icon: <Store className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
      id: 'marketplace'
    },
    {
      label: 'Profile',
      href: '#',
      icon: <Person className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
      id: 'profile'
    },
    {
      label: 'Settings',
      href: '#',
      icon: <Settings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
      id: 'settings'
    }
  ];

  return (
    <Box sx={{ display: 'flex', bgcolor: '#0f0f23', height: '100vh', overflow: 'hidden' }}>
      <motion.div
        animate={{ width: hovered ? 280 : 80 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
          borderRight: '1px solid rgba(139, 92, 246, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 10,
          flexShrink: 0
        }}
      >
        {/* Animated background */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }} />
        
        {/* Logo Section */}
        <Box sx={{ p: 3, position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={false}
            animate={{ 
              justifyContent: hovered ? 'flex-start' : 'center',
              gap: hovered ? 12 : 0
            }}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              fontSize: '18px',
              fontWeight: 'bold',
              color: 'white'
            }}>
              IF
            </Box>
            <AnimatePresence>
              {hovered && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                >
                  <Typography sx={{
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '18px',
                    background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    InvoiceFinance
                  </Typography>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ flex: 1, px: 2, position: 'relative', zIndex: 2 }}>
          {links.map((link, idx) => (
            <motion.div
              key={link.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Box
                onClick={() => setActiveSection(link.id)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  mb: 1,
                  borderRadius: '16px',
                  cursor: 'pointer',
                  position: 'relative',
                  background: activeSection === link.id 
                    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)'
                    : 'transparent',
                  border: activeSection === link.id 
                    ? '1px solid rgba(139, 92, 246, 0.4)'
                    : '1px solid transparent',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.3)'
                  },
                  '&::before': activeSection === link.id ? {
                    content: '""',
                    position: 'absolute',
                    left: -8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 4,
                    height: '60%',
                    background: 'linear-gradient(180deg, #8b5cf6, #3b82f6)',
                    borderRadius: '0 4px 4px 0',
                    boxShadow: '0 0 12px rgba(139, 92, 246, 0.6)'
                  } : {}
                }}
              >
                <Box sx={{
                  color: activeSection === link.id ? '#8b5cf6' : '#64748b',
                  transition: 'color 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: hovered ? 'flex-start' : 'center',
                  width: hovered ? 'auto' : '100%'
                }}>
                  {link.icon}
                </Box>
                <AnimatePresence>
                  {hovered && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2, delay: 0.05 }}
                      style={{ marginLeft: 16 }}
                    >
                      <Typography sx={{
                        color: activeSection === link.id ? 'white' : '#94a3b8',
                        fontWeight: activeSection === link.id ? 600 : 500,
                        fontSize: '14px'
                      }}>
                        {link.label}
                      </Typography>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            </motion.div>
          ))}
        </Box>

        {/* User Profile */}
        <Box sx={{ p: 3, borderTop: '1px solid rgba(139, 92, 246, 0.2)', position: 'relative', zIndex: 2 }}>
          <motion.div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: hovered ? 'flex-start' : 'center',
              gap: hovered ? 12 : 0
            }}
          >
            <Avatar sx={{
              width: 36,
              height: 36,
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              border: '2px solid rgba(139, 92, 246, 0.3)',
              boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              {user?.name?.charAt(0)}
            </Avatar>
            <AnimatePresence>
              {hovered && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                >
                  <Box>
                    <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>
                      {user?.name || 'User'}
                    </Typography>
                    <Typography sx={{ color: '#64748b', fontSize: '12px' }}>
                      Seller Account
                    </Typography>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </Box>
      </motion.div>
      
      <DashboardContent activeSection={activeSection} user={user} setActiveSection={setActiveSection} />
    </Box>
  );
}



const DashboardContent = ({ activeSection, user, setActiveSection }) => {
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useQuery(
    'seller-dashboard', 
    userAPI.getDashboard, 
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      refetchInterval: 30000,
      enabled: !!user?.id,
      retry: 3,
      onError: (error) => {
        console.error('Dashboard API Error:', error);
      }
    }
  );
  const { data: invoices = [], isLoading: invoicesLoading, error: invoicesError } = useQuery(
    'seller-invoices', 
    invoiceAPI.getSellerInvoices, 
    {
      refetchOnWindowFocus: false,
      staleTime: 2 * 60 * 1000,
      refetchInterval: 15000,
      enabled: !!user?.id,
      retry: 3
    }
  );
  const { data: analytics } = useQuery('seller-analytics', () => userAPI.getAnalytics('6m'), {
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
  const { data: marketplaceData } = useQuery('marketplace-investors', marketplaceAPI.getInvestors, {
    refetchOnWindowFocus: false,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  // Show loading state
  if (dashboardLoading || invoicesLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#0f0f23' }}>
        <Typography sx={{ color: 'white' }}>Loading dashboard...</Typography>
      </Box>
    );
  }

  // Show error state
  if (dashboardError || invoicesError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#0f0f23' }}>
        <Typography sx={{ color: '#ef4444' }}>Error: {dashboardError?.message || invoicesError?.message || 'Backend not running'}</Typography>
      </Box>
    );
  }

  const stats = dashboardData?.stats || {
    totalInvoices: 0,
    totalFunded: 0,
    successRate: 0,
    activeInvoices: 0
  };

  const statCards = [
    { 
      title: 'Total Invoices', 
      value: stats.totalInvoices || 24, 
      icon: Receipt, 
      color: '#2563eb',
      change: '+12%'
    },
    { 
      title: 'Funded Amount', 
      value: stats.totalFunded || 450000, 
      icon: AttachMoney, 
      color: '#10b981', 
      prefix: '₹',
      change: '+15%'
    },
    { 
      title: 'Success Rate', 
      value: stats.successRate || 92, 
      icon: TrendingUp, 
      color: '#f59e0b', 
      suffix: '%',
      change: '+3%'
    },
    { 
      title: 'Active Invoices', 
      value: stats.funded || 8, 
      icon: CheckCircle, 
      color: '#8b5cf6',
      change: '+5'
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'invoices':
        return renderInvoices();
      case 'analytics':
        return renderAnalytics();
      case 'marketplace':
        return renderMarketplace();
      case 'profile':
        return renderProfile();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
          Welcome back, {user?.name}! 👋
        </Typography>
        <Typography variant="body1" sx={{ color: '#94a3b8' }}>
          Here's your invoice financing overview
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={stat.title}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card sx={{ 
                p: 3,
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '16px',
                '&:hover': { 
                  boxShadow: '0 20px 40px rgba(139, 92, 246, 0.2)',
                  transform: 'translateY(-4px)',
                  border: '1px solid rgba(139, 92, 246, 0.4)'
                },
                transition: 'all 0.3s ease'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ 
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${stat.color}, ${stat.color}80)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <stat.icon sx={{ fontSize: 24 }} />
                  </Box>
                  <Chip 
                    label={stat.change}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(34, 197, 94, 0.1)',
                      color: '#22c55e',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      border: '1px solid rgba(34, 197, 94, 0.2)'
                    }}
                  />
                </Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#94a3b8' }}>
                  {stat.title}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
                  {stat.prefix}
                  <CountUp end={stat.value} duration={2} separator="," />
                  {stat.suffix}
                </Typography>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: 'Upload Invoice', icon: <FileUpload />, color: '#8b5cf6', action: () => setActiveSection('invoices') },
          { title: 'View Analytics', icon: <Analytics />, color: '#3b82f6', action: () => setActiveSection('analytics') },
          { title: 'Browse Market', icon: <Store />, color: '#10b981', action: () => setActiveSection('marketplace') },
          { title: 'Account Settings', icon: <Settings />, color: '#f59e0b', action: () => setActiveSection('settings') }
        ].map((action, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Card sx={{ 
              p: 3, 
              textAlign: 'center',
              cursor: 'pointer',
              background: 'rgba(139, 92, 246, 0.05)',
              border: '1px solid rgba(139, 92, 246, 0.1)',
              borderRadius: '16px',
              '&:hover': { 
                boxShadow: '0 12px 24px rgba(139, 92, 246, 0.15)',
                transform: 'translateY(-2px)',
                border: `1px solid ${action.color}40`
              },
              transition: 'all 0.3s ease'
            }}
            onClick={action.action}
            >
              <Box sx={{ 
                width: 56,
                height: 56,
                borderRadius: '16px',
                background: `linear-gradient(135deg, ${action.color}, ${action.color}80)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                color: 'white'
              }}>
                {action.icon}
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'white' }}>
                {action.title}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ 
            p: 3, 
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '16px'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', mb: 3 }}>
              Recent Invoices
            </Typography>
            <Stack spacing={2}>
              {invoices.slice(0, 4).map((invoice, index) => {
                const getStatusColor = (status) => {
                  switch (status) {
                    case 'funded': return { bg: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' };
                    case 'pending': return { bg: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24' };
                    case 'verified': return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' };
                    default: return { bg: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' };
                  }
                };
                const statusStyle = getStatusColor(invoice.status);
                
                return (
                  <Box key={invoice._id || index} sx={{ 
                    p: 3, 
                    background: 'rgba(139, 92, 246, 0.05)',
                    border: '1px solid rgba(139, 92, 246, 0.1)', 
                    borderRadius: '12px',
                    '&:hover': { bgcolor: 'rgba(139, 92, 246, 0.1)' }
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: 'white', mb: 0.5 }}>
                          {invoice.invoiceNumber} - {invoice.buyerName || invoice.customerName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                          {new Date(invoice.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', mb: 0.5 }}>
                          ₹{invoice.amount?.toLocaleString()}
                        </Typography>
                        <Chip 
                          label={invoice.status}
                          size="small"
                          sx={{
                            bgcolor: statusStyle.bg,
                            color: statusStyle.color,
                            fontWeight: 500,
                            textTransform: 'capitalize'
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card sx={{ 
            p: 3,
            background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
            border: 'none',
            borderRadius: '16px'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'white' }}>
              💡 Quick Tip
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6, color: 'white' }}>
              Upload invoices with clear images and complete buyer information for faster verification and funding.
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );

  const renderInvoices = () => (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
            📄 My Invoices
          </Typography>
          <Typography variant="body1" sx={{ color: '#94a3b8' }}>
            Manage and track all your invoices
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{
            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
            borderRadius: '12px',
            px: 3,
            py: 1.5
          }}
        >
          Upload New Invoice
        </Button>
      </Box>

      <Grid container spacing={3}>
        {invoices.map((invoice, index) => (
          <Grid item xs={12} md={6} lg={4} key={invoice._id || index}>
            <Card sx={{
              p: 3,
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '16px',
              '&:hover': {
                boxShadow: '0 20px 40px rgba(139, 92, 246, 0.2)',
                transform: 'translateY(-4px)'
              },
              transition: 'all 0.3s ease'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
                  {invoice.invoiceNumber}
                </Typography>
                <Chip
                  label={invoice.status}
                  sx={{
                    bgcolor: invoice.status === 'funded' ? 'rgba(34, 197, 94, 0.1)' : 
                             invoice.status === 'verified' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                    color: invoice.status === 'funded' ? '#22c55e' : 
                           invoice.status === 'verified' ? '#3b82f6' : '#fbbf24',
                    fontWeight: 600,
                    textTransform: 'capitalize'
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                Customer: {invoice.buyerName || invoice.customerName}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 2 }}>
                ₹{invoice.amount?.toLocaleString()}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>Created</Typography>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>Due Date</Typography>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  borderColor: 'rgba(139, 92, 246, 0.3)',
                  color: '#8b5cf6',
                  '&:hover': {
                    borderColor: '#8b5cf6',
                    bgcolor: 'rgba(139, 92, 246, 0.1)'
                  }
                }}
                onClick={() => console.log('View invoice:', invoice._id)}
              >
                View Details
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );

  const renderAnalytics = () => (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
        📊 Analytics Dashboard
      </Typography>
      <Typography variant="body1" sx={{ color: '#94a3b8', mb: 4 }}>
        Track your performance and growth metrics
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: 'Monthly Revenue', value: '₹4,50,000', change: '+15%', color: '#22c55e' },
          { title: 'Average Funding Time', value: '2.5 days', change: '-20%', color: '#3b82f6' },
          { title: 'Success Rate', value: '92%', change: '+5%', color: '#8b5cf6' },
          { title: 'Total Customers', value: '48', change: '+12%', color: '#f59e0b' }
        ].map((metric, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Card sx={{
              p: 3,
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '16px'
            }}>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                {metric.title}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
                {metric.value}
              </Typography>
              <Chip
                label={metric.change}
                size="small"
                sx={{
                  bgcolor: `${metric.color}20`,
                  color: metric.color,
                  fontWeight: 600
                }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{
        p: 4,
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        borderRadius: '16px'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', mb: 3 }}>
          Revenue Trend (Last 6 Months)
        </Typography>
        <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ color: '#94a3b8' }}>
            Chart visualization would be implemented here with real data
          </Typography>
        </Box>
      </Card>
    </Container>
  );

  const renderMarketplace = () => (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
        🏪 Funding Marketplace
      </Typography>
      <Typography variant="body1" sx={{ color: '#94a3b8', mb: 4 }}>
        Connect with investors and explore funding opportunities
      </Typography>

      <Grid container spacing={3}>
        {(marketplaceData?.investors || []).map((investor, index) => (
          <Grid item xs={12} md={6} lg={3} key={investor._id || index}>
            <Card sx={{
              p: 3,
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '16px',
              '&:hover': {
                boxShadow: '0 20px 40px rgba(139, 92, 246, 0.2)',
                transform: 'translateY(-4px)'
              },
              transition: 'all 0.3s ease'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', mb: 2 }}>
                {investor.name}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>Interest Rate</Typography>
                <Typography variant="h6" sx={{ color: '#22c55e', fontWeight: 600 }}>
                  {investor.interestRate || '8-12%'}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>Minimum Amount</Typography>
                <Typography variant="body1" sx={{ color: 'white', fontWeight: 500 }}>
                  ₹{investor.minAmount?.toLocaleString() || '50,000'}
                </Typography>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>Response Time</Typography>
                <Typography variant="body1" sx={{ color: 'white', fontWeight: 500 }}>
                  {investor.responseTime || '24 hours'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>Rating</Typography>
                <Typography variant="body1" sx={{ color: '#fbbf24', fontWeight: 600 }}>
                  ⭐ {investor.rating || 4.8}
                </Typography>
              </Box>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                  borderRadius: '12px'
                }}
                onClick={() => marketplaceAPI.connectWithInvestor(investor._id)}
              >
                Connect
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );

  const renderProfile = () => (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
        👤 Profile Management
      </Typography>
      <Typography variant="body1" sx={{ color: '#94a3b8', mb: 4 }}>
        Manage your account information and KYC status
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{
            p: 4,
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '16px'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', mb: 3 }}>
              Personal Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  defaultValue={user?.name || 'John Doe'}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(139, 92, 246, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(139, 92, 246, 0.5)' }
                    },
                    '& .MuiInputLabel-root': { color: '#94a3b8' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  defaultValue={user?.email || 'john@example.com'}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(139, 92, 246, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(139, 92, 246, 0.5)' }
                    },
                    '& .MuiInputLabel-root': { color: '#94a3b8' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  defaultValue="+91 98765 43210"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(139, 92, 246, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(139, 92, 246, 0.5)' }
                    },
                    '& .MuiInputLabel-root': { color: '#94a3b8' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company"
                  defaultValue="ABC Enterprises"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(139, 92, 246, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(139, 92, 246, 0.5)' }
                    },
                    '& .MuiInputLabel-root': { color: '#94a3b8' }
                  }}
                />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              sx={{
                mt: 3,
                background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                borderRadius: '12px',
                px: 4
              }}
            >
              Update Profile
            </Button>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{
            p: 3,
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '16px',
            mb: 3
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', mb: 2 }}>
              KYC Status
            </Typography>
            <Chip
              label="Verified"
              sx={{
                bgcolor: 'rgba(34, 197, 94, 0.1)',
                color: '#22c55e',
                fontWeight: 600,
                mb: 2
              }}
            />
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Your account is fully verified and ready for transactions.
            </Typography>
          </Card>
          <Card sx={{
            p: 3,
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            border: 'none',
            borderRadius: '16px'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', mb: 2 }}>
              🎉 Account Benefits
            </Typography>
            <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
              • Priority funding access
              • Lower interest rates
              • Dedicated support
              • Advanced analytics
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );

  const renderSettings = () => (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
        ⚙️ Account Settings
      </Typography>
      <Typography variant="body1" sx={{ color: '#94a3b8', mb: 4 }}>
        Configure your preferences and security settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{
            p: 4,
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '16px',
            mb: 3
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', mb: 3 }}>
              Notification Preferences
            </Typography>
            <Stack spacing={2}>
              {[
                { label: 'Email Notifications', checked: true },
                { label: 'SMS Alerts', checked: false },
                { label: 'Push Notifications', checked: true },
                { label: 'Weekly Reports', checked: true }
              ].map((setting, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ color: 'white' }}>{setting.label}</Typography>
                  <Box sx={{
                    width: 48,
                    height: 24,
                    borderRadius: '12px',
                    bgcolor: setting.checked ? '#8b5cf6' : 'rgba(139, 92, 246, 0.2)',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}>
                    <Box sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      bgcolor: 'white',
                      position: 'absolute',
                      top: 2,
                      left: setting.checked ? 26 : 2,
                      transition: 'all 0.3s ease'
                    }} />
                  </Box>
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{
            p: 4,
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '16px',
            mb: 3
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', mb: 3 }}>
              Security Settings
            </Typography>
            <Stack spacing={2}>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  borderColor: 'rgba(139, 92, 246, 0.3)',
                  color: '#8b5cf6',
                  '&:hover': {
                    borderColor: '#8b5cf6',
                    bgcolor: 'rgba(139, 92, 246, 0.1)'
                  }
                }}
              >
                Change Password
              </Button>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  borderColor: 'rgba(139, 92, 246, 0.3)',
                  color: '#8b5cf6',
                  '&:hover': {
                    borderColor: '#8b5cf6',
                    bgcolor: 'rgba(139, 92, 246, 0.1)'
                  }
                }}
              >
                Enable 2FA
              </Button>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  borderColor: 'rgba(139, 92, 246, 0.3)',
                  color: '#8b5cf6',
                  '&:hover': {
                    borderColor: '#8b5cf6',
                    bgcolor: 'rgba(139, 92, 246, 0.1)'
                  }
                }}
              >
                Login History
              </Button>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{
            p: 4,
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '16px'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#ef4444', mb: 2 }}>
              Danger Zone
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
              These actions are irreversible. Please proceed with caution.
            </Typography>
            <Button
              variant="outlined"
              sx={{
                borderColor: 'rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                '&:hover': {
                  borderColor: '#ef4444',
                  bgcolor: 'rgba(239, 68, 68, 0.1)'
                }
              }}
            >
              Delete Account
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );

  return (
    <Box sx={{ 
      flexGrow: 1, 
      bgcolor: '#0f0f23', 
      color: '#fff', 
      position: 'relative',
      height: '100vh',
      overflow: 'auto'
    }}>
      {/* Animated background */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default EnhancedSellerDashboard;