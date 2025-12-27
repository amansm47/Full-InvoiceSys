import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Marketplace', path: '/marketplace' },
    { label: 'Portfolio', path: '/portfolio' },
  ];

  if (user?.role === 'seller') {
    navItems.splice(1, 0, { label: 'Create Invoice', path: '/create-invoice' });
  }

  return (
    <AppBar position="fixed" sx={{ background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(10px)' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>RX</Avatar>
          ReturnX
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mr: 2 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              onClick={() => navigate(item.path)}
              sx={{
                backgroundColor: location.pathname === item.path ? 'rgba(74, 222, 128, 0.2)' : 'transparent',
                border: location.pathname === item.path ? '1px solid #4ade80' : '1px solid transparent',
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2">
            {user?.name} ({user?.role})
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;