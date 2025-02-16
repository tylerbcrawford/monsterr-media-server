import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Alert,
  IconButton,
  Tooltip,
  LinearProgress,
  InputAdornment,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  FolderOpen as FolderIcon,
  Check as CheckIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

const StorageConfig = ({ onNext }) => {
  const [paths, setPaths] = useState({
    base: {
      path: '/opt/media-server',
      valid: false,
      space: null,
      error: '',
    },
    media: {
      path: '/opt/media-server/media',
      valid: false,
      space: null,
      error: '',
    },
    config: {
      path: '/opt/media-server/config',
      valid: false,
      space: null,
      error: '',
    },
    downloads: {
      path: '/opt/media-server/downloads',
      valid: false,
      space: null,
      error: '',
    },
    logs: {
      path: '/opt/media-server/logs',
      valid: false,
      space: null,
      error: '',
    },
  });

  const [enabledServices, setEnabledServices] = useState({
    media: true,
    monitoring: false,
    security: false,
  });

  const [checking, setChecking] = useState(false);
  const [canProceed, setCanProceed] = useState(false);

  const validatePath = async (key, path) => {
    try {
      const response = await fetch('/api/setup/validate-path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path }),
      });

      const data = await response.json();

      setPaths((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          path,
          valid: data.valid,
          space: data.space,
          error: data.error || '',
        },
      }));

      // Update dependent paths when base path changes
      if (key === 'base') {
        const newBasePath = path;
        setPaths((prev) => ({
          ...prev,
          media: { ...prev.media, path: `${newBasePath}/media` },
          config: { ...prev.config, path: `${newBasePath}/config` },
          downloads: { ...prev.downloads, path: `${newBasePath}/downloads` },
          logs: { ...prev.logs, path: `${newBasePath}/logs` },
        }));
      }
    } catch (error) {
      setPaths((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          valid: false,
          error: 'Failed to validate path',
        },
      }));
    }
  };

  const handlePathChange = (key) => (event) => {
    const newPath = event.target.value;
    setPaths((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        path: newPath,
        valid: false,
        error: '',
      },
    }));
  };

  const handleServiceToggle = (service) => (event) => {
    setEnabledServices((prev) => ({
      ...prev,
      [service]: event.target.checked,
    }));
  };

  const validateAllPaths = async () => {
    setChecking(true);
    try {
      await Promise.all(
        Object.entries(paths).map(([key, { path }]) =>
          validatePath(key, path)
        )
      );
    } finally {
      setChecking(false);
    }
  };

  const saveConfiguration = async () => {
    try {
      // Save base environment configuration
      await fetch('/api/setup/save-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'base',
          config: {
            BASE_PATH: paths.base.path,
            MEDIA_PATH: paths.media.path,
            CONFIG_PATH: paths.config.path,
            DOWNLOADS_PATH: paths.downloads.path,
            LOGS_PATH: paths.logs.path,
          },
        }),
      });

      // Save service-specific configurations
      if (enabledServices.media) {
        await fetch('/api/setup/save-config', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'media-services',
            enabled: true,
          }),
        });
      }

      if (enabledServices.security) {
        await fetch('/api/setup/save-config', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'security-services',
            enabled: true,
          }),
        });
      }

      if (enabledServices.monitoring) {
        await fetch('/api/setup/save-config', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'monitoring-services',
            enabled: true,
          }),
        });
      }

      onNext();
    } catch (error) {
      console.error('Failed to save configuration:', error);
    }
  };

  useEffect(() => {
    validateAllPaths();
  }, []);

  useEffect(() => {
    const allValid = Object.values(paths).every((p) => p.valid);
    setCanProceed(allValid);
  }, [paths]);

  const formatSpace = (bytes) => {
    if (!bytes) return 'Unknown';
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(1)} GB`;
  };

  const getPathStatus = (pathInfo) => {
    if (pathInfo.valid) {
      return (
        <Tooltip title="Path is valid">
          <CheckIcon color="success" />
        </Tooltip>
      );
    }
    if (pathInfo.error) {
      return (
        <Tooltip title={pathInfo.error}>
          <ErrorIcon color="error" />
        </Tooltip>
      );
    }
    return null;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Storage Configuration
      </Typography>

      <Typography variant="body1" paragraph>
        Configure storage locations and enable required services. All paths will be created
        if they don't exist.
      </Typography>

      {checking && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress />
        </Box>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            {Object.entries(paths).map(([key, pathInfo]) => (
              <Box key={key} sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, textTransform: 'capitalize' }}
                >
                  {key.replace(/([A-Z])/g, ' $1').trim()} Path
                </Typography>
                <TextField
                  fullWidth
                  value={pathInfo.path}
                  onChange={handlePathChange(key)}
                  error={!!pathInfo.error}
                  helperText={pathInfo.error}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => validatePath(key, pathInfo.path)}
                        >
                          <FolderIcon />
                        </IconButton>
                        {getPathStatus(pathInfo)}
                      </InputAdornment>
                    ),
                  }}
                />
                {pathInfo.space && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.5, display: 'block' }}
                  >
                    Available Space: {formatSpace(pathInfo.space)}
                  </Typography>
                )}
              </Box>
            ))}

            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle1" gutterBottom>
                Enable Services
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={enabledServices.media}
                    onChange={handleServiceToggle('media')}
                  />
                }
                label="Media Services (Plex, Sonarr, Radarr)"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={enabledServices.security}
                    onChange={handleServiceToggle('security')}
                  />
                }
                label="Security Services (Authelia, Fail2Ban)"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={enabledServices.monitoring}
                    onChange={handleServiceToggle('monitoring')}
                  />
                }
                label="Monitoring Services (Prometheus, Grafana)"
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Storage Requirements
            </Typography>
            <Typography variant="body2" paragraph>
              Recommended minimum space:
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2">
                • Base: 1GB (system files)
              </Typography>
              <Typography variant="body2">
                • Media: 100GB+ (varies with library size)
              </Typography>
              <Typography variant="body2">
                • Config: 1GB (service configurations)
              </Typography>
              <Typography variant="body2">
                • Downloads: 50GB+ (temporary storage)
              </Typography>
              <Typography variant="body2">
                • Logs: 5GB (system and service logs)
              </Typography>
            </Box>

            {!canProceed && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Please ensure all paths are valid and have sufficient
                permissions.
              </Alert>
            )}

            {canProceed && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Storage configuration is valid. Click Next to continue.
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

StorageConfig.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default StorageConfig;