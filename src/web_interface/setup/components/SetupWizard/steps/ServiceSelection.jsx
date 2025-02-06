import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Tooltip,
  Alert,
  Grid,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

const serviceCategories = [
  {
    name: 'Core Services',
    description: 'Essential services for system operation',
    required: true,
    services: [
      {
        id: 'nginx',
        name: 'Nginx Proxy Manager',
        description: 'Reverse proxy and SSL management',
        required: true,
        resources: { cpu: 1, memory: 512 },
      },
      {
        id: 'authelia',
        name: 'Authelia',
        description: 'Authentication and 2FA',
        required: true,
        resources: { cpu: 1, memory: 512 },
        dependencies: ['redis'],
      },
      {
        id: 'redis',
        name: 'Redis',
        description: 'Session management',
        required: true,
        resources: { cpu: 1, memory: 256 },
      },
    ],
  },
  {
    name: 'Media Services',
    description: 'Core media server and management',
    services: [
      {
        id: 'plex',
        name: 'Plex Media Server',
        description: 'Media streaming server',
        resources: { cpu: 2, memory: 2048 },
      },
      {
        id: 'sonarr',
        name: 'Sonarr',
        description: 'TV show management',
        resources: { cpu: 1, memory: 512 },
        dependencies: ['qbittorrent'],
      },
      {
        id: 'radarr',
        name: 'Radarr',
        description: 'Movie management',
        resources: { cpu: 1, memory: 512 },
        dependencies: ['qbittorrent'],
      },
      {
        id: 'lidarr',
        name: 'Lidarr',
        description: 'Music management',
        resources: { cpu: 1, memory: 512 },
        dependencies: ['qbittorrent'],
      },
    ],
  },
  {
    name: 'Download Management',
    description: 'Download clients and tools',
    services: [
      {
        id: 'qbittorrent',
        name: 'qBittorrent VPN',
        description: 'Torrent client with VPN',
        resources: { cpu: 1, memory: 512 },
      },
      {
        id: 'nzbget',
        name: 'NZBGet',
        description: 'Usenet downloader',
        resources: { cpu: 1, memory: 512 },
      },
      {
        id: 'prowlarr',
        name: 'Prowlarr',
        description: 'Indexer management',
        resources: { cpu: 1, memory: 256 },
      },
    ],
  },
  {
    name: 'Book Services',
    description: 'Book and audiobook management',
    services: [
      {
        id: 'readarr',
        name: 'Readarr',
        description: 'Book management',
        resources: { cpu: 1, memory: 512 },
        dependencies: ['qbittorrent'],
      },
      {
        id: 'audiobookshelf',
        name: 'Audiobookshelf',
        description: 'Audiobook server',
        resources: { cpu: 1, memory: 512 },
      },
      {
        id: 'calibre',
        name: 'Calibre',
        description: 'Full-featured ebook management system and server',
        resources: { cpu: 1, memory: 1024 },
      },
    ],
  },
  {
    name: 'Monitoring',
    description: 'System monitoring and management',
    services: [
      {
        id: 'prometheus',
        name: 'Prometheus',
        description: 'Metrics collection',
        resources: { cpu: 1, memory: 512 },
      },
      {
        id: 'grafana',
        name: 'Grafana',
        description: 'Monitoring dashboard',
        resources: { cpu: 1, memory: 512 },
        dependencies: ['prometheus'],
      },
      {
        id: 'tautulli',
        name: 'Tautulli',
        description: 'Plex statistics',
        resources: { cpu: 1, memory: 256 },
        dependencies: ['plex'],
      },
    ],
  },
];

const ServiceSelection = ({ onNext }) => {
  const [selectedServices, setSelectedServices] = useState(
    new Set(
      serviceCategories
        .flatMap((category) => category.services)
        .filter((service) => service.required)
        .map((service) => service.id)
    )
  );

  const [expandedCategory, setExpandedCategory] = useState('Core Services');

  const handleServiceToggle = (serviceId) => {
    const newSelected = new Set(selectedServices);
    const service = serviceCategories
      .flatMap((category) => category.services)
      .find((s) => s.id === serviceId);

    if (service.required) {
      return; // Can't toggle required services
    }

    if (selectedServices.has(serviceId)) {
      // Remove service and check if any other services depend on it
      const dependentServices = serviceCategories
        .flatMap((category) => category.services)
        .filter(
          (s) =>
            selectedServices.has(s.id) &&
            s.dependencies?.includes(serviceId)
        );

      if (dependentServices.length > 0) {
        alert(
          `Cannot remove ${
            service.name
          } as it is required by: ${dependentServices
            .map((s) => s.name)
            .join(', ')}`
        );
        return;
      }

      newSelected.delete(serviceId);
    } else {
      // Add service and its dependencies
      newSelected.add(serviceId);
      if (service.dependencies) {
        service.dependencies.forEach((dep) => newSelected.add(dep));
      }
    }

    setSelectedServices(newSelected);
  };

  const calculateResourceUsage = () => {
    const selectedServicesList = serviceCategories
      .flatMap((category) => category.services)
      .filter((service) => selectedServices.has(service.id));

    return selectedServicesList.reduce(
      (total, service) => ({
        cpu: total.cpu + service.resources.cpu,
        memory: total.memory + service.resources.memory,
      }),
      { cpu: 0, memory: 0 }
    );
  };

  const resources = calculateResourceUsage();

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Select Services
      </Typography>

      <Typography variant="body1" paragraph>
        Choose the services you want to install. Required services cannot be
        deselected.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {serviceCategories.map((category) => (
            <Accordion
              key={category.name}
              expanded={expandedCategory === category.name}
              onChange={() =>
                setExpandedCategory(
                  expandedCategory === category.name ? '' : category.name
                )
              }
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle1">{category.name}</Typography>
                  {category.required && (
                    <Chip
                      label="Required"
                      size="small"
                      color="primary"
                      sx={{ ml: 1 }}
                    />
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  paragraph
                >
                  {category.description}
                </Typography>
                <FormGroup>
                  {category.services.map((service) => (
                    <FormControlLabel
                      key={service.id}
                      control={
                        <Checkbox
                          checked={selectedServices.has(service.id)}
                          onChange={() => handleServiceToggle(service.id)}
                          disabled={service.required}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography>{service.name}</Typography>
                          <Tooltip title={service.description}>
                            <InfoIcon
                              fontSize="small"
                              sx={{ ml: 1, color: 'action.active' }}
                            />
                          </Tooltip>
                          {service.required && (
                            <Chip
                              label="Required"
                              size="small"
                              sx={{ ml: 1 }}
                            />
                          )}
                          {service.dependencies && (
                            <Tooltip
                              title={`Requires: ${service.dependencies.join(
                                ', '
                              )}`}
                            >
                              <Chip
                                label="Has Dependencies"
                                size="small"
                                sx={{ ml: 1 }}
                              />
                            </Tooltip>
                          )}
                        </Box>
                      }
                    />
                  ))}
                </FormGroup>
              </AccordionDetails>
            </Accordion>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            variant="outlined"
            sx={{ p: 2, position: { md: 'sticky' }, top: 16 }}
          >
            <Typography variant="h6" gutterBottom>
              Resource Summary
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Estimated resource usage for selected services:
              </Typography>
              <Typography variant="body1">
                CPU Cores: {resources.cpu}
              </Typography>
              <Typography variant="body1">
                Memory: {(resources.memory / 1024).toFixed(1)}GB
              </Typography>
            </Box>

            <Alert severity="info">
              These are estimated minimum requirements. Actual usage may vary
              based on your media library size and usage patterns.
            </Alert>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

ServiceSelection.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default ServiceSelection;