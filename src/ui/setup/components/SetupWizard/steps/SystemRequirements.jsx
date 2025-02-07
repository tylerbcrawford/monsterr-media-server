import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

const SystemRequirements = ({ onNext, isFirstStep }) => {
  const [loading, setLoading] = useState(true);
  const [requirements, setRequirements] = useState([]);
  const [canProceed, setCanProceed] = useState(false);

  const checkRequirements = async () => {
    try {
      const response = await fetch('/api/setup/system-check');
      const data = await response.json();

      const requirementsList = [
        {
          name: 'CPU Cores',
          value: `${data.cpu.cores} cores`,
          required: '4 cores',
          status: data.cpu.cores >= 4 ? 'success' : 'error',
          details: data.cpu.cores < 4 ? 'Minimum 4 CPU cores required' : '',
        },
        {
          name: 'Memory',
          value: `${data.memory.total}GB`,
          required: '8GB',
          status: data.memory.total >= 8 ? 'success' : 'warning',
          details:
            data.memory.total < 8
              ? 'Recommended minimum is 8GB RAM'
              : '',
        },
        {
          name: 'Storage',
          value: `${data.storage.available}GB free`,
          required: '20GB',
          status: data.storage.available >= 20 ? 'success' : 'error',
          details:
            data.storage.available < 20
              ? 'Minimum 20GB free space required'
              : '',
        },
        {
          name: 'Docker',
          value: data.docker.version || 'Not installed',
          required: 'Installed',
          status: data.docker.installed ? 'success' : 'error',
          details: !data.docker.installed
            ? 'Docker is required but not installed'
            : '',
        },
        {
          name: 'Docker Compose',
          value: data.dockerCompose.version || 'Not installed',
          required: 'Installed',
          status: data.dockerCompose.installed ? 'success' : 'error',
          details: !data.dockerCompose.installed
            ? 'Docker Compose is required but not installed'
            : '',
        },
        {
          name: 'Network Ports',
          value: data.network.portsAvailable ? 'Available' : 'In use',
          required: '80, 443 available',
          status: data.network.portsAvailable ? 'success' : 'warning',
          details: !data.network.portsAvailable
            ? 'Required ports are currently in use'
            : '',
        },
      ];

      setRequirements(requirementsList);
      setCanProceed(
        requirementsList.every((req) => req.status !== 'error')
      );
    } catch (error) {
      console.error('Failed to check system requirements:', error);
      setRequirements([
        {
          name: 'System Check',
          value: 'Failed',
          required: 'Success',
          status: 'error',
          details: 'Failed to perform system requirements check',
        },
      ]);
      setCanProceed(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkRequirements();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckIcon color="success" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'error':
        return <ErrorIcon color="error" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          py: 4,
        }}
      >
        <CircularProgress />
        <Typography>Checking system requirements...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        System Requirements Check
      </Typography>
      
      <Typography variant="body1" paragraph>
        We'll verify that your system meets the minimum requirements for running
        Monsterr Media Server.
      </Typography>

      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <List>
          {requirements.map((req) => (
            <ListItem key={req.name}>
              <ListItemIcon>{getStatusIcon(req.status)}</ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Typography component="span" fontWeight="bold">
                      {req.name}:
                    </Typography>
                    <Typography component="span">{req.value}</Typography>
                    <Typography
                      component="span"
                      color="text.secondary"
                      sx={{ ml: 'auto' }}
                    >
                      Required: {req.required}
                    </Typography>
                  </Box>
                }
                secondary={req.details}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {!canProceed && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Please resolve the above issues before proceeding with the installation.
        </Alert>
      )}

      {canProceed && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Your system meets the minimum requirements. You can proceed with the
          installation.
        </Alert>
      )}
    </Box>
  );
};

SystemRequirements.propTypes = {
  onNext: PropTypes.func.isRequired,
  isFirstStep: PropTypes.bool.isRequired,
};

export default SystemRequirements;