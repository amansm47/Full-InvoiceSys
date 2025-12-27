import React, { useState } from 'react';
import {
  Box, Container, Grid, Card, CardContent, Typography, Button,
  Avatar, Chip, IconButton, Paper, LinearProgress, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import {
  Add, Receipt, TrendingUp, AccountBalance, CheckCircle,
  Upload, Visibility, MoreVert, Notifications, Search
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useAuth } from '../context/AuthContext';
import { userAPI, invoiceAPI } from '../services/api';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import VerticalNavbar from '../components/VerticalNavbar';

function ModernSellerDashboard() {
  const { user } = useAuth();
  const [uploadDialog, setUploadDialog] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    invoiceNumber: '', amount: '', dueDate: '', customerEmail: ''
  });

  const { data: dashboardData } = useQuery('seller-dashboard', userAPI.getDashboard);
  const { data: invoices = [] } = useQuery('seller-invoices', () => invoiceAPI.getSellerInvoices());

  const stats = dashboardData?.stats || {};

  const statCards = [
    { title: 'Total Invoices', value: stats.totalInvoices || 0, icon: Receipt, color: '#6366f1', bg: '#f0f9ff' },
    { title: 'Funded', value: stats.funded || 0, icon: CheckCircle, color: '#10b981', bg: '#f0fdf4' },
    { title: 'Total Funded', value: stats.totalFunded || 0, icon: AccountBalance, color: '#f59e0b', bg: '#fffbeb', prefix: '₹' },
    { title: 'Success Rate', value: stats.successRate || 0, icon: TrendingUp, color: '#ef4444', bg: '#fef2f2', suffix: '%' }
  ];

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <VerticalNavbar />
      
      <Box sx={{ flex: 1, p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
              Good morning, {user?.name}! 👋
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Here's what's happening with your invoices today
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <IconButton sx={{ bgcolor: 'white', boxShadow: 1 }}>
              <Search />
            </IconButton>
            <IconButton sx={{ bgcolor: 'white', boxShadow: 1 }}>
              <Notifications />
            </IconButton>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setUploadDialog(true)}
              sx={{
                bgcolor: '#6366f1',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                '&:hover': { bgcolor: '#5b5bd6' }
              }}
            >
              New Invoice
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
                        <CountUp end={stat.value} duration={2} separator="," />
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

        {/* Quick Actions */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Card sx={{ 
              p: 3, 
              border: '1px solid #e2e8f0',
              borderRadius: 3,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
                Recent Invoices
              </Typography>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Invoice</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Customer</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoices.slice(0, 5).map((invoice) => (
                      <TableRow key={invoice._id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            #{invoice.invoiceNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {invoice.customerEmail}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            ₹{invoice.amount?.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={invoice.status}
                            size="small"
                            sx={{
                              bgcolor: invoice.status === 'funded' ? '#dcfce7' : '#fef3c7',
                              color: invoice.status === 'funded' ? '#166534' : '#92400e',
                              fontWeight: 500,
                              textTransform: 'capitalize'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small">
                            <Visibility fontSize="small" />
                          </IconButton>
                          <IconButton size="small">
                            <MoreVert fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ 
              p: 3, 
              border: '1px solid #e2e8f0',
              borderRadius: 3,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              mb: 3
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1e293b' }}>
                Quick Actions
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Upload />}
                  onClick={() => setUploadDialog(true)}
                  sx={{
                    borderColor: '#e2e8f0',
                    color: '#64748b',
                    textTransform: 'none',
                    fontWeight: 500,
                    py: 1.5,
                    '&:hover': { borderColor: '#6366f1', color: '#6366f1' }
                  }}
                >
                  Upload Invoice
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Visibility />}
                  sx={{
                    borderColor: '#e2e8f0',
                    color: '#64748b',
                    textTransform: 'none',
                    fontWeight: 500,
                    py: 1.5,
                    '&:hover': { borderColor: '#6366f1', color: '#6366f1' }
                  }}
                >
                  View All Invoices
                </Button>
              </Box>
            </Card>

            <Card sx={{ 
              p: 3, 
              border: '1px solid #e2e8f0',
              borderRadius: 3,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Monthly Target
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                ₹{(stats.totalFunded || 0).toLocaleString()} / ₹500,000
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={((stats.totalFunded || 0) / 500000) * 100}
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': { bgcolor: 'white' }
                }}
              />
            </Card>
          </Grid>
        </Grid>

        {/* Upload Dialog */}
        <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 600 }}>Upload New Invoice</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Invoice Number"
                  value={invoiceForm.invoiceNumber}
                  onChange={(e) => setInvoiceForm({...invoiceForm, invoiceNumber: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={invoiceForm.amount}
                  onChange={(e) => setInvoiceForm({...invoiceForm, amount: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Customer Email"
                  value={invoiceForm.customerEmail}
                  onChange={(e) => setInvoiceForm({...invoiceForm, customerEmail: e.target.value})}
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
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setUploadDialog(false)}>Cancel</Button>
            <Button variant="contained" sx={{ bgcolor: '#6366f1' }}>
              Upload Invoice
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default ModernSellerDashboard;