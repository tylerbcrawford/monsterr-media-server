import { Box, Typography, List, ListItem, ListItemText, Chip, Tooltip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import HelpIcon from '@mui/icons-material/Help';
import type { Service } from '../types';
import { formatTimestamp } from '../hooks/useMetrics';

interface ServiceHealthProps {
  services: Service[];
}

function getStatusIcon(status: string, health: string) {
  const iconProps = { fontSize: "small" as const, sx: { mr: 1 } };
  
  if (status !== 'running') {
    return <ErrorIcon color="error" {...iconProps} />;
  }

  switch (health) {
    case 'healthy':
      return <CheckCircleIcon color="success" {...iconProps} />;
    case 'warning':
      return <WarningIcon color="warning" {...iconProps} />;
    case 'critical':
      return <ErrorIcon color="error" {...iconProps} />;
    default:
      return <HelpIcon color="disabled" {...iconProps} />;
  }
}

function getStatusColor(status: string, health: string) {
  if (status !== 'running') return 'error';
  
  switch (health) {
    case 'healthy':
      return 'success';
    case 'warning':
      return 'warning';
    case 'critical':
      return 'error';
    default:
      return 'default';
  }
}

export function ServiceHealth({ services }: ServiceHealthProps) {
  const sortedServices = [...services].sort((a, b) => {
    // Sort by status first (running services first)
    if (a.status !== b.status) {
      return a.status === 'running' ? -1 : 1;
    }
    // Then sort by health (healthy first)
    if (a.health !== b.health) {
      return a.health === 'healthy' ? -1 : 1;
    }
    // Finally sort by name
    return a.name.localeCompare(b.name);
  });

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Service Health
      </Typography>
      <List dense>
        {sortedServices.map((service) => (
          <ListItem
            key={service.name}
            sx={{
              borderRadius: 1,
              mb: 1,
              bgcolor: 'background.paper',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {getStatusIcon(service.status, service.health)}
                  <Typography variant="body2">
                    {service.name}
                  </Typography>
                </Box>
              }
              secondary={
                <Tooltip title={`Last checked: ${formatTimestamp(service.lastCheck)}`}>
                  <Chip
                    size="small"
                    label={service.status === 'running' ? service.health : service.status}
                    color={getStatusColor(service.status, service.health) as any}
                    sx={{ mt: 0.5 }}
                  />
                </Tooltip>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}