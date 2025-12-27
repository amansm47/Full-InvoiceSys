import React from 'react';
import { Container, Grid, Paper, Typography, Box, Card, CardContent } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useQuery } from 'react-query';
import { userAPI } from '../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function Portfolio() {
  const { data: portfolio, isLoading } = useQuery('portfolio', userAPI.getPortfolio);

  if (isLoading) return <Typography>Loading portfolio...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Investment Portfolio
      </Typography>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Invested</Typography>
              <Typography variant="h4">₹{portfolio?.totalInvested?.toLocaleString() || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Expected Returns</Typography>
              <Typography variant="h4">₹{portfolio?.expectedReturns?.toLocaleString() || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Actual Returns</Typography>
              <Typography variant="h4">₹{portfolio?.actualReturns?.toLocaleString() || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">ROI</Typography>
              <Typography variant="h4">
                {portfolio?.totalInvested ? 
                  ((portfolio.actualReturns / portfolio.totalInvested) * 100).toFixed(1) + '%' : 
                  '0%'
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Returns Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Returns
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={portfolio?.monthlyReturns || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, 'Returns']} />
                <Line type="monotone" dataKey="returns" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Risk Distribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
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
                  {[0, 1, 2].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Diversification */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Sector Diversification
            </Typography>
            <Grid container spacing={2}>
              {portfolio?.diversification?.map((sector, index) => (
                <Grid item xs={12} sm={6} md={3} key={sector.sector}>
                  <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="h4" color={COLORS[index % COLORS.length]}>
                      {sector.count}
                    </Typography>
                    <Typography variant="body2">
                      {sector.sector}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Investment Tips */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
            <Typography variant="h6" gutterBottom>
              Investment Tips
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom>
                  🎯 Diversification
                </Typography>
                <Typography variant="body2">
                  Spread investments across different sectors and risk levels to minimize risk.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom>
                  ⏰ Tenure Management
                </Typography>
                <Typography variant="body2">
                  Balance short-term and long-term investments for steady cash flow.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom>
                  📊 Risk Assessment
                </Typography>
                <Typography variant="body2">
                  Monitor buyer payment history and seller credibility before investing.
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Portfolio;