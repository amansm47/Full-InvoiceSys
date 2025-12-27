import React, { useState } from 'react';
import {
  Box, Container, Grid, Card, CardContent, Typography, Button,
  Avatar, Chip, IconButton, Paper, LinearProgress, Tabs, Tab,
  Slider, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import {
  TrendingUp, AccountBalance, Assessment, MonetizationOn,
  Notifications, Search, FilterList, ShowChart, Security
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useAuth } from '../context/AuthContext';
import { userAPI, invoiceAPI } from '../services/api';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import VerticalNavbar from '../components/VerticalNavbar';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

function ModernInvestorDashboard() {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [filters, setFilters] = useState({
    riskLevel: 'all',
    minROI: 0,
    maxAmount: 1000000
  });

  const { data: dashboardData } = useQuery('dashboard', userAPI.getDashboard);
  const { data: portfolio } = useQuery('portfolio', userAPI.getPortfolio);
  const { data: analytics } = useQuery('analytics', userAPI.getAnalytics);
  const { data: marketplace } = useQuery('marketplace', () => invoiceAPI.getMarketplace(filters));

  const stats = [
    { title: 'Total Invested', value: portfolio?.totalInvested || 0, icon: MonetizationOn, color: '#6366f1', bg: '#f0f9ff', prefix: '₹' },
    { title: 'Total Returns', value: portfolio?.actualReturns || 0, icon: TrendingUp, color: '#10b981', bg: '#f0fdf4', prefix: '₹' },
    { title: 'Average ROI', value: analytics?.averageROI || 0, icon: Assessment, color: '#f59e0b', bg: '#fffbeb', suffix: '%' },
    { title: 'Active Investments', value: dashboardData?.stats?.activeInvestments || 0, icon: AccountBalance, color: '#ef4444', bg: '#fef2f2' }
  ];

  const getRiskColor = (score) => {
    if (score <= 30) return '#10b981';
    if (score <= 70) return '#f59e0b';
    return '#ef4444';
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <VerticalNavbar />
      
      <Box sx={{ flex: 1, p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
              Investment Dashboard 📊
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Portfolio Value: ₹{portfolio?.totalInvested?.toLocaleString() || 0}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <IconButton sx={{ bgcolor: 'white', boxShadow: 1 }}>
              <Search />
            </IconButton>
            <IconButton sx={{ bgcolor: 'white', boxShadow: 1 }}>
              <Notifications />
            </IconButton>
          </Box>
        </Box>

        {/* Stats Grid */}
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
                  border: '1px solid #e2e8f0',
                  borderRadius: 3,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
                  transition: 'all 0.3s ease'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        {stat.prefix}
                        <CountUp end={stat.value} duration={2} separator="," decimals={stat.suffix === '%' ? 1 : 0} />
                        {stat.suffix}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 2, 
                      bgcolor: stat.bg,
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <stat.icon sx={{ color: stat.color, fontSize: 28 }} />
                    </Box>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Tabs */}
        <Card sx={{ 
          border: '1px solid #e2e8f0',
          borderRadius: 3,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          mb: 3
        }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem'
              }
            }}
          >
            <Tab label="📊 Overview" />
            <Tab label="🏪 Marketplace" />
            <Tab label="💼 Portfolio" />
          </Tabs>
        </Card>

        {/* Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card sx={{ 
                p: 3, 
                border: '1px solid #e2e8f0',
                borderRadius: 3,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
                  Monthly Returns Trend
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={portfolio?.monthlyReturns || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Returns']} />
                    <Line type="monotone" dataKey="returns" stroke="#6366f1" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ 
                p: 3, 
                border: '1px solid #e2e8f0',
                borderRadius: 3,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
                  Risk Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Low Risk', value: portfolio?.riskDistribution?.low || 0 },
                        { name: 'Medium Risk', value: portfolio?.riskDistribution?.medium || 0 },
                        { name: 'High Risk', value: portfolio?.riskDistribution?.high || 0 }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Marketplace Tab */}
        <TabPanel value={tabValue} index={1}>
          {/* Filters */}
          <Card sx={{ 
            p: 3, 
            border: '1px solid #e2e8f0',
            borderRadius: 3,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            mb: 3
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1e293b' }}>
              Investment Filters
            </Typography>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Risk Level</InputLabel>
                  <Select
                    value={filters.riskLevel}
                    onChange={(e) => setFilters({...filters, riskLevel: e.target.value})}
                  >
                    <MenuItem value="all">All Risk Levels</MenuItem>
                    <MenuItem value="low">Low Risk (≤30)</MenuItem>
                    <MenuItem value="medium">Medium Risk (31-70)</MenuItem>
                    <MenuItem value="high">High Risk (>70)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography gutterBottom sx={{ fontWeight: 500 }}>Min ROI: {filters.minROI}%</Typography>
                <Slider
                  value={filters.minROI}
                  onChange={(e, value) => setFilters({...filters, minROI: value})}
                  min={0}
                  max={25}
                  step={1}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography gutterBottom sx={{ fontWeight: 500 }}>Max Amount: ₹{filters.maxAmount.toLocaleString()}</Typography>
                <Slider
                  value={filters.maxAmount}
                  onChange={(e, value) => setFilters({...filters, maxAmount: value})}
                  min={10000}
                  max={1000000}
                  step={10000}
                />
              </Grid>
            </Grid>
          </Card>

          {/* Investment Opportunities */}
          <Grid container spacing={3}>
            {marketplace?.filter(invoice => invoice.status === 'listed').map((invoice, index) => {
              const roi = ((invoice.amount - invoice.discountedAmount) / invoice.discountedAmount * 100);
              const daysToMaturity = Math.ceil((new Date(invoice.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
              
              return (
                <Grid item xs={12} md={6} lg={4} key={invoice._id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card sx={{ 
                      p: 3, 
                      border: '1px solid #e2e8f0',
                      borderRadius: 3,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      '&:hover': { 
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          #{invoice.invoiceNumber}
                        </Typography>
                        <Chip 
                          label={`${roi.toFixed(1)}% ROI`}
                          sx={{ 
                            bgcolor: '#dcfce7',
                            color: '#166534',
                            fontWeight: 600
                          }}
                        />
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Seller: {invoice.seller?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Buyer: {invoice.buyer?.name}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                          ₹{invoice.discountedAmount?.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Full Amount: ₹{invoice.amount?.toLocaleString()}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>Risk Score</Typography>
                          <Chip 
                            label={invoice.riskScore}
                            size="small"
                            sx={{ 
                              bgcolor: getRiskColor(invoice.riskScore) + '20',
                              color: getRiskColor(invoice.riskScore),
                              fontWeight: 600
                            }}
                          />
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>Maturity</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {daysToMaturity} days
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Button 
                        variant="contained" 
                        fullWidth
                        sx={{
                          bgcolor: '#6366f1',
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                          py: 1.5,
                          '&:hover': { bgcolor: '#5b5bd6' }
                        }}
                      >
                        Invest Now
                      </Button>
                    </Card>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>
        </TabPanel>

        {/* Portfolio Tab */}
        <TabPanel value={tabValue} index={2}>
          <Card sx={{ 
            p: 3, 
            border: '1px solid #e2e8f0',
            borderRadius: 3,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
              My Investments
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Your investment portfolio will be displayed here.
            </Typography>
          </Card>
        </TabPanel>
      </Box>
    </Box>
  );
}

export default ModernInvestorDashboard;