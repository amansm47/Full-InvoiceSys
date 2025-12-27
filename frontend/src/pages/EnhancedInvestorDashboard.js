import React, { useState } from 'react';
import {
  Box, Container, Grid, Card, Typography, Button,
  Avatar, Chip, IconButton, Tabs, Tab, Stack,
  Divider, Badge, Tooltip, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField
} from '@mui/material';
import {
  TrendingUp, MonetizationOn, Assessment, AccountBalance,
  Notifications, AttachMoney, Add
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useAuth } from '../context/AuthContext';
import { userAPI, invoiceAPI } from '../services/api';
import { useQuery } from 'react-query';

function EnhancedInvestorDashboard() {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [investDialog, setInvestDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState('');

  const { data: dashboardData } = useQuery('dashboard', userAPI.getDashboard);
  const { data: portfolio } = useQuery('portfolio', userAPI.getPortfolio);

  const stats = [
    { 
      title: 'Total Invested', 
      value: portfolio?.totalInvested || 850000, 
      icon: MonetizationOn, 
      color: '#2563eb', 
      prefix: '₹',
      change: '+12%'
    },
    { 
      title: 'Total Returns', 
      value: portfolio?.actualReturns || 125000, 
      icon: TrendingUp, 
      color: '#10b981', 
      prefix: '₹',
      change: '+18%'
    },
    { 
      title: 'Average ROI', 
      value: 14.7, 
      icon: Assessment, 
      color: '#f59e0b', 
      suffix: '%',
      change: '+2.1%'
    },
    { 
      title: 'Active Investments', 
      value: dashboardData?.stats?.activeInvestments || 12, 
      icon: AccountBalance, 
      color: '#8b5cf6',
      change: '+3'
    }
  ];

  const mockChartData = [
    { month: 'Jan', returns: 45000 },
    { month: 'Feb', returns: 52000 },
    { month: 'Mar', returns: 48000 },
    { month: 'Apr', returns: 61000 },
    { month: 'May', returns: 55000 },
    { month: 'Jun', returns: 67000 }
  ];

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: 'white', 
        borderBottom: '1px solid #e2e8f0',
        px: 4,
        py: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
            InvoiceFinance
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Tooltip title="Notifications">
            <IconButton>
              <Badge badgeContent={5} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
            Investment Dashboard 📊
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Portfolio Value: ₹{(portfolio?.totalInvested || 850000).toLocaleString()}
          </Typography>
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

        {/* Tabs */}
        <Card sx={{ mb: 3, border: '1px solid #e2e8f0' }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                minHeight: 60
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
            <Grid item xs={12} lg={8}>
              <Card sx={{ p: 3, mb: 3, border: '1px solid #e2e8f0' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
                  Investment Performance
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Returns']} />
                    <Line type="monotone" dataKey="returns" stroke="#2563eb" strokeWidth={3} dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card sx={{ p: 3, border: '1px solid #e2e8f0' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
                  Recent Activity
                </Typography>
                <Stack spacing={2}>
                  {[
                    { text: 'Earned ₹5,000 from Invoice #1234', time: '2 hours ago', type: 'profit' },
                    { text: 'Invested ₹50,000 in Invoice #1235', time: '1 day ago', type: 'investment' },
                    { text: 'Invoice #1236 matured successfully', time: '2 days ago', type: 'matured' }
                  ].map((activity, index) => (
                    <Box key={index} sx={{ 
                      p: 3, 
                      border: '1px solid #e2e8f0', 
                      borderRadius: 2,
                      '&:hover': { bgcolor: '#f8fafc' }
                    }}>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b', mb: 0.5 }}>
                        {activity.text}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        {activity.time}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Card>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Stack spacing={3}>
                <Card sx={{ p: 3, border: '1px solid #e2e8f0' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
                    Quick Stats
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        This Month ROI
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#10b981' }}>
                        +14.2%
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Avg. Investment
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ₹45,000
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Success Rate
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#10b981' }}>
                        96.8%
                      </Typography>
                    </Box>
                  </Stack>
                </Card>

                <Card sx={{ 
                  p: 3,
                  background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
                  color: 'white',
                  border: 'none'
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    💡 Investment Opportunity
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                    High-yield invoices available with 15%+ ROI
                  </Typography>
                  <Button 
                    variant="contained" 
                    fullWidth
                    sx={{ 
                      bgcolor: 'white',
                      color: '#2563eb',
                      '&:hover': { bgcolor: '#f8fafc' }
                    }}
                    onClick={() => setTabValue(1)}
                  >
                    Explore Now
                  </Button>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Marketplace Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {[
              { id: 'INV-001', seller: 'Kumar Textiles', buyer: 'Fashion Hub Ltd', amount: 150000, discountedAmount: 135000, riskScore: 25, dueDate: '2024-02-15' },
              { id: 'INV-002', seller: 'Tech Solutions', buyer: 'Global Corp', amount: 250000, discountedAmount: 220000, riskScore: 45, dueDate: '2024-02-20' },
              { id: 'INV-003', seller: 'Auto Parts Co', buyer: 'Car Manufacturer', amount: 300000, discountedAmount: 270000, riskScore: 35, dueDate: '2024-02-25' },
              { id: 'INV-004', seller: 'Food Supplies', buyer: 'Restaurant Chain', amount: 80000, discountedAmount: 72000, riskScore: 20, dueDate: '2024-02-18' }
            ].map((invoice, index) => {
              const roi = ((invoice.amount - invoice.discountedAmount) / invoice.discountedAmount * 100);
              const daysToMaturity = Math.ceil((new Date(invoice.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
              
              const getRiskColor = (score) => {
                if (score <= 30) return '#10b981';
                if (score <= 70) return '#f59e0b';
                return '#ef4444';
              };
              
              const getRiskLabel = (score) => {
                if (score <= 30) return 'Low Risk';
                if (score <= 70) return 'Medium Risk';
                return 'High Risk';
              };
              
              return (
                <Grid item xs={12} md={6} lg={4} key={invoice.id}>
                  <Card sx={{ 
                    p: 3,
                    border: '1px solid #e2e8f0',
                    '&:hover': { 
                      boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {invoice.id}
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
                        Seller: {invoice.seller}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Buyer: {invoice.buyer}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        ₹{(invoice.discountedAmount || 0).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Full Amount: ₹{(invoice.amount || 0).toLocaleString()}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>Risk Score</Typography>
                        <Chip 
                          label={`${invoice.riskScore} - ${getRiskLabel(invoice.riskScore)}`}
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
                      onClick={() => {
                        setSelectedInvoice(invoice);
                        setInvestDialog(true);
                      }}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        py: 1.5
                      }}
                    >
                      Invest Now
                    </Button>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </TabPanel>

        {/* Portfolio Tab */}
        <TabPanel value={tabValue} index={2}>
          <Card sx={{ p: 3, border: '1px solid #e2e8f0' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
              My Investment Portfolio
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Your detailed investment portfolio and performance metrics will be displayed here.
            </Typography>
          </Card>
        </TabPanel>

        {/* Investment Dialog */}
        <Dialog open={investDialog} onClose={() => setInvestDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
            Invest in Invoice #{selectedInvoice?.id}
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ pt: 3 }}>
            {selectedInvoice && (
              <Box>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Seller</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedInvoice.seller}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Buyer</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedInvoice.buyer}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Invoice Amount</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>₹{(selectedInvoice.amount || 0).toLocaleString()}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Investment Amount</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>₹{(selectedInvoice.discountedAmount || 0).toLocaleString()}</Typography>
                  </Grid>
                </Grid>
                
                <TextField
                  fullWidth
                  label="Investment Amount"
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  variant="outlined"
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1, color: '#64748b' }}>₹</Typography>
                  }}
                  helperText={`Maximum: ₹${(selectedInvoice.discountedAmount || 0).toLocaleString()}`}
                />
                
                <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                    Expected Return: ₹{investmentAmount ? (parseFloat(investmentAmount) * (selectedInvoice.amount / selectedInvoice.discountedAmount)).toLocaleString() : '0'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    ROI: {investmentAmount ? (((selectedInvoice.amount - selectedInvoice.discountedAmount) / selectedInvoice.discountedAmount) * 100).toFixed(1) : '0'}%
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 2 }}>
            <Button onClick={() => setInvestDialog(false)} sx={{ color: '#64748b' }}>
              Cancel
            </Button>
            <Button variant="contained" startIcon={<AttachMoney />}>
              Confirm Investment
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

export default EnhancedInvestorDashboard;