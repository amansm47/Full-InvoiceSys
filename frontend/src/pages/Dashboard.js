import React from 'react';
import { useAuth } from '../context/AuthContext';
import SellerDashboard from './SellerDashboard';
import InvestorDashboard from './InvestorDashboard';
import { Container, Typography, Box, Card, CardContent, Button, Grid } from '@mui/material';

function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Loading user data...</Typography>
      </Container>
    );
  }

  // Use enhanced dashboards for seller and investor
  if (user?.role === 'seller' || user?.role === 'patient') {
    return <SellerDashboard />;
  }
  
  if (user?.role === 'investor') {
    return <InvestorDashboard />;
  }

  // Simple buyer dashboard
  const renderBuyerDashboard = () => (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.fullName || user?.email}!
      </Typography>
      
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Role: {user?.role} | KYC Status: {user?.kycStatus || 'Pending'}
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Invoices</Typography>
              <Typography variant="h4">0</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Pending</Typography>
              <Typography variant="h4">0</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Confirmed</Typography>
              <Typography variant="h4">0</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Amount</Typography>
              <Typography variant="h4">₹0</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Quick Actions</Typography>
            <Button variant="contained" sx={{ mr: 2, mb: 2 }}>Pending Confirmations</Button>
            <Button variant="outlined" sx={{ mr: 2, mb: 2 }}>Payment History</Button>
            <Button variant="outlined" sx={{ mb: 2 }}>Complete KYC</Button>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );

  return renderBuyerDashboard();
}

export default Dashboard;