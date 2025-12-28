import React, { useState } from 'react';
import { 
  Container, Paper, TextField, Button, Typography, Box, 
  Alert, CircularProgress, Divider, IconButton, InputAdornment,
  FormControl, InputLabel, Select, MenuItem, Grid, Card, CardContent
} from '@mui/material';
import { Visibility, VisibilityOff, ArrowBack, Person, Business, TrendingUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { keyframes } from '@emotion/react';

const slideIn = keyframes`
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    company: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const roles = [
    { 
      value: 'seller', 
      label: 'Seller (MSME)', 
      icon: <Business />, 
      desc: 'Get instant funding for your invoices',
      color: '#4ade80'
    },
    { 
      value: 'buyer', 
      label: 'Buyer (Corporate)', 
      icon: <Person />, 
      desc: 'Verify and manage invoice payments',
      color: '#f59e0b'
    },
    { 
      value: 'investor', 
      label: 'Investor', 
      icon: <TrendingUp />, 
      desc: 'Earn returns by funding invoices',
      color: '#3b82f6'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email || 
          !formData.phone || !formData.company || !formData.role || !formData.password) {
        throw new Error('Please fill in all required fields');
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }
      
      // Validate password length
      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      const registrationData = {
        email: formData.email,
        password: formData.password,
        role: formData.role,
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          company: formData.company
        }
      };
      
      console.log('Sending registration data:', registrationData);
      await register(registrationData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle specific error cases
      let errorMessage = 'Registration failed';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
        
        // Make error messages more user-friendly
        if (errorMessage === 'User already exists') {
          errorMessage = 'An account with this email already exists. Please use a different email or try logging in.';
        } else if (errorMessage.includes('Missing required fields')) {
          errorMessage = 'Please fill in all required fields.';
        } else if (errorMessage.includes('Missing profile fields')) {
          errorMessage = 'Please complete all profile information.';
        }
      } else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        errorMessage = 'Cannot connect to server. Please make sure the backend is running.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #2d3748 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2
    }}>
      <Container maxWidth="md">
        <Paper sx={{ 
          p: 6,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(74, 222, 128, 0.2)',
          borderRadius: 4,
          animation: `${slideIn} 0.6s ease-out`
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <IconButton 
              onClick={() => navigate('/')}
              sx={{ mr: 2, color: '#4ade80' }}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #4ade80 0%, #f59e0b 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Join ReturnX
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  helperText="Use a unique email address that you haven't registered with before"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: '#4ade80' }}>
                  Choose Your Role
                </Typography>
                <Grid container spacing={2}>
                  {roles.map((role) => (
                    <Grid item xs={12} md={4} key={role.value}>
                      <Card 
                        sx={{ 
                          cursor: 'pointer',
                          background: formData.role === role.value 
                            ? `rgba(${role.color === '#4ade80' ? '74, 222, 128' : role.color === '#f59e0b' ? '245, 158, 11' : '59, 130, 246'}, 0.2)`
                            : 'rgba(255, 255, 255, 0.05)',
                          border: formData.role === role.value 
                            ? `2px solid ${role.color}`
                            : '1px solid rgba(255, 255, 255, 0.1)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: `0 10px 30px ${role.color}30`
                          }
                        }}
                        onClick={() => setFormData({ ...formData, role: role.value })}
                      >
                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                          <Box sx={{ color: role.color, mb: 2 }}>
                            {role.icon}
                          </Box>
                          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                            {role.label}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            {role.desc}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || !formData.role}
              sx={{ 
                mt: 4,
                mb: 3,
                py: 1.5,
                background: 'linear-gradient(135deg, #4ade80 0%, #f59e0b 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #22c55e 0%, #eab308 100%)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Account'}
            </Button>
          </form>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              Already have an account?
            </Typography>
          </Divider>

          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate('/login')}
            sx={{ 
              borderColor: '#4ade80',
              color: '#4ade80',
              '&:hover': {
                background: 'rgba(74, 222, 128, 0.1)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Sign In
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}

export default Register;