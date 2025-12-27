import React, { useState } from 'react';
import {
  Box, Container, Paper, Typography, TextField, Button,
  Avatar, Divider, Link, Alert, InputAdornment, IconButton,
  Grid, Card, Stack
} from '@mui/material';
import {
  Email, Lock, Visibility, VisibilityOff, ArrowBack,
  BusinessCenter, TrendingUp, Security, Speed
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

function EnhancedLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await login(formData.email, formData.password);
      console.log('Login successful, navigating to dashboard');
      // Use window.location for reliable navigation
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <Security />, title: 'Secure Platform', desc: 'Bank-level security' },
    { icon: <Speed />, title: 'Fast Processing', desc: 'Instant transactions' },
    { icon: <TrendingUp />, title: 'High Returns', desc: 'Up to 15% ROI' },
    { icon: <BusinessCenter />, title: 'Professional', desc: 'Enterprise grade' }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      display: 'flex',
      alignItems: 'center',
      py: 4
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Left Side - Features */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Box sx={{ pr: { md: 4 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                  <Avatar sx={{ 
                    mr: 2, 
                    background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
                    width: 50,
                    height: 50,
                    fontWeight: 'bold'
                  }}>
                    IF
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
                    InvoiceFinance
                  </Typography>
                </Box>

                <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#1e293b' }}>
                  Welcome Back!
                </Typography>
                <Typography variant="h6" sx={{ color: '#64748b', mb: 4, fontWeight: 400 }}>
                  Sign in to access your dashboard and manage your investments or invoices.
                </Typography>

                <Grid container spacing={3}>
                  {features.map((feature, index) => (
                    <Grid item xs={6} key={index}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                      >
                        <Card sx={{ 
                          p: 2, 
                          textAlign: 'center',
                          border: '1px solid #e2e8f0',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }
                        }}>
                          <Box sx={{ 
                            color: '#2563eb', 
                            mb: 1,
                            '& svg': { fontSize: 32 }
                          }}>
                            {feature.icon}
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#1e293b' }}>
                            {feature.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>
                            {feature.desc}
                          </Typography>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </motion.div>
          </Grid>

          {/* Right Side - Login Form */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Paper sx={{ 
                p: 4, 
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0'
              }}>
                <Box sx={{ mb: 3 }}>
                  <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/')}
                    sx={{ 
                      color: '#64748b',
                      mb: 2,
                      '&:hover': { color: '#2563eb' }
                    }}
                  >
                    Back to Home
                  </Button>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>
                    Sign In
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#64748b' }}>
                    Enter your credentials to access your account
                  </Typography>
                </Box>

                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: '#64748b' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: '#64748b' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Link 
                        href="#" 
                        sx={{ 
                          color: '#2563eb',
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                      >
                        Forgot Password?
                      </Link>
                    </Box>

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '1rem'
                      }}
                    >
                      {loading ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </Stack>
                </form>

                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    OR
                  </Typography>
                </Divider>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Don't have an account?{' '}
                    <Link 
                      onClick={() => navigate('/register')}
                      sx={{ 
                        color: '#2563eb',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        fontWeight: 600,
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      Sign Up
                    </Link>
                  </Typography>
                </Box>

                <Box sx={{ mt: 3, p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', textAlign: 'center', display: 'block' }}>
                    Demo Credentials: investor@demo.com / seller@demo.com | Password: demo123
                  </Typography>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default EnhancedLogin;