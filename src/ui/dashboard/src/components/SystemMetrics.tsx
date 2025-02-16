import { Box, Typography, Grid } from '@mui/material';
import { LineChart } from '@mui/x-charts';
import type { MetricDataPoint, SystemState } from '../types';
import { getStatusColor } from '../hooks/useMetrics';

interface SystemMetricsProps {
  metrics: MetricDataPoint[];
  currentState: SystemState;
}

export function SystemMetrics({ metrics, currentState }: SystemMetricsProps) {
  const timestamps = metrics.map(m => new Date(m.timestamp).getTime());
  const cpuData = metrics.map(m => m.cpu);
  const memoryData = metrics.map(m => m.memory);
  const diskData = metrics.map(m => m.disk);

  const commonChartProps = {
    width: 350,
    height: 200,
    margin: { top: 20, right: 20, bottom: 30, left: 40 },
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        System Resources
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'background.paper' }}>
            <Typography variant="subtitle2" gutterBottom>
              CPU Usage
            </Typography>
            <LineChart
              {...commonChartProps}
              series={[
                {
                  data: cpuData,
                  label: 'CPU %',
                  color: getStatusColor(currentState.cpu.status),
                },
              ]}
              xAxis={[{ data: timestamps, scaleType: 'time' }]}
              yAxis={[{ min: 0, max: 100 }]}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'background.paper' }}>
            <Typography variant="subtitle2" gutterBottom>
              Memory Usage
            </Typography>
            <LineChart
              {...commonChartProps}
              series={[
                {
                  data: memoryData,
                  label: 'Memory %',
                  color: getStatusColor(currentState.memory.status),
                },
              ]}
              xAxis={[{ data: timestamps, scaleType: 'time' }]}
              yAxis={[{ min: 0, max: 100 }]}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'background.paper' }}>
            <Typography variant="subtitle2" gutterBottom>
              Disk Usage
            </Typography>
            <LineChart
              {...commonChartProps}
              series={[
                {
                  data: diskData,
                  label: 'Disk %',
                  color: getStatusColor(currentState.disk.status),
                },
              ]}
              xAxis={[{ data: timestamps, scaleType: 'time' }]}
              yAxis={[{ min: 0, max: 100 }]}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}