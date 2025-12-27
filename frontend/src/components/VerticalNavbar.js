import React, { useState } from 'react';
import {
  Box, Drawer, List, ListItem, ListItemIcon, ListItemText, 
  Avatar, Typography, Divider, Tooltip, IconButton
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dashboard, Receipt, TrendingUp, AccountBalance, Settings,
  Logout, Person, Notifications, Help, Menu, Close
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DRAWER_WIDTH = 280;
const COLLAPSED_WIDTH = 70;

function VerticalNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: Dashboard, 
      path: '/dashboard',
      color: '#4ade80'
    },
    { 
      text: user?.role === 'seller' ? 'My Invoices' : 'Marketplace', 
      icon: Receipt, 
      path: user?.role === 'seller' ? '/invoices' : '/marketplace',
      color: '#3b82f6'
    },
    { 
      text: user?.role === 'seller' ? 'Analytics' : 'Portfolio', 
      icon: user?.role === 'seller' ? TrendingUp : AccountBalance, 
      path: user?.role === 'seller' ? '/analytics' : '/portfolio',
      color: '#f59e0b'
    },
    { 
      text: 'Profile', 
      icon: Person, 
      path: '/profile',
      color: '#8b5cf6'
    },
    { 
      text: 'Settings', 
      icon: Settings, 
      path: '/settings',
      color: '#6b7280'
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;
  const shouldExpand = isExpanded || isHovered;

  return (
    <>
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: shouldExpand ? DRAWER_WIDTH : COLLAPSED_WIDTH
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100vh',
          zIndex: 1200,
          background: 'linear-gradient(180deg, #1a2332 0%, #0f1419 100%)',
          borderRight: '1px solid rgba(74, 222, 128, 0.2)',
          backdropFilter: 'blur(20px)'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Box sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <Box sx={{ 
            p: 2, 
            display: 'flex', 
            alignItems: 'center',
            minHeight: 80
          }}>
            <IconButton
              onClick={() => setIsExpanded(!isExpanded)}
              sx={{ 
                color: '#4ade80',
                mr: shouldExpand ? 1 : 0
              }}
            >
              {shouldExpand ? <Close /> : <Menu />}
            </IconButton>
            
            <AnimatePresence>
              {shouldExpand && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <Avatar sx={{ 
                    background: 'linear-gradient(135deg, #4ade80 0%, #f59e0b 100%)',
                    mr: 1,
                    width: 32,
                    height: 32
                  }}>
                    {user?.name?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                      ReturnX
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#4ade80' }}>
                      {user?.role?.toUpperCase()}
                    </Typography>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>

          <Divider sx={{ borderColor: 'rgba(74, 222, 128, 0.2)' }} />

          {/* User Info */}
          <Box sx={{ p: 2 }}>
            <AnimatePresence>
              {shouldExpand ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Box sx={{ 
                    background: 'rgba(74, 222, 128, 0.1)',
                    borderRadius: 2,
                    p: 2,
                    border: '1px solid rgba(74, 222, 128, 0.2)'
                  }}>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                      {user?.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#4ade80' }}>
                      {user?.email}
                    </Typography>
                  </Box>
                </motion.div>
              ) : (
                <Tooltip title={user?.name} placement="right">
                  <Avatar sx={{ 
                    background: 'linear-gradient(135deg, #4ade80 0%, #f59e0b 100%)',
                    width: 40,
                    height: 40,
                    mx: 'auto'
                  }}>
                    {user?.name?.charAt(0)}
                  </Avatar>
                </Tooltip>
              )}
            </AnimatePresence>
          </Box>

          <Divider sx={{ borderColor: 'rgba(74, 222, 128, 0.2)' }} />

          {/* Navigation Items */}
          <List sx={{ flex: 1, px: 1, py: 2 }}>
            {menuItems.map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ListItem
                  button
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    background: isActive(item.path) 
                      ? `linear-gradient(135deg, ${item.color}20 0%, ${item.color}10 100%)`
                      : 'transparent',
                    border: isActive(item.path) 
                      ? `1px solid ${item.color}40`
                      : '1px solid transparent',
                    '&:hover': {
                      background: `linear-gradient(135deg, ${item.color}15 0%, ${item.color}05 100%)`,
                      transform: 'translateX(5px)',
                      transition: 'all 0.3s ease'
                    },
                    transition: 'all 0.3s ease',
                    justifyContent: shouldExpand ? 'flex-start' : 'center'
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: isActive(item.path) ? item.color : '#9ca3af',
                    minWidth: shouldExpand ? 40 : 'auto',
                    justifyContent: 'center'
                  }}>
                    {shouldExpand ? (
                      <item.icon />
                    ) : (
                      <Tooltip title={item.text} placement="right">
                        <item.icon />
                      </Tooltip>
                    )}
                  </ListItemIcon>
                  
                  <AnimatePresence>
                    {shouldExpand && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ListItemText 
                          primary={item.text}
                          sx={{ 
                            '& .MuiListItemText-primary': {
                              color: isActive(item.path) ? 'white' : '#d1d5db',
                              fontWeight: isActive(item.path) ? 600 : 400,
                              fontSize: '0.9rem'
                            }
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </ListItem>
              </motion.div>
            ))}
          </List>

          <Divider sx={{ borderColor: 'rgba(74, 222, 128, 0.2)' }} />

          {/* Bottom Actions */}
          <Box sx={{ p: 1 }}>
            <ListItem
              button
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                '&:hover': {
                  background: 'rgba(239, 68, 68, 0.1)',
                  transform: 'translateX(5px)',
                  transition: 'all 0.3s ease'
                },
                transition: 'all 0.3s ease',
                justifyContent: shouldExpand ? 'flex-start' : 'center'
              }}
            >
              <ListItemIcon sx={{ 
                color: '#ef4444',
                minWidth: shouldExpand ? 40 : 'auto',
                justifyContent: 'center'
              }}>
                {shouldExpand ? (
                  <Logout />
                ) : (
                  <Tooltip title="Logout" placement="right">
                    <Logout />
                  </Tooltip>
                )}
              </ListItemIcon>
              
              <AnimatePresence>
                {shouldExpand && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ListItemText 
                      primary="Logout"
                      sx={{ 
                        '& .MuiListItemText-primary': {
                          color: '#ef4444',
                          fontWeight: 500,
                          fontSize: '0.9rem'
                        }
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </ListItem>
          </Box>
        </Box>
      </motion.div>

      {/* Main Content Spacer */}
      <Box sx={{ 
        width: shouldExpand ? DRAWER_WIDTH : COLLAPSED_WIDTH,
        transition: 'width 0.3s ease-in-out',
        flexShrink: 0
      }} />
    </>
  );
}

export default VerticalNavbar;