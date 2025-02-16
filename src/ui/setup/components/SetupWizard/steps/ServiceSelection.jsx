import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon
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
        description: 'Two-factor authentication and SSO',
        required: true,
        resources: { cpu: 1, memory: 512 },
        dependencies: ['redis'],
      },
      {
        id: 'redis',
        name: 'Redis',
        description: 'Session management for Authelia',
        required: true,
        resources: { cpu: 1, memory: 256 },
      },
      {
        id: 'fail2ban',
        name: 'Fail2Ban',
        description: 'Intrusion prevention system',
        required: true,
        resources: { cpu: 1, memory: 256 },
      },
      {
        id: 'portainer',
        name: 'Portainer',
        description: 'Docker management interface',
        required: true,
        resources: { cpu: 1, memory: 256 },
        dependencies: ['nginx-proxy-manager', 'authelia'],
        securityNotes: 'Protected by 2FA and SSL encryption',
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
        dependencies: ['qbittorrent', 'prowlarr'],
      },
      {
        id: 'radarr',
        name: 'Radarr',
        description: 'Movie management',
        resources: { cpu: 1, memory: 512 },
        dependencies: ['qbittorrent', 'prowlarr'],
      },
      {
        id: 'lidarr',
        name: 'Lidarr',
        description: 'Music management',
        resources: { cpu: 1, memory: 512 },
        dependencies: ['qbittorrent', 'prowlarr'],
      },
      {
        id: 'bazarr',
        name: 'Bazarr',
        description: 'Subtitle management',
        resources: { cpu: 1, memory: 512 },
        dependencies: ['sonarr', 'radarr'],
      },
    ],
  },
  {
    name: 'Download Management',
    description: 'Download clients and tools',
    services: [
      {
        id: 'qbittorrent',
        name: 'qBittorrent',
        description: 'Torrent client',
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
        dependencies: ['qbittorrent'],
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
        id: 'calibre',
        name: 'Calibre',
        description: 'Full-featured ebook management system and server',
        resources: { cpu: 1, memory: 1024 },
      },
      {
        id: 'audiobookshelf',
        name: 'Audiobookshelf',
        description: 'Audiobook and podcast server',
        resources: { cpu: 1, memory: 512 },
      },
      {
        id: 'lazylibrarian',
        name: 'LazyLibrarian',
        description: 'Book download automation',
        resources: { cpu: 1, memory: 512 },
        dependencies: ['qbittorrent'],
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
        description: 'Metrics visualization',
        resources: { cpu: 1, memory: 512 },
        dependencies: ['prometheus'],
      },
      {
        id: 'tautulli',
        name: 'Tautulli',
        description: 'Plex statistics and monitoring',
        resources: { cpu: 1, memory: 256 },
        dependencies: ['plex'],
      },
      {
        id: 'watchtower',
        name: 'Watchtower',
        description: 'Automatic container updates',
        resources: { cpu: 1, memory: 256 },
      },
    ],
  },
  {
    name: 'UI Services',
    description: 'User interface and request management',
    services: [
      {
        id: 'organizr',
        name: 'Organizr',
        description: 'Services dashboard',
        resources: { cpu: 1, memory: 256 },
      },
      {
        id: 'overseerr',
        name: 'Overseerr',
        description: 'Media request management',
        resources: { cpu: 1, memory: 512 },
        dependencies: ['plex'],
      },
      {
        id: 'watchlist',
        name: 'Watchlist',
        description: 'Media watchlist management',
        resources: { cpu: 1, memory: 256 },
      },
    ],
  },
  {
    name: 'Remote Access',
    description: 'Secure remote desktop access',
    services: [
      {
        id: 'novnc',
        name: 'noVNC',
        description: 'Web-based VNC client with secure proxy',
        resources: { cpu: 1, memory: 256 },
        dependencies: ['vnc', 'nginx', 'authelia'],
        securityNotes: 'Protected by 2FA and SSL encryption',
      },
      {
        id: 'vnc',
        name: 'VNC Server',
        description: 'Remote desktop server with KDE environment',
        resources: { cpu: 2, memory: 2048 },
        dependencies: ['nginx', 'authelia'],
        securityNotes: 'Protected by 2FA and Fail2Ban',
      },
    ],
  },
  {
    name: 'Utility Services',
    description: 'Additional utility and automation tools',
    services: [
      {
        id: 'recyclarr',
        name: 'Recyclarr',
        description: 'Configuration management',
        resources: { cpu: 1, memory: 256 },
        dependencies: ['radarr', 'sonarr'],
      },
      {
        id: 'unpackerr',
        name: 'Unpackerr',
        description: 'Automated extraction',
        resources: { cpu: 1, memory: 256 },
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
      <h2>Select Services</h2>
      <p>Choose the services you want to install. Required services cannot be deselected.</p>

      <Box
        sx={{
          p: 2,
          mb: 2,
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          bgcolor: 'white'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography sx={{ fontSize: '1rem', fontWeight: 500, color: '#333' }}>
            Resource Summary
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography sx={{ fontSize: '0.875rem', color: '#333' }}>
              CPU Cores: {resources.cpu}
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', color: '#333' }}>
              Memory: {(resources.memory / 1024).toFixed(1)}GB
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            p: 1.5,
            bgcolor: '#e3f2fd',
            borderLeft: '4px solid #2196f3',
            borderRadius: '4px',
            '& p': {
              fontSize: '0.875rem',
              color: '#1565c0',
              m: 0
            }
          }}
        >
          <p>
            These are estimated minimum requirements. Actual usage may vary
            based on your media library size and usage patterns.
          </p>
        </Box>
      </Box>

      <Box>
        {serviceCategories.map((category) => (
          <Accordion
            key={category.name}
            expanded={expandedCategory === category.name}
            onChange={() =>
              setExpandedCategory(
                expandedCategory === category.name ? '' : category.name
              )
            }
            sx={{
              mb: 2,
              '& .MuiAccordionSummary-root': {
                background: '#f8f9fa',
                borderBottom: '1px solid #e0e0e0'
              },
              '& .MuiAccordionSummary-content': {
                my: 1
              }
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontSize: '1rem', fontWeight: 500, color: '#333' }}>
                  {category.name}
                </Typography>
                {category.required && (
                  <Chip
                    label="Required"
                    size="small"
                    sx={{
                      ml: 1,
                      bgcolor: '#1976d2',
                      color: 'white',
                      fontSize: '0.75rem',
                      height: '24px'
                    }}
                  />
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 2, pb: 1 }}>
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  color: '#666',
                  mb: 2
                }}
              >
                {category.description}
              </Typography>
              <FormGroup sx={{ gap: 1 }}>
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
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1
                      }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: '#333',
                            mb: 0.5
                          }}>
                            {service.name}
                          </Typography>
                          <Typography sx={{
                            fontSize: '0.875rem',
                            color: '#666'
                          }}>
                            {service.description}
                          </Typography>
                        </Box>
                        <Box sx={{
                          display: 'flex',
                          gap: 0.5,
                          mt: 0.5
                        }}>
                          {service.required && (
                            <Chip
                              label="Required"
                              size="small"
                              sx={{
                                bgcolor: '#1976d2',
                                color: 'white',
                                fontSize: '0.75rem',
                                height: '24px'
                              }}
                            />
                          )}
                          {service.dependencies && (
                            <Tooltip title={`Requires: ${service.dependencies.join(', ')}`}>
                              <Chip
                                label="Has Dependencies"
                                size="small"
                                sx={{
                                  bgcolor: '#ff9800',
                                  color: 'white',
                                  fontSize: '0.75rem',
                                  height: '24px'
                                }}
                              />
                            </Tooltip>
                          )}
                          {service.securityNotes && (
                            <Tooltip title={service.securityNotes}>
                              <Chip
                                label="Security Info"
                                size="small"
                                sx={{
                                  bgcolor: '#4caf50',
                                  color: 'white',
                                  fontSize: '0.75rem',
                                  height: '24px'
                                }}
                              />
                            </Tooltip>
                          )}
                        </Box>
                      </Box>
                    }
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};

ServiceSelection.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default ServiceSelection;