import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Button, Grid, Card, CardContent,
  AppBar, Toolbar, Avatar, IconButton, Paper, Chip
} from '@mui/material';
import {
  TrendingUp, Security, Speed, AccountBalance, Menu,
  PlayArrow, Phone, Email, LocationOn
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function AyursutralHomePage() {
  const navigate = useNavigate();
  const [liveStats, setLiveStats] = useState({
    totalInvoices: 1247,
    totalFunded: 2500000,
    activeInvestors: 89,
    avgROI: 14.2
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        totalInvoices: prev.totalInvoices + Math.floor(Math.random() * 2),
        totalFunded: prev.totalFunded + Math.floor(Math.random() * 25000),
        activeInvestors: prev.activeInvestors + Math.floor(Math.random() * 1),
        avgROI: 14.2 + Math.random() * 0.5
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="static" sx={{ 
        bgcolor: 'white', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <Toolbar sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Avatar sx={{ 
              mr: 2, 
              bgcolor: '#6366f1',
              width: 40,
              height: 40
            }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                R
              </Typography>
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
              ReturnX
            </Typography>
            <Chip 
              label="LIVE" 
              size="small" 
              sx={{ 
                ml: 2, 
                bgcolor: '#ef4444', 
                color: 'white',
                fontWeight: 600
              }} 
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/login')}
              sx={{ 
                borderColor: '#6366f1',
                color: '#6366f1',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2
              }}
            >
              Login
            </Button>
            <Button 
              variant="contained"
              onClick={() => navigate('/register')}
              sx={{ 
                bgcolor: '#6366f1',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                '&:hover': { bgcolor: '#5b5bd6' }
              }}
            >
              Get Started
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 800, 
                color: '#1e293b',
                mb: 3,
                lineHeight: 1.2
              }}
            >
              Transform Your
              <Box component="span" sx={{ color: '#6366f1' }}> Invoice </Box>
              Financing
            </Typography>
            
            <Typography variant="h6" sx={{ color: '#64748b', mb: 4, lineHeight: 1.6 }}>
              Get instant funding for your invoices with blockchain security. 
              Investors earn consistent returns by funding verified invoices.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <Button 
                variant="contained" 
                size="large"
                startIcon={<PlayArrow />}
                onClick={() => navigate('/register')}
                sx={{ 
                  bgcolor: '#6366f1',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  '&:hover': { bgcolor: '#5b5bd6' }
                }}
              >
                Start Investing
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                sx={{ 
                  borderColor: '#e2e8f0',
                  color: '#64748b',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  borderRadius: 2,
                  '&:hover': { borderColor: '#6366f1', color: '#6366f1' }
                }}
              >
                Watch Demo
              </Button>
            </Box>
            
            <Grid container spacing={4}>
              <Grid item xs={4}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#6366f1' }}>
                  ₹{(liveStats.totalFunded / 100000).toFixed(1)}L+
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Funded
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
                  {liveStats.avgROI.toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg ROI
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                  {liveStats.activeInvestors}+
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Users
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 4, 
              bgcolor: 'white',
              borderRadius: 3,
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              border: '1px solid #e2e8f0'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1e293b' }}>
                 Live Market Activity
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Market Volume</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    ₹{liveStats.totalFunded.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ 
                  height: 8, 
                  bgcolor: '#f1f5f9', 
                  borderRadius: 4,
                  overflow: 'hidden'
                }}>
                  <Box sx={{ 
                    height: '100%', 
                    width: '75%', 
                    bgcolor: '#6366f1',
                    borderRadius: 4
                  }} />
                </Box>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f0f9ff', borderRadius: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#6366f1' }}>
                      {liveStats.totalInvoices}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Live Invoices</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f0fdf4', borderRadius: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#10b981' }}>
                      24/7
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Market Open</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>
          Why Choose ReturnX?
        </Typography>
        <Typography variant="h6" align="center" sx={{ color: '#64748b', mb: 6 }}>
          Secure, fast, and transparent invoice financing platform
        </Typography>
        
        <Grid container spacing={4}>
          {[
            { icon: <Security />, title: 'Blockchain Security', desc: 'Military-grade encryption with smart contracts', color: '#6366f1' },
            { icon: <Speed />, title: 'Instant Funding', desc: 'Get funded in minutes, not weeks', color: '#10b981' },
            { icon: <TrendingUp />, title: 'High Returns', desc: 'Earn up to 15% annual returns', color: '#f59e0b' },
            { icon: <AccountBalance />, title: 'Regulated Platform', desc: 'Fully compliant with financial regulations', color: '#ef4444' }
          ].map((feature, index) => (
            <Grid item xs={12} md={3} key={index}>
              <Card sx={{ 
                p: 4,
                height: '100%',
                bgcolor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: 3,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                textAlign: 'center',
                '&:hover': {
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  transform: 'translateY(-4px)'
                },
                transition: 'all 0.3s ease'
              }}>
                <Box sx={{ 
                  width: 60,
                  height: 60,
                  borderRadius: 2,
                  bgcolor: feature.color + '10',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3
                }}>
                  <Box sx={{ color: feature.color, '& svg': { fontSize: 32 } }}>
                    {feature.icon}
                  </Box>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1e293b' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6 }}>
                  {feature.desc}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: 'white', borderTop: '1px solid #e2e8f0', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ mr: 2, bgcolor: '#6366f1' }}>R</Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  ReturnX
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 3, lineHeight: 1.6 }}>
                The future of invoice financing. Secure, fast, and transparent blockchain-powered platform.
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Grid container spacing={4}>
                <Grid item xs={6} md={3}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1e293b' }}>
                    Platform
                  </Typography>
                  {['For Sellers', 'For Buyers', 'For Investors', 'API Docs'].map((item) => (
                    <Typography key={item} variant="body2" sx={{ mb: 1, color: '#64748b', cursor: 'pointer', '&:hover': { color: '#6366f1' } }}>
                      {item}
                    </Typography>
                  ))}
                </Grid>
                
                <Grid item xs={6} md={3}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1e293b' }}>
                    Company
                  </Typography>
                  {['About Us', 'Careers', 'Press', 'Legal'].map((item) => (
                    <Typography key={item} variant="body2" sx={{ mb: 1, color: '#64748b', cursor: 'pointer', '&:hover': { color: '#6366f1' } }}>
                      {item}
                    </Typography>
                  ))}
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1e293b' }}>
                    Contact Us
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Email sx={{ mr: 1, fontSize: 16, color: '#64748b' }} />
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      hello@returnx.finance
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Phone sx={{ mr: 1, fontSize: 16, color: '#64748b' }} />
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      +91 98765 43210
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOn sx={{ mr: 1, fontSize: 16, color: '#64748b' }} />
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      Mumbai, India
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          
          <Box sx={{ borderTop: '1px solid #e2e8f0', mt: 6, pt: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              © 2024 ReturnX. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default AyursutralHomePage;