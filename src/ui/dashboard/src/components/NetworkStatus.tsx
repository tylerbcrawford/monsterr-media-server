import { Box, Typography, Paper, Stack, Chip } from '@mui/material';
import WifiIcon from '@mui/icons-material/Wifi';
import SignalWifiOffIcon from '@mui/icons-material/SignalWifiOff';
import type { NetworkStatus as NetworkStatusType } from '../types';
import { formatTimestamp } from '../hooks/useMetrics';

interface NetworkStatusProps {
  status: NetworkStatusType;
}

function getStatusColor(status: string) {
  switch (status) {
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

export function NetworkStatus({ status }: NetworkStatusProps) {
  const isConnected = status.status === 'healthy';

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Network Status
      </Typography>
      <Paper
        sx={{
          p: 2,
          bgcolor: 'background.paper',
          borderRadius: 1,
          height: '100%',
        }}
      >
        <Stack spacing={2} alignItems="center">
          {isConnected ? (
            <WifiIcon
              color="success"
              sx={{ fontSize: 48 }}
            />
          ) : (
            <SignalWifiOffIcon
              color="error"
              sx={{ fontSize: 48 }}
            />
          )}

          <Chip
            label={status.status}
            color={getStatusColor(status.status) as any}
            sx={{ minWidth: 100 }}
          />

          {status.latency !== undefined && (
            <Typography variant="body2" color="text.secondary">
              Latency: {status.latency}ms
            </Typography>
          )}

          {status.lastCheck && (
            <Typography variant="caption" color="text.secondary">
              Last checked: {formatTimestamp(status.lastCheck)}
            </Typography>
          )}

          {status.errors && status.errors.length > 0 && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <Typography variant="subtitle2" color="error" gutterBottom>
                Issues:
              </Typography>
              <Stack spacing={1}>
                {status.errors.map((error, index) => (
                  <Typography
                    key={index}
                    variant="caption"
                    color="error"
                    sx={{
                      bgcolor: 'error.main',
                      color: 'error.contrastText',
                      p: 1,
                      borderRadius: 1,
                    }}
                  >
                    {error}
                  </Typography>
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}