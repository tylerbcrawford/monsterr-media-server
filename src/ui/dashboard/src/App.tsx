import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { SystemMetrics } from './components/SystemMetrics';
import { ServiceHealth } from './components/ServiceHealth';
import { AlertHistory } from './components/AlertHistory';
import { NetworkStatus } from './components/NetworkStatus';
import { Header } from './components/Header';
import { useWebSocket } from './hooks/useWebSocket';
import { useMetrics } from './hooks/useMetrics';
import type { SystemState } from './types';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#0a1929',
      paper: '#132f4c',
    },
  },
});

export default function App() {
  const [systemState, setSystemState] = useState<SystemState>({
    cpu: { usage: 0, status: 'healthy' },
    memory: { usage: 0, status: 'healthy' },
    disk: { usage: 0, status: 'healthy' },
    services: [],
    alerts: [],
    network: { status: 'checking' }
  });

  const { metrics, addMetric } = useMetrics();
  const socket = useWebSocket('ws://localhost:3001');

  useEffect(() => {
    if (!socket) return;

    socket.on('metrics', (data) => {
      setSystemState(data);
      addMetric(data);
    });

    return () => {
      socket.off('metrics');
    };
  }, [socket, addMetric]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Header />
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, height: '400px' }}>
              <SystemMetrics metrics={metrics} currentState={systemState} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '400px' }}>
              <ServiceHealth services={systemState.services} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, height: '300px' }}>
              <AlertHistory alerts={systemState.alerts} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '300px' }}>
              <NetworkStatus status={systemState.network} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}