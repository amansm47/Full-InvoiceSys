import React, { useState } from 'react';
import {
  Box, Container, Grid, Card, CardContent, Typography, Button,
  Avatar, Chip, IconButton, Paper, LinearProgress, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow,
  Divider, Stack, Badge, Tooltip, Tab, Tabs
} from '@mui/material';
import {
  TrendingUp, AccountBalance, Assessment, Visibility, MoreVert,
  Notifications, Search, Dashboard, Analytics, Settings, Help,
  AttachMoney, Schedule, PendingActions, Verified, Star,
  ShowChart, PieChart, BarChart, Timeline, FilterList
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useAuth } from '../context/AuthContext';
import { userAPI, invoiceAPI } from '../services/api';
import { useQuery } from 'react-query';

function EnhancedInvestorDashboard() {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [filterDialog, setFilterDialog] = useState(false);

  const { data: dashboardData } = useQuery('investor-dashboard', userAPI.getDashboard);
  const { data: marketplace = [] } = useQuery('marketplace', () => invoiceAPI.getMarketplace());
  const { data: portfolio } = useQuery('portfolio', userAPI.getPortfolio);

  const stats = dashboardData?.stats || {};

  const statCards = [
    { 
      title: 'Total Invested', 
      value: stats.totalInvested || 0, 
      icon: AttachMoney, 
      color: '#2563eb', 
      bg: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      change: '+18%',
      changeColor: '#10b981',
      prefix: '₹'
    },
    { 
      title: 'Active Investments', 
      value: stats.activeInvestments || 0, 
      icon: TrendingUp, 
      color: '#10b981', 
      bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      change: '+12%',
      changeColor: '#10b981'
    },
    { 
      title: 'Total Returns', 
      value: stats.totalReturns || 0, 
      icon: ShowChart, 
      color: '#f59e0b', 
      bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
      prefix: '₹',
      change: '+25%',
      changeColor: '#10b981'
    },
    { 
      title: 'Success Rate', 
      value: stats.successRate || 0, 
      icon: Assessment, 
      color: '#8b5cf6', 
      bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', 
      suffix: '%',
      change: '+5%',
      changeColor: '#10b981'
    }
  ];

  const quickActions = [
    { title: 'Browse Market', icon: <Search />, color: '#2563eb', action: () => {} },
    { title: 'Portfolio', icon: <PieChart />, color: '#10b981', action: () => {} },
    { title: 'Analytics', icon: <BarChart />, color: '#f59e0b', action: () => {} },
    { title: 'Reports', icon: <Timeline />, color: '#8b5cf6', action: () => {} }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return { bg: '#dcfce7', color: '#166534' };
      case 'pending': return { bg: '#fef3c7', color: '#92400e' };
      case 'funded': return { bg: '#dbeafe', color: '#1e40af' };
      default: return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  const getRiskColor = (risk) => {
    if (risk <= 30) return { bg: '#dcfce7', color: '#166534', label: 'Low' };
    if (risk <= 70) return { bg: '#fef3c7', color: '#92400e', label: 'Medium' };
    return { bg: '#fee2e2', color: '#dc2626', label: 'High' };
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Box sx={{ 
        width: 280, 
        bgcolor: 'white', 
        borderRight: '1px solid #e2e8f0',
        p: 3,
        display: { xs: 'none', md: 'block' }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar sx={{ 
            mr: 2, 
            background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
            width: 40,
            height: 40,
            fontWeight: 'bold'
          }}>
            IF
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
            InvestorHub
          </Typography>
        </Box>

        <Stack spacing={1}>
          {[
            { icon: <Dashboard />, label: 'Dashboard', active: true },
            { icon: <Search />, label: 'Marketplace' },
            { icon: <PieChart />, label: 'Portfolio' },
            { icon: <Analytics />, label: 'Analytics' },
            { icon: <Settings />, label: 'Settings' }
          ].map((item, index) => (
            <Button
              key={index}
              fullWidth
              startIcon={item.icon}
              sx={{
                justifyContent: 'flex-start',
                py: 1.5,
                px: 2,
                color: item.active ? '#2563eb' : '#64748b',
                bgcolor: item.active ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                fontWeight: item.active ? 600 : 500,
                '&:hover': {
                  bgcolor: 'rgba(37, 99, 235, 0.05)'
                }
              }}
            >
              {item.label}
            </Button>
          ))}
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#1e293b' }}>
            Investment Tip
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
            Diversify across different risk levels for optimal returns
          </Typography>
          <Button variant="contained" size="small" fullWidth>
            Learn More
          </Button>
        </Box>
      </Box>
      
      {/* Main Content */}
      <Box sx={{ flex: 1, p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
              Welcome back, {user?.name}! 📈
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track your investments and discover new opportunities
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Tooltip title="Filter">
              <IconButton 
                sx={{ bgcolor: 'white', boxShadow: 1 }}
                onClick={() => setFilterDialog(true)}
              >
                <FilterList />
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <IconButton sx={{ bgcolor: 'white', boxShadow: 1 }}>
                <Badge badgeContent={5} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<Search />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1.5
              }}
            >
              Browse Market
            </Button>
          </Box>
        </Box>

        {/* Stats Grid */}
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
                  height: '100%',
                  background: 'white',
                  '&:hover': { 
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ 
                      width: 60,
                      height: 60,
                      borderRadius: 2,
                      background: stat.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      <stat.icon sx={{ fontSize: 28 }} />
                    </Box>
                    <Chip 
                      label={stat.change}
                      size="small"
                      sx={{
                        bgcolor: `${stat.changeColor}20`,
                        color: stat.changeColor,
                        fontWeight: 600
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
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
          {quickActions.map((action, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { 
                    boxShadow: `0 8px 25px ${action.color}20`,
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
                onClick={action.action}
                >
                  <Box sx={{ 
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    bgcolor: `${action.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    color: action.color
                  }}>
                    {action.icon}
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    {action.title}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Investment Opportunities */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  Investment Opportunities
                </Typography>
                <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
                  <Tab label="All" />
                  <Tab label="Low Risk" />
                  <Tab label="High Return" />
                </Tabs>
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Invoice</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Seller</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Risk</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>ROI</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Due Date</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {marketplace.slice(0, 6).map((invoice) => {
                      const statusStyle = getStatusColor(invoice.status);
                      const riskStyle = getRiskColor(invoice.riskScore || 50);
                      const roi = ((invoice.amount - invoice.discountedAmount) / invoice.discountedAmount * 100) || 0;
                      
                      return (
                        <TableRow key={invoice._id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ 
                                width: 32, 
                                height: 32, 
                                bgcolor: '#2563eb20', 
                                color: '#2563eb',
                                mr: 2,
                                fontSize: '0.875rem'
                              }}>
                                {invoice.invoiceNumber?.slice(-2) || 'IN'}
                              </Avatar>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                #{invoice.invoiceNumber || `INV-${invoice._id?.slice(-6)}`}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {invoice.seller?.name || 'Unknown Seller'}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#64748b' }}>
                                {invoice.seller?.businessType || 'Business'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              ₹{(invoice.amount || 0).toLocaleString()}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                              Invest: ₹{(invoice.discountedAmount || 0).toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={riskStyle.label}
                              size="small"
                              sx={{
                                bgcolor: riskStyle.bg,
                                color: riskStyle.color,
                                fontWeight: 500
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#10b981' }}>
                                {roi.toFixed(1)}%
                              </Typography>
                              <Star sx={{ fontSize: 16, color: '#f59e0b', ml: 0.5 }} />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                              {new Date(invoice.dueDate).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button 
                                size="small" 
                                variant="contained"
                                sx={{ 
                                  minWidth: 'auto',
                                  px: 2,
                                  py: 0.5,
                                  fontSize: '0.75rem'
                                }}
                              >
                                Invest
                              </Button>
                              <Tooltip title="View Details">
                                <IconButton size="small" sx={{ color: '#64748b' }}>
                                  <Visibility fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>

          {/* Sidebar Cards */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              {/* Portfolio Performance */}
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1e293b' }}>
                  Portfolio Performance
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      This Month
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#10b981' }}>
                      +12.5%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={75}
                    sx={{ 
                      height: 8,
                      borderRadius: 4,
                      bgcolor: '#e2e8f0',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                        borderRadius: 4
                      }
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                      ₹{(stats.totalReturns || 0).toLocaleString()}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      Total Returns
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                      {stats.activeInvestments || 0}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      Active
                    </Typography>
                  </Box>
                </Box>
              </Card>

              {/* Risk Distribution */}
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
                  Risk Distribution
                </Typography>
                <Stack spacing={2}>
                  {[
                    { label: 'Low Risk', value: 45, color: '#10b981' },
                    { label: 'Medium Risk', value: 35, color: '#f59e0b' },
                    { label: 'High Risk', value: 20, color: '#ef4444' }
                  ].map((risk, index) => (
                    <Box key={index}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#1e293b' }}>
                          {risk.label}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {risk.value}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={risk.value}
                        sx={{ 
                          height: 6,
                          borderRadius: 3,
                          bgcolor: '#e2e8f0',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: risk.color,
                            borderRadius: 3
                          }
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              </Card>

              {/* Market Insights */}
              <Card sx={{ 
                p: 3,
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                color: 'white'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  📊 Market Insights
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6, mb: 2 }}>
                  Manufacturing sector invoices showing 15% higher returns this month.
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  sx={{ 
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  View Details
                </Button>
              </Card>
            </Stack>
          </Grid>
        </Grid>

        {/* Filter Dialog */}
        <Dialog open={filterDialog} onClose={() => setFilterDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
            Filter Investments
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Min Amount"
                  type="number"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Max Amount"
                  type="number"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Risk Level"
                  select
                  variant="outlined"
                  SelectProps={{ native: true }}
                >
                  <option value="">All</option>
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Sector"
                  select
                  variant="outlined"
                  SelectProps={{ native: true }}
                >
                  <option value="">All Sectors</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="retail">Retail</option>
                  <option value="services">Services</option>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 2 }}>
            <Button onClick={() => setFilterDialog(false)} sx={{ color: '#64748b' }}>
              Cancel
            </Button>
            <Button variant="contained">
              Apply Filters
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default EnhancedInvestorDashboard;