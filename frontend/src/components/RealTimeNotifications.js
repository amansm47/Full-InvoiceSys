import React, { useState } from 'react';
import {
  Box, Badge, IconButton, Popover, List, ListItem, ListItemText,
  Typography, Chip, Button, Avatar
} from '@mui/material';
import {
  Notifications, NotificationsActive, Clear, Receipt,
  MonetizationOn, CheckCircle, Update, Close
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const RealTimeNotifications = ({ notifications, onClear, onRemove, isConnected }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_invoice': return <Receipt sx={{ color: '#3b82f6' }} />;
      case 'invoice_funded': return <MonetizationOn sx={{ color: '#10b981' }} />;
      case 'invoice_repaid': return <CheckCircle sx={{ color: '#22c55e' }} />;
      case 'invoice_updated': return <Update sx={{ color: '#f59e0b' }} />;
      default: return <Notifications sx={{ color: '#8b5cf6' }} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'new_invoice': return '#3b82f6';
      case 'invoice_funded': return '#10b981';
      case 'invoice_repaid': return '#22c55e';
      case 'invoice_updated': return '#f59e0b';
      default: return '#8b5cf6';
    }
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          color: 'white',
          position: 'relative',
          '&:hover': {
            bgcolor: 'rgba(139, 92, 246, 0.1)'
          }
        }}
      >
        <Badge 
          badgeContent={notifications.length} 
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              bgcolor: '#ef4444',
              color: 'white',
              fontWeight: 600
            }
          }}
        >
          {isConnected ? (
            <motion.div
              animate={{ scale: notifications.length > 0 ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              <NotificationsActive />
            </motion.div>
          ) : (
            <Notifications sx={{ opacity: 0.5 }} />
          )}
        </Badge>
        
        <Box sx={{
          position: 'absolute',
          bottom: 2,
          right: 2,
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: isConnected ? '#22c55e' : '#ef4444',
          border: '1px solid white',
          boxShadow: isConnected ? '0 0 8px #22c55e' : 'none'
        }} />
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 500,
            bgcolor: '#1a1a2e',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: 2,
            overflow: 'hidden'
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(139, 92, 246, 0.2)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
              Live Updates
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={isConnected ? 'Connected' : 'Disconnected'}
                size="small"
                sx={{
                  bgcolor: isConnected ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: isConnected ? '#22c55e' : '#ef4444',
                  fontWeight: 500,
                  fontSize: '0.75rem'
                }}
              />
              {notifications.length > 0 && (
                <Button
                  size="small"
                  onClick={onClear}
                  sx={{
                    color: '#94a3b8',
                    minWidth: 'auto',
                    p: 0.5,
                    '&:hover': { color: 'white' }
                  }}
                >
                  <Clear fontSize="small" />
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {notifications.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography sx={{ color: '#94a3b8', mb: 1 }}>
                No new notifications
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                {isConnected ? 'You are connected and will receive live updates' : 'Connecting to live updates...'}
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              <AnimatePresence>
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <ListItem
                      sx={{
                        borderBottom: index < notifications.length - 1 ? '1px solid rgba(139, 92, 246, 0.1)' : 'none',
                        '&:hover': {
                          bgcolor: 'rgba(139, 92, 246, 0.05)'
                        },
                        position: 'relative'
                      }}
                    >
                      <Avatar sx={{
                        width: 32,
                        height: 32,
                        mr: 2,
                        bgcolor: `${getNotificationColor(notification.type)}20`,
                        border: `1px solid ${getNotificationColor(notification.type)}40`
                      }}>
                        {getNotificationIcon(notification.type)}
                      </Avatar>
                      
                      <ListItemText
                        primary={
                          <Typography sx={{ 
                            color: 'white', 
                            fontWeight: 500,
                            fontSize: '0.875rem',
                            lineHeight: 1.4
                          }}>
                            {notification.message}
                          </Typography>
                        }
                        secondary={
                          <Typography sx={{ 
                            color: '#94a3b8', 
                            fontSize: '0.75rem',
                            mt: 0.5
                          }}>
                            {new Date(notification.timestamp).toLocaleTimeString()}
                          </Typography>
                        }
                      />
                      
                      <IconButton
                        size="small"
                        onClick={() => onRemove(notification.id)}
                        sx={{
                          color: '#64748b',
                          '&:hover': { color: 'white' }
                        }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </ListItem>
                  </motion.div>
                ))}
              </AnimatePresence>
            </List>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default RealTimeNotifications;