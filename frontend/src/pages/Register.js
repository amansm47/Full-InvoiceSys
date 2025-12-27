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
    name: '',
    email: '',
    phone: '',
    role: '',
    businessName: '',
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
      await register(formData);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
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
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  label="Business Name"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
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