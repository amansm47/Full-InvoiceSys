import React from 'react';
import { Container, Grid, Paper, Typography, Box, Card, CardContent, Button } from '@mui/material';
import { useQuery } from 'react-query';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

function Dashboard() {
  const { user } = useAuth();
  const { data: dashboardData, isLoading } = useQuery('dashboard', userAPI.getDashboard);

  if (isLoading) return <Typography>Loading...</Typography>;

  const renderSellerDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Invoices</Typography>
            <Typography variant="h4">{dashboardData?.stats?.totalInvoices || 0}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Funded</Typography>
            <Typography variant="h4">{dashboardData?.stats?.funded || 0}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Completed</Typography>
            <Typography variant="h4">{dashboardData?.stats?.completed || 0}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Funded</Typography>
            <Typography variant="h4">₹{(dashboardData?.stats?.totalFunded || 0).toLocaleString()}</Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Recent Invoices</Typography>
          {dashboardData?.invoices?.slice(0, 5).map(invoice => (
            <Box key={invoice._id} sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
              <Typography>Invoice #{invoice.invoiceNumber} - ₹{invoice.amount}</Typography>
              <Typography variant="body2" color="text.secondary">
                Status: {invoice.status} | Buyer: {invoice.buyer?.name}
              </Typography>
            </Box>
          ))}
        </Paper>
      </Grid>
    </Grid>
  );

  const renderInvestorDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Investments</Typography>
            <Typography variant="h4">{dashboardData?.stats?.totalInvestments || 0}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Active</Typography>
            <Typography variant="h4">{dashboardData?.stats?.activeInvestments || 0}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Invested</Typography>
            <Typography variant="h4">₹{(dashboardData?.stats?.totalInvested || 0).toLocaleString()}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Returns</Typography>
            <Typography variant="h4">₹{(dashboardData?.stats?.totalReturns || 0).toLocaleString()}</Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Recent Investments</Typography>
          {dashboardData?.investments?.slice(0, 5).map(investment => (
            <Box key={investment._id} sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
              <Typography>₹{investment.discountedAmount} → ₹{investment.amount}</Typography>
              <Typography variant="body2" color="text.secondary">
                Status: {investment.status} | Seller: {investment.seller?.name}
              </Typography>
            </Box>
          ))}
        </Paper>
      </Grid>
    </Grid>
  );

  const renderBuyerDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Invoices</Typography>
            <Typography variant="h4">{dashboardData?.stats?.totalInvoices || 0}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Pending</Typography>
            <Typography variant="h4">{dashboardData?.stats?.pending || 0}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Funded</Typography>
            <Typography variant="h4">{dashboardData?.stats?.funded || 0}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Amount</Typography>
            <Typography variant="h4">₹{(dashboardData?.stats?.totalAmount || 0).toLocaleString()}</Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Pending Confirmations</Typography>
          {dashboardData?.invoices?.filter(inv => inv.status === 'created').map(invoice => (
            <Box key={invoice._id} sx={{ p: 1, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography>Invoice #{invoice.invoiceNumber} - ₹{invoice.amount}</Typography>
                <Typography variant="body2" color="text.secondary">
                  From: {invoice.seller?.name}
                </Typography>
              </Box>
              <Button variant="contained" size="small">
                Confirm
              </Button>
            </Box>
          ))}
        </Paper>
      </Grid>
    </Grid>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.name}!
      </Typography>
      
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Role: {user?.role} | Wallet: {user?.walletAddress?.slice(0, 10)}...
      </Typography>
      
      {user?.role === 'seller' && renderSellerDashboard()}
      {user?.role === 'investor' && renderInvestorDashboard()}
      {user?.role === 'buyer' && renderBuyerDashboard()}
    </Container>
  );
}

export default Dashboard;