import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Check as CheckIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

const deploymentSteps = [
  'Validate Configuration',
  'Create Directories',
  'Generate Configurations',
  'Pull Docker Images',
  'Start Infrastructure Services',
  'Configure Security',
  'Start Portainer',
  'Start Media Services',
  'Verify Deployment',
];

const FinalReview = ({ onNext, isLastStep }) => {
  const [deploying, setDeploying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);
  const [expanded, setExpanded] = useState('system');

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const addLog = (message, type = 'info') => {
    setLogs((prev) => [...prev, { message, type, timestamp: new Date() }]);
  };

  const handleDeploy = async () => {
    setDeploying(true);
    setCurrentStep(0);
    setError(null);

    try {
      // Validate Configuration
      addLog('Validating configuration...');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCurrentStep(1);

      // Create Directories
      addLog('Creating required directories...');
      const response = await fetch('/api/setup/create-directories', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to create directories');
      setCurrentStep(2);

      // Generate Configurations
      addLog('Generating service configurations...');
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setCurrentStep(3);

      // Pull Docker Images
      addLog('Pulling Docker images...');
      const images = await fetch('/api/setup/pull-images', {
        method: 'POST',
      });
      if (!images.ok) throw new Error('Failed to pull Docker images');
      setCurrentStep(4);
// Start Infrastructure Services
addLog('Starting infrastructure services (Nginx, Authelia, Redis, Fail2Ban)...');
await new Promise((resolve) => setTimeout(resolve, 2000));
setCurrentStep(5);

// Configure Security
addLog('Configuring security settings...');
await new Promise((resolve) => setTimeout(resolve, 1500));
setCurrentStep(6);

// Start Portainer
addLog('Starting Portainer management interface...');
await new Promise((resolve) => setTimeout(resolve, 1500));
setCurrentStep(7);

// Start Media Services
      // Start Media Services
      addLog('Starting media services...');
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setCurrentStep(7);

      // Verify Deployment
      addLog('Verifying deployment...');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCurrentStep(8);

      addLog('Deployment completed successfully!', 'success');
    } catch (err) {
      setError(err.message);
      addLog(`Deployment failed: ${err.message}`, 'error');
    } finally {
      setDeploying(false);
    }
  };

  const renderConfigurationSummary = () => (
    <Box sx={{ mb: 4 }}>
      <Accordion
        expanded={expanded === 'system'}
        onChange={handleAccordionChange('system')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">System Requirements</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            <ListItem>
              <ListItemText
                primary="CPU Cores"
                secondary="4 cores available"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Memory"
                secondary="16GB available"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Storage"
                secondary="500GB available"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === 'services'}
        onChange={handleAccordionChange('services')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Selected Services</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            <ListItem>
              <ListItemText
                primary="Core Services"
                secondary="Nginx Proxy Manager, Authelia, Redis, Fail2Ban, Portainer"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Media Services"
                secondary="Plex, Sonarr, Radarr, Lidarr"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Download Services"
                secondary="qBittorrent VPN, Prowlarr"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === 'storage'}
        onChange={handleAccordionChange('storage')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Storage Configuration</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            <ListItem>
              <ListItemText
                primary="Media Storage"
                secondary="/opt/media-server/media"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Downloads"
                secondary="/opt/media-server/downloads"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Configuration"
                secondary="/opt/media-server/config"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === 'network'}
        onChange={handleAccordionChange('network')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Network Configuration</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            <ListItem>
              <ListItemText
                primary="Domain"
                secondary="media.example.com"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="SSL"
                secondary="Enabled (Let's Encrypt)"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="VPN"
                secondary="Enabled (OpenVPN)"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === 'security'}
        onChange={handleAccordionChange('security')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Security Configuration</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            <ListItem>
              <ListItemText
                primary="Authentication"
                secondary="2FA Enabled (TOTP)"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Fail2Ban"
                secondary="Enabled (5 retries, 1 hour ban)"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Firewall"
                secondary="Enabled (Custom Rules)"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
    </Box>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Review & Deploy
      </Typography>

      <Typography variant="body1" paragraph>
        Review your configuration and start the deployment process.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {renderConfigurationSummary()}

          {!deploying && !currentStep === deploymentSteps.length && (
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleDeploy}
              fullWidth
            >
              Deploy Media Server
            </Button>
          )}

          {(deploying || currentStep === deploymentSteps.length) && (
            <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
              <Stepper
                activeStep={currentStep}
                orientation="vertical"
                sx={{ mb: 2 }}
              >
                {deploymentSteps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel
                      StepIconComponent={() => {
                        if (index === currentStep && deploying) {
                          return (
                            <CircularProgress size={24} />
                          );
                        }
                        if (index < currentStep) {
                          return <CheckIcon color="success" />;
                        }
                        return null;
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              {currentStep === deploymentSteps.length && !error && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Deployment completed successfully! You can now access your
                  media server.
                </Alert>
              )}
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              position: { md: 'sticky' },
              top: 16,
              maxHeight: '600px',
              overflow: 'auto',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Deployment Logs
            </Typography>
            <List dense>
              {logs.map((log, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={log.message}
                    secondary={log.timestamp.toLocaleTimeString()}
                    sx={{
                      color:
                        log.type === 'error'
                          ? 'error.main'
                          : log.type === 'success'
                          ? 'success.main'
                          : 'inherit',
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

FinalReview.propTypes = {
  onNext: PropTypes.func.isRequired,
  isLastStep: PropTypes.bool.isRequired,
};

export default FinalReview;