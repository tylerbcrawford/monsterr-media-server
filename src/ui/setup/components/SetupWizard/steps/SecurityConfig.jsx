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
  IconButton,
  InputAdornment,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const SecurityConfig = ({ onNext }) => {
  const [config, setConfig] = useState({
    authelia: {
      enabled: true,
      jwt: {
        secret: '',
        valid: false,
        error: '',
      },
      session: {
        secret: '',
        valid: false,
        error: '',
      },
      storage: {
        encryption_key: '',
        valid: false,
        error: '',
      },
      admin: {
        username: '',
        password: '',
        email: '',
        valid: false,
        error: '',
      },
    },
    fail2ban: {
      enabled: true,
      maxRetries: 3,
      findtime: 600,
      bantime: 3600,
      jailPath: '${CONFIG_PATH}/fail2ban/jail.d',
      filterPath: '${CONFIG_PATH}/fail2ban/filter.d',
    },
    nginx: {
      enabled: true,
      sslForced: true,
      port: 81,
      httpPort: 80,
      httpsPort: 443,
    },
    vnc: {
      enabled: false,
      port: 5900,
      password: '',
      fail2banEnabled: true,
      maxRetry: 3,
      findtime: 600,
      bantime: 3600,
    },
  });

  const [showPasswords, setShowPasswords] = useState({
    admin: false,
    jwt: false,
    session: false,
    storage: false,
    vnc: false,
  });

  const [canProceed, setCanProceed] = useState(false);

  const validateAuthelia = () => {
    const { admin, jwt, session, storage } = config.authelia;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const adminValid = 
      admin.username.length >= 4 &&
      admin.password.length >= 8 &&
      emailRegex.test(admin.email);

    const jwtValid = jwt.secret.length >= 32;
    const sessionValid = session.secret.length >= 32;
    const storageValid = storage.encryption_key.length >= 32;

    setConfig((prev) => ({
      ...prev,
      authelia: {
        ...prev.authelia,
        admin: {
          ...prev.authelia.admin,
          valid: adminValid,
          error: adminValid ? '' : 'Invalid admin configuration',
        },
        jwt: {
          ...prev.authelia.jwt,
          valid: jwtValid,
          error: jwtValid ? '' : 'JWT secret must be at least 32 characters',
        },
        session: {
          ...prev.authelia.session,
          valid: sessionValid,
          error: sessionValid ? '' : 'Session secret must be at least 32 characters',
        },
        storage: {
          ...prev.authelia.storage,
          valid: storageValid,
          error: storageValid ? '' : 'Encryption key must be at least 32 characters',
        },
      },
    }));

    return adminValid && jwtValid && sessionValid && storageValid;
  };

  const handleAutheliaChange = (section, field) => (event) => {
    setConfig((prev) => ({
      ...prev,
      authelia: {
        ...prev.authelia,
        [section]: {
          ...prev.authelia[section],
          [field]: event.target.value,
        },
      },
    }));
  };

  const handleFail2banChange = (field) => (event) => {
    const value =
      typeof event.target.value === 'string'
        ? event.target.value
        : event.target.checked;
    setConfig((prev) => ({
      ...prev,
      fail2ban: {
        ...prev.fail2ban,
        [field]: value,
      },
    }));
  };

  const handleNginxChange = (field) => (event) => {
    const value =
      typeof event.target.value === 'string'
        ? event.target.value
        : event.target.checked;
    setConfig((prev) => ({
      ...prev,
      nginx: {
        ...prev.nginx,
        [field]: value,
      },
    }));
  };

  const handleVncChange = (field) => (event) => {
    const value =
      typeof event.target.value === 'string'
        ? event.target.value
        : event.target.checked;
    setConfig((prev) => ({
      ...prev,
      vnc: {
        ...prev.vnc,
        [field]: value,
      },
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const saveConfiguration = async () => {
    try {
      // Save security services configuration
      await fetch('/api/setup/save-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'security-services',
          config: {
            // Authelia Configuration
            AUTHELIA_JWT_SECRET: config.authelia.jwt.secret,
            AUTHELIA_SESSION_SECRET: config.authelia.session.secret,
            AUTHELIA_STORAGE_ENCRYPTION_KEY: config.authelia.storage.encryption_key,
            AUTHELIA_ADMIN_USER: config.authelia.admin.username,
            AUTHELIA_ADMIN_PASSWORD: config.authelia.admin.password,
            AUTHELIA_ADMIN_EMAIL: config.authelia.admin.email,

            // Fail2Ban Configuration
            FAIL2BAN_ENABLED: config.fail2ban.enabled,
            FAIL2BAN_MAXRETRY: config.fail2ban.maxRetries,
            FAIL2BAN_FINDTIME: config.fail2ban.findtime,
            FAIL2BAN_BANTIME: config.fail2ban.bantime,
            FAIL2BAN_JAIL_PATH: config.fail2ban.jailPath,
            FAIL2BAN_FILTER_PATH: config.fail2ban.filterPath,

            // NGINX Configuration
            NPM_PORT: config.nginx.port,
            NPM_HTTP_PORT: config.nginx.httpPort,
            NPM_HTTPS_PORT: config.nginx.httpsPort,
            FORCE_SSL: config.nginx.sslForced,

            // VNC Configuration
            VNC_ENABLED: config.vnc.enabled,
            VNC_PORT: config.vnc.port,
            VNC_PASSWORD: config.vnc.password,
            VNC_FAIL2BAN_ENABLED: config.vnc.fail2banEnabled,
            VNC_FAIL2BAN_MAXRETRY: config.vnc.maxRetry,
            VNC_FAIL2BAN_FINDTIME: config.vnc.findtime,
            VNC_FAIL2BAN_BANTIME: config.vnc.bantime,
          },
        }),
      });

      onNext();
    } catch (error) {
      console.error('Failed to save security configuration:', error);
    }
  };

  useEffect(() => {
    const isValid = validateAuthelia() &&
      (!config.fail2ban.enabled || (
        config.fail2ban.maxRetries > 0 &&
        config.fail2ban.findtime > 0 &&
        config.fail2ban.bantime > 0
      )) &&
      (!config.vnc.enabled || (
        config.vnc.password.length >= 8 &&
        (!config.vnc.fail2banEnabled || (
          config.vnc.maxRetry > 0 &&
          config.vnc.findtime > 0 &&
          config.vnc.bantime > 0
        ))
      ));

    setCanProceed(isValid);
  }, [config]);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Security Configuration
      </Typography>

      <Typography variant="body1" paragraph>
        Configure authentication, intrusion prevention, and access control settings.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Authelia Configuration
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Admin Username"
                  value={config.authelia.admin.username}
                  onChange={handleAutheliaChange('admin', 'username')}
                  error={!config.authelia.admin.valid}
                  helperText="Minimum 4 characters"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Admin Password"
                  type={showPasswords.admin ? 'text' : 'password'}
                  value={config.authelia.admin.password}
                  onChange={handleAutheliaChange('admin', 'password')}
                  error={!config.authelia.admin.valid}
                  helperText="Minimum 8 characters"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('admin')}
                          edge="end"
                        >
                          {showPasswords.admin ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Admin Email"
                  type="email"
                  value={config.authelia.admin.email}
                  onChange={handleAutheliaChange('admin', 'email')}
                  error={!config.authelia.admin.valid}
                  helperText="Required for account recovery"
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Security Keys
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="JWT Secret"
                  type={showPasswords.jwt ? 'text' : 'password'}
                  value={config.authelia.jwt.secret}
                  onChange={handleAutheliaChange('jwt', 'secret')}
                  error={!config.authelia.jwt.valid}
                  helperText="Minimum 32 characters"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('jwt')}
                          edge="end"
                        >
                          {showPasswords.jwt ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Session Secret"
                  type={showPasswords.session ? 'text' : 'password'}
                  value={config.authelia.session.secret}
                  onChange={handleAutheliaChange('session', 'secret')}
                  error={!config.authelia.session.valid}
                  helperText="Minimum 32 characters"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('session')}
                          edge="end"
                        >
                          {showPasswords.session ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Storage Encryption Key"
                  type={showPasswords.storage ? 'text' : 'password'}
                  value={config.authelia.storage.encryption_key}
                  onChange={handleAutheliaChange('storage', 'encryption_key')}
                  error={!config.authelia.storage.valid}
                  helperText="Minimum 32 characters"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('storage')}
                          edge="end"
                        >
                          {showPasswords.storage ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Fail2Ban Configuration
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={config.fail2ban.enabled}
                  onChange={handleFail2banChange('enabled')}
                />
              }
              label="Enable Fail2Ban Protection"
            />
            {config.fail2ban.enabled && (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Max Retries"
                    value={config.fail2ban.maxRetries}
                    onChange={handleFail2banChange('maxRetries')}
                    InputProps={{ inputProps: { min: 1 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Find Time (seconds)"
                    value={config.fail2ban.findtime}
                    onChange={handleFail2banChange('findtime')}
                    InputProps={{ inputProps: { min: 60 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Ban Time (seconds)"
                    value={config.fail2ban.bantime}
                    onChange={handleFail2banChange('bantime')}
                    InputProps={{ inputProps: { min: 60 } }}
                  />
                </Grid>
              </Grid>
            )}
          </Paper>

          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              NGINX Proxy Configuration
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={config.nginx.sslForced}
                      onChange={handleNginxChange('sslForced')}
                    />
                  }
                  label="Force SSL"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Admin Port"
                  value={config.nginx.port}
                  onChange={handleNginxChange('port')}
                  InputProps={{ inputProps: { min: 1, max: 65535 } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="HTTP Port"
                  value={config.nginx.httpPort}
                  onChange={handleNginxChange('httpPort')}
                  InputProps={{ inputProps: { min: 1, max: 65535 } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="HTTPS Port"
                  value={config.nginx.httpsPort}
                  onChange={handleNginxChange('httpsPort')}
                  InputProps={{ inputProps: { min: 1, max: 65535 } }}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              VNC Configuration
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={config.vnc.enabled}
                  onChange={handleVncChange('enabled')}
                />
              }
              label="Enable VNC Access"
            />
            {config.vnc.enabled && (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="VNC Port"
                    value={config.vnc.port}
                    onChange={handleVncChange('port')}
                    InputProps={{ inputProps: { min: 1, max: 65535 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="VNC Password"
                    type={showPasswords.vnc ? 'text' : 'password'}
                    value={config.vnc.password}
                    onChange={handleVncChange('password')}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => togglePasswordVisibility('vnc')}
                            edge="end"
                          >
                            {showPasswords.vnc ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.vnc.fail2banEnabled}
                        onChange={handleVncChange('fail2banEnabled')}
                      />
                    }
                    label="Enable Fail2Ban for VNC"
                  />
                </Grid>
                {config.vnc.fail2banEnabled && (
                  <>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Max Retries"
                        value={config.vnc.maxRetry}
                        onChange={handleVncChange('maxRetry')}
                        InputProps={{ inputProps: { min: 1 } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Find Time (seconds)"
                        value={config.vnc.findtime}
                        onChange={handleVncChange('findtime')}
                        InputProps={{ inputProps: { min: 60 } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Ban Time (seconds)"
                        value={config.vnc.bantime}
                        onChange={handleVncChange('bantime')}
                        InputProps={{ inputProps: { min: 60 } }}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 2, position: { md: 'sticky' }, top: 16 }}>
            <Typography variant="h6" gutterBottom>
              Security Recommendations
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Strong Secrets"
                  secondary="Use long, random strings for JWT and session secrets"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Admin Password"
                  secondary="Use a strong password with mixed case, numbers, and symbols"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Fail2Ban Protection"
                  secondary="Enable to protect against brute force attacks"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="SSL/TLS"
                  secondary="Force SSL to ensure encrypted communications"
                />
              </ListItem>
              {config.vnc.enabled && (
                <ListItem>
                  <ListItemText
                    primary="VNC Security"
                    secondary="Use a strong password and enable Fail2Ban protection"
                  />
                </ListItem>
              )}
            </List>

            {!canProceed && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Please complete all required security configurations.
              </Alert>
            )}

            {canProceed && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Security configuration is valid.
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

SecurityConfig.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default SecurityConfig;