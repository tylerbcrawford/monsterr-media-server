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
} from '@mui/material';
import {
  FolderOpen as FolderIcon,
  Check as CheckIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

const StorageConfig = ({ onNext }) => {
  const [paths, setPaths] = useState({
    mediaRoot: {
      path: '/opt/media-server/media',
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
    configs: {
      path: '/opt/media-server/configs',
      valid: false,
      space: null,
      error: '',
    },
    backups: {
      path: '/opt/media-server/backups',
      valid: false,
      space: null,
      error: '',
    },
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
        Configure storage locations for your media server. Ensure the paths have
        proper permissions and sufficient space.
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
                  {key.replace(/([A-Z])/g, ' $1').trim()}
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
                • Media: 100GB+ (varies with library size)
              </Typography>
              <Typography variant="body2">
                • Downloads: 50GB+
              </Typography>
              <Typography variant="body2">
                • Configs: 1GB
              </Typography>
              <Typography variant="body2">
                • Backups: 10GB+
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
                Storage configuration is valid.
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