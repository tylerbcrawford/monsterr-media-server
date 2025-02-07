import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Alert,
  Switch,
  FormControlLabel,
  CircularProgress,
  Collapse,
  InputAdornment,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Check as CheckIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

const defaultPorts = {
  http: 80,
  https: 443,
  npm: 81,
  plex: 32400,
  vpn: 1194,
};

const NetworkConfig = ({ onNext }) => {
  const [config, setConfig] = useState({
    domain: {
      value: '',
      valid: false,
      error: '',
    },
    useSsl: true,
    email: {
      value: '',
      valid: false,
      error: '',
    },
    ports: Object.entries(defaultPorts).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: {
          value: value,
          available: false,
          checking: false,
          error: '',
        },
      }),
      {}
    ),
    useVpn: true,
    vpnProvider: {
      value: '',
      valid: false,
      error: '',
    },
    vpnConfig: {
      value: '',
      valid: false,
      error: '',
    },
  });

  const [checking, setChecking] = useState(false);
  const [canProceed, setCanProceed] = useState(false);

  const validateDomain = async (domain) => {
    try {
      const response = await fetch('/api/setup/validate-domain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
      });

      const data = await response.json();
      return {
        valid: data.valid,
        error: data.error || '',
      };
    } catch (error) {
      return {
        valid: false,
        error: 'Failed to validate domain',
      };
    }
  };

  const checkPort = async (port) => {
    try {
      const response = await fetch('/api/setup/check-port', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ port }),
      });

      const data = await response.json();
      return {
        available: data.available,
        error: data.error || '',
      };
    } catch (error) {
      return {
        available: false,
        error: 'Failed to check port',
      };
    }
  };

  const handleDomainChange = async (event) => {
    const domain = event.target.value;
    setConfig((prev) => ({
      ...prev,
      domain: {
        ...prev.domain,
        value: domain,
        checking: true,
      },
    }));

    const result = await validateDomain(domain);
    setConfig((prev) => ({
      ...prev,
      domain: {
        value: domain,
        valid: result.valid,
        error: result.error,
        checking: false,
      },
    }));
  };

  const handleEmailChange = (event) => {
    const email = event.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setConfig((prev) => ({
      ...prev,
      email: {
        value: email,
        valid: emailRegex.test(email),
        error: emailRegex.test(email) ? '' : 'Invalid email address',
      },
    }));
  };

  const handlePortChange = (portKey) => async (event) => {
    const port = parseInt(event.target.value, 10);
    setConfig((prev) => ({
      ...prev,
      ports: {
        ...prev.ports,
        [portKey]: {
          ...prev.ports[portKey],
          value: port,
          checking: true,
        },
      },
    }));

    const result = await checkPort(port);
    setConfig((prev) => ({
      ...prev,
      ports: {
        ...prev.ports,
        [portKey]: {
          value: port,
          available: result.available,
          error: result.error,
          checking: false,
        },
      },
    }));
  };

  const handleVpnConfigChange = (event) => {
    const config = event.target.value;
    setConfig((prev) => ({
      ...prev,
      vpnConfig: {
        value: config,
        valid: config.includes('BEGIN OpenVPN'),
        error: config.includes('BEGIN OpenVPN')
          ? ''
          : 'Invalid OpenVPN configuration',
      },
    }));
  };

  useEffect(() => {
    const checkAllPorts = async () => {
      setChecking(true);
      try {
        await Promise.all(
          Object.entries(config.ports).map(async ([key, { value }]) => {
            const result = await checkPort(value);
            setConfig((prev) => ({
              ...prev,
              ports: {
                ...prev.ports,
                [key]: {
                  ...prev.ports[key],
                  available: result.available,
                  error: result.error,
                },
              },
            }));
          })
        );
      } finally {
        setChecking(false);
      }
    };

    checkAllPorts();
  }, []);

  useEffect(() => {
    const isValid =
      config.domain.valid &&
      (!config.useSsl || config.email.valid) &&
      Object.values(config.ports).every((port) => port.available) &&
      (!config.useVpn || (config.vpnProvider.valid && config.vpnConfig.valid));

    setCanProceed(isValid);
  }, [config]);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Network Configuration
      </Typography>

      <Typography variant="body1" paragraph>
        Configure network settings for your media server. This includes domain
        setup, SSL configuration, and port mappings.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Domain Configuration
            </Typography>
            <TextField
              fullWidth
              label="Domain Name"
              value={config.domain.value}
              onChange={handleDomainChange}
              error={!!config.domain.error}
              helperText={config.domain.error}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {config.domain.checking ? (
                      <CircularProgress size={20} />
                    ) : config.domain.valid ? (
                      <CheckIcon color="success" />
                    ) : (
                      config.domain.error && <ErrorIcon color="error" />
                    )}
                  </InputAdornment>
                ),
              }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={config.useSsl}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      useSsl: e.target.checked,
                    }))
                  }
                />
              }
              label="Enable SSL/HTTPS"
            />

            <Collapse in={config.useSsl}>
              <TextField
                fullWidth
                label="Email (for SSL certificates)"
                value={config.email.value}
                onChange={handleEmailChange}
                error={!!config.email.error}
                helperText={config.email.error}
                sx={{ mt: 2 }}
              />
            </Collapse>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Port Configuration
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(config.ports).map(([key, port]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <TextField
                    fullWidth
                    label={`${key.toUpperCase()} Port`}
                    type="number"
                    value={port.value}
                    onChange={handlePortChange(key)}
                    error={!!port.error}
                    helperText={port.error}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {port.checking ? (
                            <CircularProgress size={20} />
                          ) : port.available ? (
                            <Tooltip title="Port is available">
                              <CheckIcon color="success" />
                            </Tooltip>
                          ) : (
                            <Tooltip title={port.error || 'Port unavailable'}>
                              <ErrorIcon color="error" />
                            </Tooltip>
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              VPN Configuration
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={config.useVpn}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      useVpn: e.target.checked,
                    }))
                  }
                />
              }
              label="Enable VPN for Downloads"
            />

            <Collapse in={config.useVpn}>
              <TextField
                fullWidth
                label="VPN Provider"
                value={config.vpnProvider.value}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    vpnProvider: {
                      value: e.target.value,
                      valid: !!e.target.value,
                      error: e.target.value ? '' : 'VPN provider is required',
                    },
                  }))
                }
                error={!!config.vpnProvider.error}
                helperText={config.vpnProvider.error}
                sx={{ mt: 2, mb: 2 }}
              />

              <TextField
                fullWidth
                label="OpenVPN Configuration"
                multiline
                rows={4}
                value={config.vpnConfig.value}
                onChange={handleVpnConfigChange}
                error={!!config.vpnConfig.error}
                helperText={config.vpnConfig.error}
              />
            </Collapse>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            variant="outlined"
            sx={{ p: 2, position: { md: 'sticky' }, top: 16 }}
          >
            <Typography variant="h6" gutterBottom>
              Network Requirements
            </Typography>
            <Typography variant="body2" paragraph>
              Ensure your network meets these requirements:
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2">
                • Port forwarding enabled on router
              </Typography>
              <Typography variant="body2">
                • DNS properly configured for domain
              </Typography>
              <Typography variant="body2">
                • Stable internet connection
              </Typography>
              <Typography variant="body2">
                • VPN provider compatible with OpenVPN
              </Typography>
            </Box>

            {checking && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Checking network configuration...
              </Alert>
            )}

            {!canProceed && !checking && (
              <Alert severity="warning">
                Please resolve all configuration issues before proceeding.
              </Alert>
            )}

            {canProceed && !checking && (
              <Alert severity="success">
                Network configuration is valid.
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

NetworkConfig.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default NetworkConfig;