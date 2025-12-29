import React from 'react';
import { IconButton, Badge, Tooltip } from '@mui/material';
import { Notifications } from '@mui/icons-material';

const RealTimeNotifications = ({ notifications = [], onClear, onRemove, isConnected }) => {
  return (
    <Tooltip title={isConnected ? 'Real-time updates active' : 'Offline'}>
      <IconButton sx={{ color: isConnected ? '#22c55e' : '#ef4444' }}>
        <Badge badgeContent={notifications.length} color="error">
          <Notifications />
        </Badge>
      </IconButton>
    </Tooltip>
  );
};

export default RealTimeNotifications;
