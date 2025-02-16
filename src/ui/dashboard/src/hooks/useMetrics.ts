import { useState, useCallback } from 'react';
import type { MetricDataPoint, MetricsHook, SystemState } from '../types';

const MAX_HISTORY_POINTS = 100;

export function useMetrics(): MetricsHook {
  const [metrics, setMetrics] = useState<MetricDataPoint[]>([]);

  const addMetric = useCallback((state: SystemState) => {
    const newPoint: MetricDataPoint = {
      timestamp: new Date().toISOString(),
      cpu: state.cpu.usage,
      memory: state.memory.usage,
      disk: state.disk.usage,
    };

    setMetrics(currentMetrics => {
      const updatedMetrics = [...currentMetrics, newPoint];
      // Keep only the last MAX_HISTORY_POINTS
      if (updatedMetrics.length > MAX_HISTORY_POINTS) {
        return updatedMetrics.slice(-MAX_HISTORY_POINTS);
      }
      return updatedMetrics;
    });
  }, []);

  return {
    metrics,
    addMetric,
  };
}

// Helper function to calculate moving average
export function calculateMovingAverage(
  data: number[],
  windowSize: number = 5
): number[] {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const window = data.slice(start, i + 1);
    const average = window.reduce((sum, val) => sum + val, 0) / window.length;
    result.push(average);
  }
  return result;
}

// Helper function to format timestamp for display
export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
}

// Helper function to get status color
export function getStatusColor(status: string): string {
  switch (status) {
    case 'healthy':
      return '#4caf50';
    case 'warning':
      return '#ff9800';
    case 'critical':
      return '#f44336';
    case 'unknown':
      return '#9e9e9e';
    default:
      return '#9e9e9e';
  }
}