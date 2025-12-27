import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  TrendingUp,
  AccountBalance,
  Analytics,
  AccountCircle,
  Settings,
  Logout,
  MonetizationOn
} from '@mui/icons-material';

const InvestorDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'marketplace', label: 'Marketplace', icon: <TrendingUp /> },
    { id: 'portfolio', label: 'My Portfolio', icon: <AccountBalance /> },
    { id: 'investments', label: 'Investments', icon: <MonetizationOn /> },
    { id: 'analytics', label: 'Analytics', icon: <Analytics /> },
    { id: 'profile', label: 'Profile', icon: <AccountCircle /> },
    { id: 'settings', label: 'Settings', icon: <Settings /> },
    { id: 'logout', label: 'Logout', icon: <Logout /> }
  ];

  const stats = [
    { label: 'Total Invested', value: '₹45.2L', color: '#22c55e' },
    { label: 'Active Investments', value: '18', color: '#3b82f6' },
    { label: 'Total Returns', value: '₹8.7L', color: '#06b6d4' },
    { label: 'ROI', value: '19.2%', color: '#f59e0b' }
  ];

  const recentInvestments = [
    { company: 'Tech Solutions Pvt Ltd', amount: '₹2.5L', roi: '15%', status: 'Active' },
    { company: 'Manufacturing Co.', amount: '₹3.2L', roi: '18%', status: 'Completed' },
    { company: 'Export Business', amount: '₹1.8L', roi: '22%', status: 'Active' }
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#000000' }}>
      {/* Sidebar */}
      <Box sx={{
        width: 280,
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRight: '1px solid rgba(34, 197, 94, 0.2)',
        p: 3
      }}>
        {/* Logo */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h5" sx={{
            fontWeight: 900,
            background: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            ReturnX
          </Typography>
          <Typography variant="caption" sx={{ color: '#3b82f6' }}>
            Investor Dashboard
          </Typography>
        </Box>

        {/* Navigation */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {sidebarItems.map((item) => (
            <Button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              startIcon={item.icon}
              sx={{
                justifyContent: 'flex-start',
                color: activeTab === item.id ? '#3b82f6' : '#94a3b8',
                background: activeTab === item.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                border: activeTab === item.id ? '1px solid rgba(59, 130, 246, 0.3)' : 'none',
                borderRadius: '12px',
                py: 1.5,
                px: 2,
                '&:hover': {
                  background: 'rgba(59, 130, 246, 0.1)',
                  color: '#3b82f6'
                }
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 4, background: '#000000' }}>
        <Typography variant="h4" sx={{ 
          color: '#ffffff', 
          mb: 4,
          fontWeight: 700
        }}>
          Investor Dashboard
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
                border: `1px solid ${stat.color}30`,
                borderRadius: '16px'
              }}>
                <CardContent>
                  <Typography variant="h4" sx={{ 
                    color: stat.color, 
                    fontWeight: 'bold',
                    mb: 1
                  }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Content Area */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '16px'
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#ffffff', mb: 3 }}>
                  Recent Investments
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {recentInvestments.map((investment, index) => (
                    <Box key={index} sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 2,
                      background: 'rgba(59, 130, 246, 0.1)',
                      borderRadius: '12px',
                      border: '1px solid rgba(59, 130, 246, 0.2)'
                    }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 600 }}>
                          {investment.company}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                          Amount: {investment.amount} • ROI: {investment.roi}
                        </Typography>
                      </Box>
                      <Box sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: '20px',
                        background: investment.status === 'Active' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(6, 182, 212, 0.2)',
                        color: investment.status === 'Active' ? '#22c55e' : '#06b6d4'
                      }}>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {investment.status}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '16px'
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<TrendingUp />}
                    sx={{
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #2563eb, #1d4ed8)'
                      }
                    }}
                  >
                    Browse Marketplace
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<AccountBalance />}
                    sx={{
                      borderColor: '#22c55e',
                      color: '#22c55e',
                      '&:hover': {
                        borderColor: '#06b6d4',
                        color: '#06b6d4'
                      }
                    }}
                  >
                    View Portfolio
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Analytics />}
                    sx={{
                      borderColor: '#06b6d4',
                      color: '#06b6d4',
                      '&:hover': {
                        borderColor: '#22c55e',
                        color: '#22c55e'
                      }
                    }}
                  >
                    View Analytics
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default InvestorDashboard;