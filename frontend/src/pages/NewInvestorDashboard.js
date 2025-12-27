import React, { useState } from 'react';
import {
  Box, Container, Grid, Card, Typography, Button,
  Avatar, Chip, IconButton, Tabs, Tab, Stack,
  Divider, Badge, Tooltip, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField
} from '@mui/material';
import {
  TrendingUp, MonetizationOn, Assessment, AccountBalance,
  Notifications, AttachMoney, Add, Dashboard, Analytics, 
  Store, Person, Settings
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import { useAuth } from '../context/AuthContext';
import { userAPI, invoiceAPI } from '../services/api';
import { useQuery } from 'react-query';

function EnhancedInvestorDashboard() {
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
      label: 'Marketplace',
      href: '#',
      icon: <Store className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
      id: 'marketplace'
    },
    {
      label: 'Portfolio',
      href: '#',
      icon: <AccountBalance className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
      id: 'portfolio'
    },
    {
      label: 'Analytics',
      href: '#',
      icon: <Analytics className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
      id: 'analytics'
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
                      {user?.name || 'Investor'}
                    </Typography>
                    <Typography sx={{ color: '#64748b', fontSize: '12px' }}>
                      Investor Account
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

export const Logo = ({ hovered }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: hovered ? 2 : 0, justifyContent: hovered ? 'flex-start' : 'center' }}>
      <Box sx={{ 
        width: 24, 
        height: 20, 
        borderRadius: '4px 2px 4px 2px',
        background: 'linear-gradient(45deg, #00ffff, #0080ff)',
        boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)',
        border: '1px solid rgba(0, 255, 255, 0.3)'
      }} />
      {hovered && (
        <Typography variant="h6" sx={{ 
          fontWeight: 700, 
          color: '#00ffff',
          textShadow: '0 0 10px #00ffff',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s ease 0.1s'
        }}>
          InvoiceFinance
        </Typography>
      )}
    </Box>
  );
};

const DashboardContent = ({ activeSection, user, setActiveSection }) => {
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useQuery(
    'dashboard', 
    userAPI.getDashboard, 
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      refetchInterval: 30000,
      enabled: !!user?.id,
      retry: 3
    }
  );
  const { data: portfolio, isLoading: portfolioLoading } = useQuery(
    'portfolio', 
    userAPI.getPortfolio, 
    {
      refetchOnWindowFocus: false,
      staleTime: 2 * 60 * 1000,
      refetchInterval: 20000,
      enabled: !!user?.id,
      retry: 3
    }
  );
  const { data: marketplaceInvoices, isLoading: marketplaceLoading } = useQuery(
    'marketplace-invoices', 
    invoiceAPI.getMarketplace, 
    {
      refetchOnWindowFocus: false,
      staleTime: 1 * 60 * 1000,
      refetchInterval: 10000,
      enabled: !!user?.id,
      retry: 3
    }
  );

  // Show loading state
  if (dashboardLoading || portfolioLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#0f0f23' }}>
        <Typography sx={{ color: 'white' }}>Loading dashboard...</Typography>
      </Box>
    );
  }

  // Show error state
  if (dashboardError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#0f0f23' }}>
        <Typography sx={{ color: '#ef4444' }}>Error: {dashboardError?.message || 'Backend not running'}</Typography>
      </Box>
    );
  }

  const stats = [
    { 
      title: 'Total Invested', 
      value: portfolio?.totalInvested || 0, 
      icon: MonetizationOn, 
      color: '#2563eb', 
      prefix: '₹',
      change: '+12%'
    },
    { 
      title: 'Total Returns', 
      value: portfolio?.actualReturns || 0, 
      icon: TrendingUp, 
      color: '#10b981', 
      prefix: '₹',
      change: '+18%'
    },
    { 
      title: 'Average ROI', 
      value: dashboardData?.stats?.avgROI || 0, 
      icon: Assessment, 
      color: '#f59e0b', 
      suffix: '%',
      change: '+2.1%'
    },
    { 
      title: 'Active Investments', 
      value: dashboardData?.stats?.activeInvestments || 0, 
      icon: AccountBalance, 
      color: '#8b5cf6',
      change: '+3'
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'marketplace':
        return renderMarketplace();
      case 'portfolio':
        return renderPortfolio();
      case 'analytics':
        return renderAnalytics();
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
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          Investment Dashboard 📊
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Portfolio Value: ₹{(portfolio?.totalInvested || 850000).toLocaleString()}
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={stat.title}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card sx={{ 
                p: 3,
                background: 'white',
                border: '1px solid #e2e8f0',
                '&:hover': { 
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  transform: 'translateY(-4px)'
                },
                transition: 'all 0.3s ease'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ 
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    bgcolor: `${stat.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: stat.color
                  }}>
                    <stat.icon sx={{ fontSize: 24 }} />
                  </Box>
                  <Chip 
                    label={stat.change}
                    size="small"
                    sx={{
                      bgcolor: '#dcfce7',
                      color: '#166534',
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                  {stat.title}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  {stat.prefix}
                  <CountUp end={stat.value} duration={2} separator="," decimals={stat.suffix === '%' ? 1 : 0} />
                  {stat.suffix}
                </Typography>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );

  const renderMarketplace = () => (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
        🏪 Investment Marketplace
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Browse and invest in verified invoices from trusted sellers.
      </Typography>
    </Container>
  );

  const renderPortfolio = () => (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
        💼 My Portfolio
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Track your investments, returns, and portfolio performance.
      </Typography>
    </Container>
  );

  const renderAnalytics = () => (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
        📊 Investment Analytics
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Detailed analytics and insights about your investment performance.
      </Typography>
    </Container>
  );

  const renderProfile = () => (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
        👤 Investor Profile
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Manage your investor profile, KYC status, and investment preferences.
      </Typography>
    </Container>
  );

  const renderSettings = () => (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
        ⚙️ Settings
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Configure your account settings, notifications, and investment criteria.
      </Typography>
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

export default EnhancedInvestorDashboard;