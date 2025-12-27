import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Upload,
  Receipt,
  Analytics,
  AccountCircle,
  Settings,
  Logout
} from '@mui/icons-material';

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'upload', label: 'Upload Invoice', icon: <Upload /> },
    { id: 'invoices', label: 'My Invoices', icon: <Receipt /> },
    { id: 'analytics', label: 'Analytics', icon: <Analytics /> },
    { id: 'profile', label: 'Profile', icon: <AccountCircle /> },
    { id: 'settings', label: 'Settings', icon: <Settings /> },
    { id: 'logout', label: 'Logout', icon: <Logout /> }
  ];

  const stats = [
    { label: 'Total Invoices', value: '24', color: '#22c55e' },
    { label: 'Funded Amount', value: '₹12.5L', color: '#3b82f6' },
    { label: 'Pending Approval', value: '3', color: '#f59e0b' },
    { label: 'Success Rate', value: '95%', color: '#06b6d4' }
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
          <Typography variant="caption" sx={{ color: '#22c55e' }}>
            Seller Dashboard
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
                color: activeTab === item.id ? '#22c55e' : '#94a3b8',
                background: activeTab === item.id ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                border: activeTab === item.id ? '1px solid rgba(34, 197, 94, 0.3)' : 'none',
                borderRadius: '12px',
                py: 1.5,
                px: 2,
                '&:hover': {
                  background: 'rgba(34, 197, 94, 0.1)',
                  color: '#22c55e'
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
          Seller Dashboard
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
              border: '1px solid rgba(34, 197, 94, 0.2)',
              borderRadius: '16px',
              height: 400
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
                  Recent Activity
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: 300,
                  color: '#94a3b8'
                }}>
                  Activity chart will be displayed here
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              borderRadius: '16px',
              height: 400
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Upload />}
                    sx={{
                      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #16a34a, #15803d)'
                      }
                    }}
                  >
                    Upload New Invoice
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Receipt />}
                    sx={{
                      borderColor: '#3b82f6',
                      color: '#3b82f6',
                      '&:hover': {
                        borderColor: '#22c55e',
                        color: '#22c55e'
                      }
                    }}
                  >
                    View All Invoices
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

export default SellerDashboard;