import React, { useState } from 'react';
import {
  Box, Container, Paper, Typography, TextField, Button,
  Avatar, Divider, Link, Alert, InputAdornment, IconButton,
  Grid, Card, Stack, FormControl, InputLabel, Select, MenuItem,
  Stepper, Step, StepLabel, Chip
} from '@mui/material';
import {
  Email, Lock, Visibility, VisibilityOff, ArrowBack, Person,
  Business, Phone, LocationOn, CheckCircle, AccountBalance,
  TrendingUp, Security
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

function EnhancedRegister() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    phone: '',
    company: '',
    address: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const steps = ['Choose Role', 'Basic Info', 'Complete Profile'];

  const handleNext = () => {
    if (activeStep === 0 && !formData.role) {
      setError('Please select your role');
      return;
    }
    if (activeStep === 1) {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill all required fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }
    setError('');
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      value: 'seller',
      title: 'Seller (MSME)',
      description: 'Upload invoices and get instant funding',
      icon: <Business />,
      color: '#2563eb',
      benefits: ['Instant cash flow', 'No collateral required', 'Quick approval']
    },
    {
      value: 'investor',
      title: 'Investor',
      description: 'Invest in verified invoices and earn returns',
      icon: <TrendingUp />,
      color: '#10b981',
      benefits: ['High returns', 'Low risk', 'Diversified portfolio']
    },
    {
      value: 'buyer',
      title: 'Buyer (Corporate)',
      description: 'Verify invoices and manage payments',
      icon: <AccountBalance />,
      color: '#f59e0b',
      benefits: ['Streamlined process', 'Transparent system', 'Easy verification']
    }
  ];

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1e293b', textAlign: 'center' }}>
              Choose Your Role
            </Typography>
            <Grid container spacing={3}>
              {roles.map((role) => (
                <Grid item xs={12} key={role.value}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      sx={{ 
                        p: 3,
                        cursor: 'pointer',
                        border: formData.role === role.value ? `2px solid ${role.color}` : '2px solid transparent',
                        bgcolor: formData.role === role.value ? `${role.color}10` : 'white',
                        '&:hover': {
                          boxShadow: `0 8px 25px ${role.color}20`
                        },
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => setFormData({...formData, role: role.value})}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ 
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: `${role.color}20`,
                          color: role.color,
                          mr: 2
                        }}>
                          {role.icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                            {role.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#64748b' }}>
                            {role.description}
                          </Typography>
                        </Box>
                        {formData.role === role.value && (
                          <CheckCircle sx={{ color: role.color }} />
                        )}
                      </Box>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {role.benefits.map((benefit, index) => (
                          <Chip 
                            key={index}
                            label={benefit}
                            size="small"
                            sx={{
                              bgcolor: `${role.color}15`,
                              color: role.color,
                              fontWeight: 500
                            }}
                          />
                        ))}
                      </Stack>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1e293b', textAlign: 'center' }}>
              Basic Information
            </Typography>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: '#64748b' }} />
                    </InputAdornment>
                  ),
                }}
              />

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
              />

              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#64748b' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1e293b', textAlign: 'center' }}>
              Complete Your Profile
            </Typography>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone sx={{ color: '#64748b' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Company Name"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Business sx={{ color: '#64748b' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Address"
                multiline
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                      <LocationOn sx={{ color: '#64748b' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      py: 4
    }}>
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Paper sx={{ 
            p: 4, 
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/')}
                sx={{ 
                  color: '#64748b',
                  mb: 3,
                  '&:hover': { color: '#2563eb' }
                }}
              >
                Back to Home
              </Button>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ 
                  mr: 2, 
                  background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)',
                  width: 40,
                  height: 40,
                  fontWeight: 'bold'
                }}>
                  IF
                </Avatar>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  Join InvoiceFinance
                </Typography>
              </Box>

              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Step Content */}
            <Box sx={{ mb: 4 }}>
              {renderStepContent(activeStep)}
            </Box>

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
                sx={{ color: '#64748b' }}
              >
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Next
                </Button>
              )}
            </Box>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                OR
              </Typography>
            </Divider>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Already have an account?{' '}
                <Link 
                  onClick={() => navigate('/login')}
                  sx={{ 
                    color: '#2563eb',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    fontWeight: 600,
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}

export default EnhancedRegister;