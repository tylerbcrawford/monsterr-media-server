import { Box, Typography, List, ListItem, ListItemText, Chip } from '@mui/material';
import type { Alert } from '../types';
import { formatTimestamp } from '../hooks/useMetrics';

interface AlertHistoryProps {
  alerts: Alert[];
}

function getAlertColor(level: string) {
  switch (level) {
    case 'ERROR':
      return 'error';
    case 'WARNING':
      return 'warning';
    case 'INFO':
      return 'info';
    default:
      return 'default';
  }
}

export function AlertHistory({ alerts }: AlertHistoryProps) {
  const sortedAlerts = [...alerts]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10); // Show only the 10 most recent alerts

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Recent Alerts
      </Typography>
      <List dense>
        {sortedAlerts.map((alert) => (
          <ListItem
            key={alert.id}
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    size="small"
                    label={alert.level}
                    color={getAlertColor(alert.level) as any}
                  />
                  <Typography variant="body2">
                    {alert.message}
                  </Typography>
                </Box>
              }
              secondary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    {formatTimestamp(alert.timestamp)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    •
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {alert.source}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
        {sortedAlerts.length === 0 && (
          <ListItem>
            <ListItemText
              primary={
                <Typography variant="body2" color="text.secondary">
                  No recent alerts
                </Typography>
              }
            />
          </ListItem>
        )}
      </List>
    </Box>
  );
}