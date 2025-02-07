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
    adminUser: {
      username: '',
      password: '',
      email: '',
      valid: false,
      error: '',
    },
    twoFactor: {
      enabled: true,
      method: 'totp',
    },
    fail2ban: {
      enabled: true,
      maxRetries: 5,
      findtime: 600,
      bantime: 3600,
    },
    firewall: {
      enabled: true,
      allowedIps: [],
      customRules: [],
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [users, setUsers] = useState([]);
  const [userDialog, setUserDialog] = useState({
    open: false,
    username: '',
    password: '',
    email: '',
    role: 'user',
  });

  const [canProceed, setCanProceed] = useState(false);

  const validateAdminUser = () => {
    const { username, password, email } = config.adminUser;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid =
      username.length >= 4 &&
      password.length >= 8 &&
      emailRegex.test(email);

    setConfig((prev) => ({
      ...prev,
      adminUser: {
        ...prev.adminUser,
        valid: isValid,
        error: isValid ? '' : 'Please fill all required fields correctly',
      },
    }));

    return isValid;
  };

  const handleAdminUserChange = (field) => (event) => {
    setConfig((prev) => ({
      ...prev,
      adminUser: {
        ...prev.adminUser,
        [field]: event.target.value,
      },
    }));
  };

  const handleAddUser = () => {
    const { username, password, email, role } = userDialog;
    if (username && password && email) {
      setUsers([...users, { username, email, role }]);
      setUserDialog({
        open: false,
        username: '',
        password: '',
        email: '',
        role: 'user',
      });
    }
  };

  const handleRemoveUser = (username) => {
    setUsers(users.filter((user) => user.username !== username));
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

  const handleFirewallIpAdd = (ip) => {
    if (ip && /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/.test(ip)) {
      setConfig((prev) => ({
        ...prev,
        firewall: {
          ...prev.firewall,
          allowedIps: [...prev.firewall.allowedIps, ip],
        },
      }));
    }
  };

  useEffect(() => {
    const isValid =
      config.adminUser.valid &&
      (config.twoFactor.enabled ? !!config.twoFactor.method : true) &&
      (config.fail2ban.enabled
        ? config.fail2ban.maxRetries > 0 &&
          config.fail2ban.findtime > 0 &&
          config.fail2ban.bantime > 0
        : true);

    setCanProceed(isValid);
  }, [config]);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Security Configuration
      </Typography>

      <Typography variant="body1" paragraph>
        Configure security settings including authentication, intrusion
        prevention, and access control.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Administrator Account
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  value={config.adminUser.username}
                  onChange={handleAdminUserChange('username')}
                  error={!config.adminUser.valid && !config.adminUser.username}
                  helperText="Minimum 4 characters"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={config.adminUser.password}
                  onChange={handleAdminUserChange('password')}
                  error={!config.adminUser.valid && !config.adminUser.password}
                  helperText="Minimum 8 characters"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? (
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
                  label="Email"
                  type="email"
                  value={config.adminUser.email}
                  onChange={handleAdminUserChange('email')}
                  error={!config.adminUser.valid && !config.adminUser.email}
                  helperText="Required for account recovery"
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Two-Factor Authentication
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={config.twoFactor.enabled}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      twoFactor: {
                        ...prev.twoFactor,
                        enabled: e.target.checked,
                      },
                    }))
                  }
                />
              }
              label="Enable Two-Factor Authentication"
            />
            {config.twoFactor.enabled && (
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>2FA Method</InputLabel>
                <Select
                  value={config.twoFactor.method}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      twoFactor: {
                        ...prev.twoFactor,
                        method: e.target.value,
                      },
                    }))
                  }
                  label="2FA Method"
                >
                  <MenuItem value="totp">
                    Time-based One-Time Password (TOTP)
                  </MenuItem>
                  <MenuItem value="webauthn">WebAuthn (Security Key)</MenuItem>
                </Select>
              </FormControl>
            )}
          </Paper>

          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Intrusion Prevention (Fail2Ban)
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

          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Firewall Configuration
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={config.firewall.enabled}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      firewall: {
                        ...prev.firewall,
                        enabled: e.target.checked,
                      },
                    }))
                  }
                />
              }
              label="Enable Firewall"
            />
            {config.firewall.enabled && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Allowed IP Addresses
                </Typography>
                <List>
                  {config.firewall.allowedIps.map((ip) => (
                    <ListItem key={ip}>
                      <ListItemText primary={ip} />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() =>
                            setConfig((prev) => ({
                              ...prev,
                              firewall: {
                                ...prev.firewall,
                                allowedIps: prev.firewall.allowedIps.filter(
                                  (i) => i !== ip
                                ),
                              },
                            }))
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
                <TextField
                  fullWidth
                  label="Add IP Address (CIDR format)"
                  placeholder="e.g., 192.168.1.0/24"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleFirewallIpAdd(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            variant="outlined"
            sx={{ p: 2, position: { md: 'sticky' }, top: 16 }}
          >
            <Typography variant="h6" gutterBottom>
              Security Recommendations
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Strong Passwords"
                  secondary="Use complex passwords with mixed case, numbers, and symbols"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Two-Factor Authentication"
                  secondary="Enable 2FA for additional security"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Fail2Ban Protection"
                  secondary="Protect against brute force attacks"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Firewall Rules"
                  secondary="Restrict access to trusted IP addresses"
                />
              </ListItem>
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

      <Dialog
        open={userDialog.open}
        onClose={() => setUserDialog({ ...userDialog, open: false })}
      >
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Username"
            value={userDialog.username}
            onChange={(e) =>
              setUserDialog({ ...userDialog, username: e.target.value })
            }
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={userDialog.password}
            onChange={(e) =>
              setUserDialog({ ...userDialog, password: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={userDialog.email}
            onChange={(e) =>
              setUserDialog({ ...userDialog, email: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={userDialog.role}
              onChange={(e) =>
                setUserDialog({ ...userDialog, role: e.target.value })
              }
              label="Role"
            >
              <MenuItem value="admin">Administrator</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setUserDialog({ ...userDialog, open: false })}
          >
            Cancel
          </Button>
          <Button onClick={handleAddUser} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

SecurityConfig.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default SecurityConfig;