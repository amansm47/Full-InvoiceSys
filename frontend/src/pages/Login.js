import React, { useState } from 'react';
import { 
  Container, Paper, TextField, Button, Typography, Box, 
  Alert, CircularProgress, Divider, IconButton, InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { keyframes } from '@emotion/react';

const slideIn = keyframes`
  from { transform: translateX(-100px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
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
      <Container maxWidth="sm">
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
              Welcome Back
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              sx={{ mb: 3 }}
            />
            
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              sx={{ mb: 4 }}
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

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ 
                mb: 3,
                py: 1.5,
                background: 'linear-gradient(135deg, #4ade80 0%, #f59e0b 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #22c55e 0%, #eab308 100%)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </form>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              Don't have an account?
            </Typography>
          </Divider>

          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate('/register')}
            sx={{ 
              borderColor: '#4ade80',
              color: '#4ade80',
              '&:hover': {
                background: 'rgba(74, 222, 128, 0.1)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Create Account
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;