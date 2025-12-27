import React, { useState } from 'react';
import {
  Box, Container, Grid, Card, Typography, Button,
  Avatar, Chip, IconButton, LinearProgress, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField,
  Divider, Stack, Badge, Tooltip
} from '@mui/material';
import {
  Add, Receipt, TrendingUp, AttachMoney, CheckCircle,
  Upload, Notifications, Dashboard, FileUpload, Analytics, Settings
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useAuth } from '../context/AuthContext';
import { userAPI, invoiceAPI } from '../services/api';
import { useQuery } from 'react-query';

function EnhancedSellerDashboard() {
  const { user } = useAuth();
  const [uploadDialog, setUploadDialog] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    invoiceNumber: '', amount: '', dueDate: '', customerEmail: ''
  });

  const { data: dashboardData } = useQuery('seller-dashboard', userAPI.getDashboard);
  const { data: invoices = [] } = useQuery('seller-invoices', () => invoiceAPI.getSellerInvoices());

  const stats = dashboardData?.stats || {};

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
              <Badge badgeContent={3} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setUploadDialog(true)}
            sx={{ borderRadius: 2, px: 3 }}
          >
            New Invoice
          </Button>
        </Box>
      </Box>
      
      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
            Welcome back, {user?.name}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's your invoice financing overview
          </Typography>
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
            { title: 'Upload Invoice', icon: <FileUpload />, color: '#2563eb', action: () => setUploadDialog(true) },
            { title: 'View Analytics', icon: <Analytics />, color: '#10b981' },
            { title: 'Marketplace', icon: <Dashboard />, color: '#f59e0b' },
            { title: 'Settings', icon: <Settings />, color: '#8b5cf6' }
          ].map((action, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Card sx={{ 
                p: 3, 
                textAlign: 'center',
                cursor: 'pointer',
                border: '1px solid #e2e8f0',
                '&:hover': { 
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  transform: 'translateY(-2px)',
                  borderColor: action.color
                },
                transition: 'all 0.3s ease'
              }}
              onClick={action.action}
              >
                <Box sx={{ 
                  width: 56,
                  height: 56,
                  borderRadius: '16px',
                  bgcolor: `${action.color}15`,
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
            </Grid>
          ))}
        </Grid>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Recent Invoices */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ p: 3, border: '1px solid #e2e8f0' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  Recent Invoices
                </Typography>
                <Button variant="outlined" size="small" sx={{ borderRadius: 2 }}>
                  View All
                </Button>
              </Box>
              
              <Stack spacing={2}>
                {[
                  { id: 'INV-001', customer: 'Tech Corp Ltd', amount: 125000, status: 'funded', date: '2024-01-15' },
                  { id: 'INV-002', customer: 'Global Industries', amount: 85000, status: 'pending', date: '2024-01-14' },
                  { id: 'INV-003', customer: 'Smart Solutions', amount: 95000, status: 'verified', date: '2024-01-13' },
                  { id: 'INV-004', customer: 'Digital Hub', amount: 110000, status: 'funded', date: '2024-01-12' }
                ].map((invoice, index) => {
                  const getStatusColor = (status) => {
                    switch (status) {
                      case 'funded': return { bg: '#dcfce7', color: '#166534' };
                      case 'pending': return { bg: '#fef3c7', color: '#92400e' };
                      case 'verified': return { bg: '#dbeafe', color: '#1e40af' };
                      default: return { bg: '#f3f4f6', color: '#374151' };
                    }
                  };
                  const statusStyle = getStatusColor(invoice.status);
                  
                  return (
                    <Box key={index} sx={{ 
                      p: 3, 
                      border: '1px solid #e2e8f0', 
                      borderRadius: 2,
                      '&:hover': { bgcolor: '#f8fafc' }
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ 
                            width: 40, 
                            height: 40, 
                            bgcolor: '#2563eb15', 
                            color: '#2563eb',
                            mr: 3,
                            fontWeight: 600
                          }}>
                            {invoice.id.slice(-2)}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {invoice.id}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {invoice.customer}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                            ₹{invoice.amount.toLocaleString()}
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

          {/* Sidebar Cards */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              {/* Monthly Progress */}
              <Card sx={{ p: 3, border: '1px solid #e2e8f0' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
                  Monthly Target
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      Target: ₹5,00,000
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ₹4,50,000
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={90}
                    sx={{ 
                      height: 8,
                      borderRadius: 4,
                      bgcolor: '#e2e8f0',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(90deg, #2563eb 0%, #10b981 100%)',
                        borderRadius: 4
                      }
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#64748b', mt: 1, display: 'block' }}>
                    90% completed
                  </Typography>
                </Box>
              </Card>

              {/* Tips Card */}
              <Card sx={{ 
                p: 3,
                background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
                color: 'white',
                border: 'none'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  💡 Pro Tip
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                  Upload clear invoice images for faster verification and funding approval.
                </Typography>
              </Card>
            </Stack>
          </Grid>
        </Grid>

        {/* Upload Dialog */}
        <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
            Upload New Invoice
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Invoice Number"
                  value={invoiceForm.invoiceNumber}
                  onChange={(e) => setInvoiceForm({...invoiceForm, invoiceNumber: e.target.value})}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={invoiceForm.amount}
                  onChange={(e) => setInvoiceForm({...invoiceForm, amount: e.target.value})}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1, color: '#64748b' }}>₹</Typography>
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Customer Email"
                  value={invoiceForm.customerEmail}
                  onChange={(e) => setInvoiceForm({...invoiceForm, customerEmail: e.target.value})}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Due Date"
                  type="date"
                  value={invoiceForm.dueDate}
                  onChange={(e) => setInvoiceForm({...invoiceForm, dueDate: e.target.value})}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 2 }}>
            <Button onClick={() => setUploadDialog(false)} sx={{ color: '#64748b' }}>
              Cancel
            </Button>
            <Button variant="contained" startIcon={<Upload />}>
              Upload Invoice
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

export default EnhancedSellerDashboard;